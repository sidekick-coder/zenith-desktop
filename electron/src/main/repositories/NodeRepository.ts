import { constants } from "node:fs";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import extractZip from "extract-zip";
import * as tar from "tar";
import type { NodeSchema } from "core/schemas/node.ts";
import BaseNodeRepository from "core/repositories/NodeRepository.ts";

const NODE_INDEX_URL = "https://nodejs.org/dist/index.json";

type NodeRelease = {
    version: string;
    lts: string | boolean;
    date: string;
    files: string[];
};

const PLATFORM_NAMES: Record<string, string> = {
    darwin: "darwin",
    linux: "linux",
    win32: "win",
};

const INDEX_PLATFORM_NAMES: Record<string, string> = {
    darwin: "osx",
    linux: "linux",
    win32: "win",
};

const ARCHITECTURE_NAMES: Record<string, string> = {
    arm64: "arm64",
    x64: "x64",
};

export default class NodeRepository extends BaseNodeRepository {
    public directory: string;

    constructor(directory: string) {
        super();
        this.directory = directory;
        fsSync.mkdirSync(directory, { recursive: true });
    }

    public async list(): Promise<NodeSchema[]> {
        const releases = await this.releases();
        const latestReleases: NodeRelease[] = [];
        const listedMajors = new Set<number>();

        for (const release of releases) {
            const major = this.majorVersion(release.version);

            if (!listedMajors.has(major)) {
                latestReleases.push(release);
                listedMajors.add(major);
            }
        }

        const installedVersions = new Set(await this.installedVersions());
        const nodes = latestReleases.map(release => this.normalize(release, installedVersions));
        const listedVersions = new Set(nodes.map(node => node.version));

        for (const version of installedVersions) {
            if (!listedVersions.has(version)) {
                nodes.push({
                    version,
                    lts: false,
                    installed: true,
                    releasedAt: null,
                });
            }
        }

        return nodes;
    }

    public async download(version: string): Promise<NodeSchema> {
        this.validateVersion(version);

        const release = (await this.releases()).find(candidate => candidate.version === version);

        if (!release) {
            throw new Error(`Node version ${version} was not found`);
        }

        const installedVersions = new Set(await this.installedVersions());

        if (installedVersions.has(version)) {
            return this.normalize(release, installedVersions);
        }

        const distribution = this.distribution(version);
        await fs.mkdir(this.directory, { recursive: true });
        const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "zenith-node-"));
        const archivePath = path.join(temporaryDirectory, `download.${distribution.archiveType}`);
        const stagingPath = path.join(temporaryDirectory, "extract");

        await fs.mkdir(stagingPath);

        try {
            const response = await fetch(distribution.url);

            if (!response.ok || !response.body) {
                throw new Error(`Unable to download ${distribution.url}: ${response.status} ${response.statusText}`);
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

            if (distribution.archiveType === "zip") {
                await extractZip(archivePath, { dir: stagingPath });
            } else {
                await tar.x({
                    cwd: stagingPath,
                    file: archivePath,
                    strip: 1,
                });
            }

            const extractedPath = distribution.sourceDirectory
                ? path.join(stagingPath, distribution.sourceDirectory)
                : stagingPath;
            const destination = this.pathsFor(version).folder;

            await fs.rm(destination, { force: true, recursive: true });
            await fs.cp(extractedPath, destination, { dereference: true, recursive: true });
        } finally {
            await Promise.all([
                fs.rm(temporaryDirectory, { force: true, recursive: true }),
            ]);
        }

        const updatedInstalledVersions = new Set(await this.installedVersions());

        if (!updatedInstalledVersions.has(version)) {
            throw new Error(`Node ${version} was downloaded but is missing node or npm`);
        }

        return this.normalize(release, updatedInstalledVersions);
    }

    public async remove(version: string): Promise<void> {
        this.validateVersion(version);
        await fs.rm(this.pathsFor(version).folder, { force: true, recursive: true });
    }

    public async path(version: string): Promise<string> {
        return this.pathsFor(version).nodePath;
    }

    public pathsFor(version: string) {
        this.validateVersion(version);

        const name = this.distributionName(version);
        const folder = path.join(this.directory, name);
        const windows = process.platform === "win32";

        return {
            folder,
            nodePath: windows ? path.join(folder, "node.exe") : path.join(folder, "bin", "node"),
            npmPath: windows ? path.join(folder, "npm.cmd") : path.join(folder, "bin", "npm"),
        };
    }

    private async installedVersions(): Promise<string[]> {
        try {
            const entries = await fs.readdir(this.directory, { withFileTypes: true });
            const versions = entries
                .filter(entry => entry.isDirectory())
                .map(entry => this.versionFromDirectory(entry.name))
                .filter((version): version is string => Boolean(version));

            const installed = await Promise.all(versions.map(async version =>
                await this.isInstalled(version) ? version : null
            ));

            return installed.filter((version): version is string => Boolean(version));
        } catch (error) {
            if (this.isFileNotFoundError(error)) {
                return [];
            }

            throw new Error(`Unable to read downloaded Node versions: ${this.errorMessage(error)}`);
        }
    }

    private async isInstalled(version: string): Promise<boolean> {
        const { nodePath, npmPath } = this.pathsFor(version);

        try {
            await Promise.all([
                fs.access(nodePath, constants.X_OK),
                fs.access(npmPath, constants.X_OK),
            ]);
            return true;
        } catch {
            return false;
        }
    }

    private async releases(): Promise<NodeRelease[]> {
        const response = await fetch(NODE_INDEX_URL);

        if (!response.ok) {
            throw new Error(`Unable to list Node releases: ${response.status} ${response.statusText}`);
        }

        const releases = await response.json() as NodeRelease[];

        return releases.filter(release => this.isSupportedRelease(release));
    }

    private distribution(version: string) {
        const name = this.distributionName(version);
        const windows = process.platform === "win32";

        return {
            archiveType: windows ? "zip" : "tar.gz",
            sourceDirectory: windows ? name : undefined,
            url: `https://nodejs.org/dist/${version}/${name}.${windows ? "zip" : "tar.gz"}`,
        };
    }

    private distributionName(version: string): string {
        const platform = PLATFORM_NAMES[process.platform];
        const architecture = ARCHITECTURE_NAMES[process.arch];

        if (!platform || !architecture) {
            throw new Error(`Unsupported Node platform: ${process.platform}-${process.arch}`);
        }

        return `node-${version}-${platform}-${architecture}`;
    }

    private isSupportedRelease(release: NodeRelease): boolean {
        const platform = INDEX_PLATFORM_NAMES[process.platform];
        const architecture = ARCHITECTURE_NAMES[process.arch];

        if (!platform || !architecture) {
            return false;
        }

        const fileName = process.platform === "win32"
            ? `${platform}-${architecture}-zip`
            : process.platform === "darwin"
                ? `${platform}-${architecture}-tar`
                : `${platform}-${architecture}`;

        return this.majorVersion(release.version) >= 22 && release.files.includes(fileName);
    }

    private versionFromDirectory(directoryName: string): string | null {
        const match = /^node-(v\d+\.\d+\.\d+)-(darwin|linux|win)-(arm64|x64)$/.exec(directoryName);

        if (!match || match[2] !== PLATFORM_NAMES[process.platform] || match[3] !== ARCHITECTURE_NAMES[process.arch]) {
            return null;
        }

        return this.majorVersion(match[1]) >= 22 ? match[1] : null;
    }

    private normalize(release: NodeRelease, installedVersions: Set<string>): NodeSchema {
        return {
            version: release.version,
            lts: Boolean(release.lts),
            installed: installedVersions.has(release.version),
            releasedAt: release.date,
        };
    }

    private majorVersion(version: string): number {
        return Number.parseInt(version.slice(1).split(".")[0], 10);
    }

    private validateVersion(version: string): void {
        if (typeof version !== "string" || !/^v\d+\.\d+\.\d+$/.test(version)) {
            throw new Error("Node version must use the v<major>.<minor>.<patch> format");
        }
    }

    private isFileNotFoundError(error: unknown): error is NodeJS.ErrnoException {
        return error instanceof Error && "code" in error && error.code === "ENOENT";
    }

    private errorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
