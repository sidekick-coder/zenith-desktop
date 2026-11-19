import { validator } from '@sidekick-coder/zenith-kit/shared';
import BaseProfileRepository from 'core/repositories/ProfileRepository.ts';
import { profileSchema, ProfileSchema } from 'core/schemas/profile.js';
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

    public async create(payload: Partial<ProfileSchema>): Promise<ProfileSchema> {
        const profile = validator.validate(payload, profileSchema.create)

        const json = {
            ...profile,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        const directory = path.join(this.directory, profile.id);

        if (fs.existsSync(directory)) {
            throw new Error(`Profile with id ${profile.id} already exists`);
        }

        fs.mkdirSync(directory, { recursive: true });

        const filename = path.join(directory, 'profile.json');

        fs.writeFileSync(filename, JSON.stringify(json, null, 4), 'utf-8');

        return json
    }
}
