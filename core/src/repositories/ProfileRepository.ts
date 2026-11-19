import { ProfileSchema } from "../schemas/profile.ts";

export default class ProfileRepository {
    public async findById(id: string): Promise<ProfileSchema | null> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { id });

        throw error;
    }

    public findByIdOrFail(id: string): Promise<ProfileSchema> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { id });

        throw error;
    }

    public async findMany(): Promise<ProfileSchema[]> {
        throw new Error("Method not implemented.");
    }

    public async create(profile: Partial<ProfileSchema>): Promise<ProfileSchema> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { profile });

        throw error;
    }

    public async updateById(id: string, profile: Partial<Omit<ProfileSchema, "id">>): Promise<ProfileSchema> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { id, profile });

        throw error;
    }
    
    public async deleteById(id: string): Promise<void> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { id });

        throw error;
    }
}
