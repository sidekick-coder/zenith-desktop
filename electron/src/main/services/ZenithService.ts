import ServerService from "./ServerService.ts";
import BaseService from "core/services/ZenithService.ts";
import profiles from "../facades/profiles.ts";
import { closeProfileWindows, createProfileWindow } from "../windows/profile.ts";
import { ServerSchema } from "core/schemas/server.ts";
import { $try } from "core/utils/try.js";
import servers from "../facades/servers.ts";

export default class ZenithService extends BaseService {
    public async isKilled(server: ServerSchema) {
        if (!server.pid) {
            return true;
        }

        const [error] = await $try(() => process.kill(server.pid!, 0));

        if (error) {
            await servers.destoryById(server.id);
            return true;
        }

        return false;
    }


    public async launch(profileId: string) {
        const profile = await profiles.findByIdOrFail(profileId);

        let server = await servers.findOne({
            profile_id: profile.id,
        });

        const isKilled = server ? await this.isKilled(server) : true;

        if (server && !isKilled) {
            createProfileWindow(profile);
            return;
        }

        const p = new ServerService(profile);

        await p.start();

        server = {
            id: profile.id,
            profile_id: profile.id,
            status: p.status,
            pid: p.process?.pid,
        };

        await servers.create(server);

        createProfileWindow(profile);
    }

    public async kill(profileId: string) {
        const server = await servers.findOne({
            profile_id: profileId,
        });

        if (!server) {
            throw new Error(`No server found for profile with id ${profileId}`);
        }

        if (!server.pid) {
            throw new Error(`Server for profile with id ${profileId} has no PID.`);
        }

        const killed = await this.isKilled(server);

        if (!killed && server.pid) {
            process.kill(server.pid);
        }

        await servers.destoryById(server.id);

        closeProfileWindows(profileId);
    }

    public async killAll() {
        const all = await servers.findMany();

        for (const server of all) {
            await this.kill(server.profile_id);
        }
    }

    public async list() {
        return servers.findMany();
    }
}
