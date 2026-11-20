import { ServerSchema } from "../schemas/server";

export default class ZenithService {
    public launch(profileId: string): Promise<void> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { profileId });

        throw error;
    }

    public kill(profileId: string): Promise<void> {
        const error = new Error("Method not implemented.");

        Object.assign(error, { profileId });

        throw error;
    }

    public killAll(): Promise<void> {
        const error = new Error("Method not implemented.");

        throw error;
    }

    public async list(): Promise<ServerSchema[]> {
        const error = new Error("Method not implemented.");

        throw error;
    }
}
