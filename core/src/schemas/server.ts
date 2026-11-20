import * as v from 'valibot'

export interface ServerSchema extends v.InferOutput<ReturnType<typeof serverSchema>> {}

export function serverSchema() {
    return v.object({
        id: v.string(),
        profile_id: v.string(),
        status: v.picklist(['starting', 'running', 'stopping', 'stopped']),
    })
}

