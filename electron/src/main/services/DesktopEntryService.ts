import { app } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import type { ProfileSchema } from "core/schemas/profile.ts";
import type { DesktopEntrySchema } from "core/schemas/desktopEntry.ts";
import BaseDesktopEntryService from "core/services/DesktopEntryService.ts";
import DesktopEntryRepository from "../repositories/DesktopEntryRepository.ts";

export default class DesktopEntryService extends BaseDesktopEntryService {
    public repository = new DesktopEntryRepository();

    public async create(profile: ProfileSchema): Promise<string> {
        if (process.platform !== "linux") {
            throw new Error("Desktop entries are currently supported on Linux only.");
        }

        const dataHome = process.env.XDG_DATA_HOME || path.join(app.getPath("home"), ".local", "share");
        const directory = path.join(dataHome, "applications");
        const filename = path.join(directory, `zenith-${this.filenamePart(profile.id)}.desktop`);
        const entry = [
            "[Desktop Entry]",
            "Type=Application",
            `Name=${this.escapeValue(profile.name || profile.id)}`,
            `Comment=${this.escapeValue(profile.description || `Open ${profile.name || profile.id}`)}`,
            `Exec=${this.quote(app.getPath("exe"))} open --profile ${this.quote(profile.id)}`,
            "Terminal=false",
            "Categories=Development;",
            "",
        ].join("\n");

        await fs.mkdir(directory, { recursive: true });
        await fs.writeFile(filename, entry, { encoding: "utf-8", mode: 0o755 });
        await fs.chmod(filename, 0o755);

        const desktopEntry: DesktopEntrySchema = {
            id: profile.id,
            profile_id: profile.id,
            filename,
            executable: app.getPath("exe"),
            args: `open --profile ${this.quote(profile.id)}`,
            name: profile.name || profile.id,
            comment: profile.description || `Open ${profile.name || profile.id}`,
            categories: "Development;",
        };
        const existing = await this.repository.findOne({ id: profile.id });

        if (existing) {
            await this.repository.updateById(profile.id, desktopEntry);
        } else {
            await this.repository.create(desktopEntry);
        }

        return filename;
    }

    public async generate(entry: DesktopEntrySchema): Promise<string> {
        if (process.platform !== "linux") {
            throw new Error("Desktop entries are currently supported on Linux only.");
        }

        const dataHome = process.env.XDG_DATA_HOME || path.join(app.getPath("home"), ".local", "share");
        const defaultDirectory = path.join(dataHome, "applications");
        const filename = path.isAbsolute(entry.filename)
            ? entry.filename
            : path.join(defaultDirectory, this.filenamePart(entry.filename));
        const command = [this.quote(entry.executable), entry.args].filter(Boolean).join(" ");
        const desktopFile = [
            "[Desktop Entry]",
            "Type=Application",
            `Name=${this.escapeValue(entry.name)}`,
            `Comment=${this.escapeValue(entry.comment)}`,
            `Exec=${command}`,
            "Terminal=false",
            `Categories=${entry.categories}`,
            "",
        ].join("\n");

        await fs.mkdir(path.dirname(filename), { recursive: true });
        await fs.writeFile(filename, desktopFile, { encoding: "utf-8", mode: 0o755 });
        await fs.chmod(filename, 0o755);
        await this.repository.updateById(entry.id, { ...entry, filename });

        return filename;
    }

    private filenamePart(value: string): string {
        return value.replace(/[^a-zA-Z0-9._-]/g, "-");
    }

    private quote(value: string): string {
        return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("$", "\\$").replaceAll("`", "\\`")}"`;
    }

    private escapeValue(value: string): string {
        return value
            .replaceAll("\\", "\\\\")
            .replaceAll("\n", "\\n")
            .replaceAll("\r", "\\r");
    }
}
