import * as v from 'valibot'

export interface ProfileSchema extends v.InferOutput<ReturnType<typeof profileSchema>> {}

export function profileSchema() {
    return v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        directory: v.string(),
        port: v.number(),
        icon: v.string(),
        env: v.record(v.string(), v.string()),
        created_at: v.string(),
        updated_at: v.string(),
    })
}
