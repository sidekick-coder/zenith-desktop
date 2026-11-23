import type { DesktopEntrySchema } from "../schemas/desktopEntry.ts";

export interface MakePayload {
    profile_id?: string
    controlPanel?: boolean
}

export default class DesktopEntryService {
    public async make(_payload: MakePayload = {}): Promise<DesktopEntrySchema> {
        throw new Error("Method not implemented.");
    }

    public async generate(_entry: DesktopEntrySchema): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
