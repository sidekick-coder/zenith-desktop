import type { ProfileSchema } from "../schemas/profile.ts";
import type { DesktopEntrySchema } from "../schemas/desktopEntry.ts";

export default class DesktopEntryService {
    public async create(_profile: ProfileSchema): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public async generate(_entry: DesktopEntrySchema): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
