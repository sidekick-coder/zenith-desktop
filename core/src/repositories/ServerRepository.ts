import type { ServerSchema } from "../schemas/server.ts";

export type ServerFilter = Partial<Pick<ServerSchema, "id" | "profile_id">>;

export default class ServerRepository {
    public async findMany(_filter?: ServerFilter): Promise<ServerSchema[]> {
        throw new Error("Method not implemented.");
    }

    public async findOne(_filter: ServerFilter): Promise<ServerSchema | null> {
        throw new Error("Method not implemented.");
    }

    public async create(_server: ServerSchema): Promise<ServerSchema> {
        throw new Error("Method not implemented.");
    }

    public async updateById(_id: string, _payload: Partial<Omit<ServerSchema, "id">>): Promise<ServerSchema> {
        throw new Error("Method not implemented.");
    }

    public async destoryById(_id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
