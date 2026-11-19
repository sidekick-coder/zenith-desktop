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

            profiles.push(profile);
        }

        return profiles
    }

    public async create(payload?: Partial<Omit<ProfileSchema, "id">>): Promise<ProfileSchema> {
        const profile = { ...payload, } as ProfileSchema;

        if (!profile.id) {
            throw new Error("Profile id is required");
        }

        const port = await getPort()

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
        const json = JSON.stringify(profile, null, 4);

        fs.writeFileSync(filename, json, 'utf-8');

        return profile
    }
}
