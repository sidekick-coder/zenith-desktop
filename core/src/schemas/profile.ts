import * as v from 'valibot'

export interface ProfileSchema extends v.InferOutput<ReturnType<typeof profileSchema>> {}

export function profileSchema() {
    return v.object({
        id: v.string(),
        name: v.string(),
        description: v.optional(v.string()),

        directory: v.string(),
        data_folder: v.string(),

        env: v.record(v.string(), v.string()),

        created_at: v.string(),
        updated_at: v.string(),
    })
}

profileSchema.create = () => v.omit(profileSchema(), ['created_at', 'updated_at'])
