import * as v from 'valibot'

export interface ProfileSchema extends v.InferOutput<ReturnType<typeof profileSchema>> {}

export function profileSchema() {
    return v.object({
        id: v.string(),
        name: v.string(),
        description: v.optional(v.string()),

        directory: v.string(),
        data_directory: v.string(),

        env: v.record(v.string(), v.string()),

        node_path: v.optional(v.string()),
        zenith_path: v.optional(v.string()),

        created_at: v.string(),
        updated_at: v.string(),
    })
}

profileSchema.create = () => v.omit(profileSchema(), ['created_at', 'updated_at'])
