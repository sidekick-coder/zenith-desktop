import ServerService from "./ServerService.ts";
import BaseService from "core/services/ZenithService.ts";
import profiles from "../facades/profiles.ts";
import { closeProfileWindows, createProfileWindow } from "../windows/profile.ts";
import { ServerSchema } from "core/schemas/server.ts";

export default class ZenithService extends BaseService {
    public servers = new Map<string, ServerService>();

    public async launch(profileId: string) {

        const profile = await profiles.findByIdOrFail(profileId);


        let server = this.servers.get(profile.id);

        if (server) {
            createProfileWindow(profile);
            return;
        }

        server = new ServerService(profile);

        await server.start();

        this.servers.set(profile.id, server);

        createProfileWindow(profile);
    }

    public async kill(profileId: string) {
        const server = this.servers.get(profileId);

        if (!server) {
            throw new Error(`No server found for profile with id ${profileId}`);
        }

        await server.stop();

        this.servers.delete(profileId);

        closeProfileWindows(profileId);
    }

    public async killAll() {
        for (const [profileId, server] of this.servers.entries()) {
            await server.stop();

            closeProfileWindows(profileId);
        }

        this.servers.clear();
    }

    public async list() {
        const servers = [] as ServerSchema[];

        for (const [profileId, server] of this.servers.entries()) {
            const s: ServerSchema = {
                id: profileId,
                profile_id: profileId,
                status: server.status,
            };

            servers.push(s);
        }

        return servers;
    }
}
