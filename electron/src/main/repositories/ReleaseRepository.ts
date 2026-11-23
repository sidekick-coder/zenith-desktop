import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import extractZip from "extract-zip";
import type { ReleaseSchema } from "core/schemas/release.ts";
import BaseReleaseRepository from "core/repositories/ReleaseRepository.ts";

const API_URL = "https://api.github.com/repos/sidekick-coder/zenith/releases";

type GithubRelease = {
    tag_name: string;
    name: string | null;
    published_at: string | null;
    assets: Array<{
        name: string;
        browser_download_url: string;
    }>;
};

export default class ReleaseRepository extends BaseReleaseRepository {
    public directory: string;

    constructor(directory: string) {
        super();
        this.directory = directory;
        fsSync.mkdirSync(directory, { recursive: true });
    }

    public async list(): Promise<ReleaseSchema[]> {
        const response = await fetch(`${API_URL}?per_page=10`, {
            headers: { Accept: "application/vnd.github+json" },
        });

        if (!response.ok) {
            throw new Error(`Unable to list Zenith releases: ${response.status} ${response.statusText}`);
        }

        const releases = await response.json() as GithubRelease[];
        const downloadedTags = new Set(await this.downloadedTags());
        const remoteReleases = releases.map(release => this.normalize(release, downloadedTags));
        const remoteTags = new Set(remoteReleases.map(release => release.tagName));

        for (const tagName of downloadedTags) {
            if (!remoteTags.has(tagName)) {
                remoteReleases.push({
                    tagName,
                    name: tagName,
                    publishedAt: null,
                    downloaded: true,
                    assets: [],
                });
            }
        }

        return remoteReleases;
    }

    public async download(tagName: string): Promise<ReleaseSchema> {
        const release = (await this.list()).find(candidate => candidate.tagName === tagName);

        if (!release) {
            throw new Error(`Zenith release ${tagName} was not found`);
        }

        if (release.downloaded) {
            return release;
        }

        const assetName = this.serverAssetName();
        const asset = release.assets.find(candidate => candidate.name === assetName);

        if (!asset) {
            throw new Error(`Release ${release.tagName} cannot be downloaded because it does not include ${assetName}`);
        }

        const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "zenith-release-"));
        const archivePath = path.join(temporaryDirectory, "release.zip");
        const stagingPath = path.join(temporaryDirectory, "extract");

        await fs.mkdir(stagingPath);

        try {
            const response = await fetch(asset.downloadUrl);

            if (!response.ok || !response.body) {
                throw new Error(`Unable to download ${asset.downloadUrl}: ${response.status} ${response.statusText}`);
            }

            const file = await fs.open(archivePath, "w");

            try {
                const writer = file.createWriteStream();
                await response.body.pipeTo(new WritableStream({
                    write(chunk) {
                        return new Promise<void>((resolve, reject) => {
                            writer.write(Buffer.from(chunk), error => error ? reject(error) : resolve());
                        });
                    },
                    close() {
                        return new Promise<void>((resolve, reject) => {
                            writer.end((error?: Error | null) => error ? reject(error) : resolve());
                        });
                    },
                    abort(reason) {
                        writer.destroy(reason instanceof Error ? reason : new Error(String(reason)));
                    },
                }));
            } finally {
                await file.close();
            }

            await extractZip(archivePath, { dir: stagingPath });

            const extractedPath = await this.extractedPath(stagingPath);
            const destination = this.releasePath(tagName);

            await fs.rm(destination, { force: true, recursive: true });
            await fs.cp(extractedPath, destination, { dereference: true, recursive: true });
        } finally {
            await fs.rm(temporaryDirectory, { force: true, recursive: true });
        }

        if (!await this.isInstalled(tagName)) {
            throw new Error(`Release ${tagName} was downloaded but does not contain zenith.js`);
        }

        return { ...release, downloaded: true };
    }

    public async remove(tagName: string): Promise<void> {
        await fs.rm(this.releasePath(tagName), { force: true, recursive: true });
    }

    public async path(tagName: string): Promise<string> {
        return this.releasePath(tagName);
    }

    private async downloadedTags(): Promise<string[]> {
        try {
            const entries = await fs.readdir(this.directory, { withFileTypes: true });
            const tags = await Promise.all(entries
                .filter(entry => entry.isDirectory())
                .map(async entry => await this.isInstalled(entry.name) ? entry.name : null));

            return tags.filter((tag): tag is string => Boolean(tag));
        } catch (error) {
            if (this.isFileNotFoundError(error)) {
                return [];
            }

            throw new Error(`Unable to read downloaded Zenith releases: ${this.errorMessage(error)}`);
        }
    }

    private async isInstalled(tagName: string): Promise<boolean> {
        try {
            await fs.access(path.join(this.releasePath(tagName), "zenith.js"));
            return true;
        } catch {
            return false;
        }
    }

    private async extractedPath(stagingPath: string): Promise<string> {
        if (await this.fileExists(path.join(stagingPath, "zenith.js"))) {
            return stagingPath;
        }

        const entries = await fs.readdir(stagingPath, { withFileTypes: true });
        const directory = entries.find(entry => entry.isDirectory());

        if (directory && await this.fileExists(path.join(stagingPath, directory.name, "zenith.js"))) {
            return path.join(stagingPath, directory.name);
        }

        throw new Error("Downloaded Zenith release does not contain zenith.js");
    }

    private async fileExists(filename: string): Promise<boolean> {
        try {
            await fs.access(filename);
            return true;
        } catch {
            return false;
        }
    }

    private releasePath(tagName: string): string {
        if (!tagName || tagName.includes("..") || path.basename(tagName) !== tagName) {
            throw new Error(`Invalid Zenith release tag: ${tagName}`);
        }

        return path.join(this.directory, tagName);
    }

    private normalize(release: GithubRelease, downloadedTags: Set<string>): ReleaseSchema {
        return {
            tagName: release.tag_name,
            name: release.name || release.tag_name,
            publishedAt: release.published_at,
            downloaded: downloadedTags.has(release.tag_name),
            assets: release.assets.map(asset => ({
                name: asset.name,
                downloadUrl: asset.browser_download_url,
            })),
        };
    }

    private serverAssetName(): string {
        if (process.arch !== "x64") {
            throw new Error(`Zenith server binaries are unavailable for ${process.platform}-${process.arch}`);
        }

        const platform: Record<string, string> = {
            linux: "linux",
            win32: "windows",
        };
        const name = platform[process.platform];

        if (!name) {
            throw new Error(`Zenith server binaries are unavailable for ${process.platform}`);
        }

        return `zenith-${name}-x64.zip`;
    }

    private isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
        return error instanceof Error && "code" in error && error.code === "ENOENT";
    }

    private errorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
