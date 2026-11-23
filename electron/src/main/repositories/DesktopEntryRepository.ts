import BaseDesktopEntryRepository, { type DesktopEntryFilter } from "core/repositories/DesktopEntryRepository.ts";
import type { DesktopEntrySchema } from "core/schemas/desktopEntry.ts";
import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

export default class DesktopEntryRepository extends BaseDesktopEntryRepository {
    public directory: string;
    public filename: string;

    constructor() {
        super();

        this.directory = path.join(app.getPath("userData"), "data");
        this.filename = path.join(this.directory, "desktop-entries.json");

        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory, { recursive: true });
        }
    }

    public async findMany(filter: DesktopEntryFilter = {}): Promise<DesktopEntrySchema[]> {
        if (!fs.existsSync(this.filename)) {
            return [];
        }

        const entries = JSON.parse(fs.readFileSync(this.filename, "utf-8"));

        if (!Array.isArray(entries)) {
            throw new Error(`Expected ${this.filename} to contain an array of desktop entries.`);
        }

        return (entries as DesktopEntrySchema[]).filter(entry =>
            Object.entries(filter).every(([key, value]) => entry[key as keyof DesktopEntrySchema] === value)
        );
    }

    public async findOne(filter: DesktopEntryFilter): Promise<DesktopEntrySchema | null> {
        const entries = await this.findMany(filter);

        return entries[0] || null;
    }

    public async create(entry: DesktopEntrySchema): Promise<DesktopEntrySchema> {
        const entries = await this.findMany();

        if (entries.some(item => item.id === entry.id)) {
            throw new Error(`Desktop entry with id ${entry.id} already exists.`);
        }

        entries.push(entry);
        this.write(entries);

        return entry;
    }

    public async createEmpty(): Promise<DesktopEntrySchema> {
        const id = crypto.randomUUID();
        const entry: DesktopEntrySchema = {
            id,
            profile_id: "",
            filename: `${id}.desktop`,
            executable: app.getPath("exe"),
            args: "",
            name: "",
            comment: "",
            categories: "",
        };

        return this.create(entry);
    }

    public async createControlPanel(): Promise<DesktopEntrySchema> {
        const id = crypto.randomUUID();
        const entry: DesktopEntrySchema = {
            id,
            profile_id: "",
            filename: `${id}.desktop`,
            executable: app.getPath("exe"),
            args: "main",
            name: "Zenith control panel",
            comment: "Open the Zenith control panel",
            categories: "Development;",
        };

        return this.create(entry);
    }

    public async updateById(id: string, payload: Partial<Omit<DesktopEntrySchema, "id">>): Promise<DesktopEntrySchema> {
        const entries = await this.findMany();
        const index = entries.findIndex(entry => entry.id === id);

        if (index === -1) {
            throw new Error(`Desktop entry with id ${id} not found.`);
        }

        const entry = { ...entries[index], ...payload, id };

        entries[index] = entry;
        this.write(entries);

        return entry;
    }

    public async destoryById(id: string): Promise<void> {
        return this.deleteById(id);
    }

    public async deleteById(id: string): Promise<void> {
        const entries = await this.findMany();
        const remaining = entries.filter(entry => entry.id !== id);

        if (remaining.length === entries.length) {
            throw new Error(`Desktop entry with id ${id} not found.`);
        }

        this.write(remaining);
    }

    private write(entries: DesktopEntrySchema[]): void {
        fs.writeFileSync(this.filename, JSON.stringify(entries, null, 4), "utf-8");
    }
}
