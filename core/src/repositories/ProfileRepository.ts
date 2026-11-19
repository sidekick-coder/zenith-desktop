import type { ProfileSchema } from "../schemas/profile.ts";

export default class ProfileRepository {
    public async findById(id: string): Promise<ProfileSchema | null> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { id });

        throw error;
    }

    public async findByIdOrFail(id: string): Promise<ProfileSchema> {
        const response = await this.findById(id);

        if (!response) {
            throw new Error(`Profile with id ${id} not found`);
        }

        return response;
    }

    public async findMany(): Promise<ProfileSchema[]> {
        throw new Error("Method not implemented.");
    }

    public async create(payload?: Partial<ProfileSchema>): Promise<ProfileSchema> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { payload });

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
