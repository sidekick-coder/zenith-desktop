import BaseProfileRepository from 'core/repositories/ProfileRepository.ts';
import { ProfileSchema } from 'core/schemas/profile.js';
import { app } from 'electron';
import getPort from 'get-port';
import fs from 'node:fs';
import path from 'node:path';

export default class ProfileRepository extends BaseProfileRepository {
    public directory: string;

    constructor(directory: string) {
        super();
        this.directory = directory;

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    public async findMany() {
        const entries = fs.readdirSync(this.directory, { withFileTypes: true });

        const profiles = [] as ProfileSchema[]

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const filename = path.join(this.directory, entry.name, 'profile.json');

            if (!fs.existsSync(filename)) continue;

            const profile = JSON.parse(fs.readFileSync(filename, 'utf-8')) as ProfileSchema;

            profile.id = entry.name;
            profile.directory = path.join(this.directory, entry.name);

            profiles.push(profile);
        }

        return profiles
    }

    public async findById(id: string): Promise<ProfileSchema | null> {
        const all = await this.findMany();

        const profile = all.find(p => p.id === id);

        return profile || null;
    }

    public async create(payload?: Partial<Omit<ProfileSchema, "id">>): Promise<ProfileSchema> {
        const profile = { ...payload, } as ProfileSchema;

        if (!profile.id) {
            throw new Error("Profile id is required");
        }

        const port = await getPort()
        profile.name = payload?.name || `Profile ${profile.id}`;

        profile.env = {
            ZENITH_PORT: String(port),
            ZENITH_APP_URL: `http://localhost:${port}`,
            ZENITH_TMP_PATH: path.join(app.getPath('temp'), 'zenith', profile.id),
        };

        profile.directory = path.join(this.directory, profile.id);
        profile.data_directory = payload?.data_directory || path.join(profile.directory, 'data');

        profile.created_at = new Date().toISOString();
        profile.updated_at = new Date().toISOString();

        if (fs.existsSync(profile.directory)) {
            throw new Error(`Profile with id ${profile.id} already exists`);
        }

        fs.mkdirSync(profile.directory, { recursive: true });

        const filename = path.join(profile.directory, 'profile.json');

        const json = {
            name: profile.name,
            description: profile.description,
            data_directory: profile.data_directory,
            env: profile.env,
            node_path: profile.node_path,
            zenith_path: profile.zenith_path,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
        }

        const text = JSON.stringify(json, null, 4);

        fs.writeFileSync(filename, text, 'utf-8');

        return profile
    }

    public async updateById(id: string, payload: Partial<Omit<ProfileSchema, "id">>): Promise<ProfileSchema> {
        const profile = await this.findByIdOrFail(id);

        const json = {
            name: payload.name || profile.name,
            description: payload.description || profile.description,
            data_directory: payload.data_directory || profile.data_directory,
            env: payload.env || profile.env,
            node_path: payload.node_path || profile.node_path,
            zenith_path: payload.zenith_path || profile.zenith_path,
            created_at: profile.created_at,
            updated_at: new Date().toISOString(),
        }

        const filename = path.join(this.directory, id, 'profile.json');
        const text = JSON.stringify(json, null, 4);

        fs.writeFileSync(filename, text, 'utf-8');

        return profile;
    }

    public async deleteById(id: string): Promise<void> {
        const profile = await this.findByIdOrFail(id);

        fs.rmSync(profile.directory, { recursive: true, force: true });
    }
}
