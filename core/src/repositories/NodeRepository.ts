import type { NodeSchema } from "../schemas/node.ts";

export default class NodeRepository {
    public async list(): Promise<NodeSchema[]> {
        throw new Error("Method not implemented.");
    }

    public async download(_version: string): Promise<NodeSchema> {
        throw new Error("Method not implemented.");
    }

    public async remove(_version: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async path(_version: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
