import BaseServerRepository, { type ServerFilter } from "core/repositories/ServerRepository.ts";
import type { ServerSchema } from "core/schemas/server.ts";
import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

export default class ServerRepository extends BaseServerRepository {
    public directory: string;
    public filename: string;

    constructor() {
        super();

        this.directory = app.getPath("userData");
        this.filename = path.join(this.directory, "servers.json");

        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory, { recursive: true });
        }
    }

    private write(servers: ServerSchema[]): void {
        fs.writeFileSync(this.filename, JSON.stringify(servers, null, 4), "utf-8");
    }

    public async findMany(filter: ServerFilter = {}): Promise<ServerSchema[]> {
        if (!fs.existsSync(this.filename)) {
            return [];
        }

        const servers = JSON.parse(fs.readFileSync(this.filename, "utf-8"));

        if (!Array.isArray(servers)) {
            throw new Error(`Expected ${this.filename} to contain an array of servers.`);
        }

        return (servers as ServerSchema[]).filter(server =>
            Object.entries(filter).every(([key, value]) => server[key as keyof ServerSchema] === value)
        );
    }

    public async findOne(filter: ServerFilter): Promise<ServerSchema | null> {
        const servers = await this.findMany(filter);

        return servers[0] || null;
    }

    public async create(server: ServerSchema): Promise<ServerSchema> {
        const servers = await this.findMany();

        if (servers.some(item => item.id === server.id)) {
            throw new Error(`Server with id ${server.id} already exists.`);
        }

        servers.push(server);

        this.write(servers);

        return server;
    }

    public async updateById(id: string, payload: Partial<Omit<ServerSchema, "id">>): Promise<ServerSchema> {
        const servers = await this.findMany();
        const index = servers.findIndex(server => server.id === id);

        if (index === -1) {
            throw new Error(`Server with id ${id} not found.`);
        }

        const server = { ...servers[index], ...payload, id };

        servers[index] = server;

        this.write(servers);

        return server;
    }

    public async destoryById(id: string): Promise<void> {
        const servers = await this.findMany();
        const remaining = servers.filter(server => server.id !== id);

        if (remaining.length === servers.length) {
            throw new Error(`Server with id ${id} not found.`);
        }

        this.write(remaining);
    }

}
