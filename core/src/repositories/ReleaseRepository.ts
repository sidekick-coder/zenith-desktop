import type { ReleaseSchema } from "../schemas/release.ts";

export default class ReleaseRepository {
    public async list(): Promise<ReleaseSchema[]> {
        throw new Error("Method not implemented.");
    }

    public async download(_tagName: string): Promise<ReleaseSchema> {
        throw new Error("Method not implemented.");
    }

    public async remove(_tagName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async path(_tagName: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
