import type { DesktopEntrySchema } from "../schemas/desktopEntry.ts";

export type DesktopEntryFilter = Partial<Pick<DesktopEntrySchema, "id" | "profile_id">>;

export default class DesktopEntryRepository {
    public async findMany(_filter: DesktopEntryFilter = {}): Promise<DesktopEntrySchema[]> {
        throw new Error("Method not implemented.");
    }

    public async findOne(_filter: DesktopEntryFilter): Promise<DesktopEntrySchema | null> {
        throw new Error("Method not implemented.");
    }

    public async create(_entry: DesktopEntrySchema): Promise<DesktopEntrySchema> {
        throw new Error("Method not implemented.");
    }

    public async updateById(_id: string, _payload: Partial<Omit<DesktopEntrySchema, "id">>): Promise<DesktopEntrySchema> {
        throw new Error("Method not implemented.");
    }

    public async destoryById(_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async deleteById(_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
