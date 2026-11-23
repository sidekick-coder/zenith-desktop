import { app } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import type { DesktopEntrySchema } from "core/schemas/desktopEntry.ts";
import BaseDesktopEntryService, { type MakePayload } from "core/services/DesktopEntryService.ts";
import DesktopEntryRepository from "../repositories/DesktopEntryRepository.ts";
import profiles from "../facades/profiles.ts";

export default class DesktopEntryService extends BaseDesktopEntryService {
    public repository = new DesktopEntryRepository();

    public async make(payload: MakePayload = {}): Promise<DesktopEntrySchema> {
        if (payload.controlPanel) {
            const id = crypto.randomUUID();

            return {
                id,
                profile_id: "",
                icon_path: null,
                filename: `${id}.desktop`,
                executable: app.getPath("exe"),
                args: "main",
                name: "Zenith control panel",
                comment: "Open the Zenith control panel",
                categories: "Development;",
            };
        }

        const profile = payload.profile_id
            ? await profiles.findByIdOrFail(payload.profile_id)
            : null;
        const id = profile?.id || crypto.randomUUID();

        return {
            id,
            profile_id: profile?.id || "",
            icon_path: profile?.icon_path || null,
            filename: `${id}.desktop`,
            executable: app.getPath("exe"),
            args: profile ? `open --profile ${this.quote(profile.id)}` : "",
            name: profile?.name || "",
            comment: profile?.description || (profile ? `Open ${profile.name || profile.id}` : ""),
            categories: "Development;",
        };
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
            ...(entry.icon_path ? [`Icon=${this.escapeValue(entry.icon_path)}`] : []),
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
