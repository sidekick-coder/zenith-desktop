import { ProfileSchema } from "../schemas/profile.ts";

export default interface ProfileRepository {
    findById(id: string): Promise<ProfileSchema | null>
    findByIdOrFail(id: string): Promise<ProfileSchema>
    findMany(): Promise<ProfileSchema[]>

    create(profile: Partial<ProfileSchema>): Promise<ProfileSchema>

    updateById(id: string, profile: Partial<Omit<ProfileSchema, "id">>): Promise<ProfileSchema>

    deleteById(id: string): Promise<void>
}
