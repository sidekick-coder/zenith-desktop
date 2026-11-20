import { ProfileSchema } from "core/schemas/profile.ts";
import cp from "node:child_process";
import path from "node:path";
import { $try } from "core/utils/try.ts";

export default class ServerService {
    public profile: ProfileSchema;
    public process: cp.ChildProcessWithoutNullStreams | null = null;
    public status: "stopped" | "starting" | "running" | "stopping" = "stopped";
    public logs: string[] = [];

    constructor(profile: ProfileSchema) {
        this.profile = profile;
    }

    public onStdout(data: string) {
        const log = data.toString();

        this.logs.push(log);

        console.log(`[${this.profile.name}] ${log}`);
    }

    public onStderr(data: string) {
        return this.onStdout(data);
    }

    public onExit(code: number | null, signal: NodeJS.Signals | null) {
        this.status = "stopped";
        this.process = null;

        console.log(`[${this.profile.name}] exited with code ${code} and signal ${signal}`);
    }

    public async start() {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.profile.node_path || !this.profile.zenith_path) {
                return reject("Node.js path or Zenith path is not defined in the profile.");
            }

            this.status = "starting";

            const env: Record<string, string | undefined> = {}
            const args = [
                path.join(this.profile.zenith_path, "zenith.js"),
                "serve"
            ]

            Object.entries(process.env).forEach(([key, value]) => {
                env[key] = value;
            })

            Object.entries(this.profile.env).forEach(([key, value]) => {
                env[key] = value;
            })

            env["PATH"] = `${this.profile.node_path}${path.delimiter}${env["PATH"]}`;
            env["ZENITH_PATH"] = this.profile.zenith_path;
            env["ZENITH_DATA_PATH"] = this.profile.data_directory;

            this.process = cp.spawn("node", args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: env,
            })

            this.process.stdout.on("data", this.onStdout.bind(this));
            this.process.stderr.on("data", this.onStderr.bind(this));

            this.process.once("exit", this.onExit.bind(this));
            this.process.once("error", (err) => {
                this.status = "stopped";

                this.process = null;

                reject(err);
            });

            const [error] = await $try(() => this.isOnline())

            if (error) {
                this.status = "stopped";
                this.process = null;

                return reject(error);
            }

            this.status = "running";

            resolve();
        })
    }

    public async stop() {
        if (!this.process) {
            throw new Error("Server is not running.");
        }

        this.status = "stopping";

        this.process.kill();
    }

    async isOnline() {
        const maxRetries = 10
        const retryInterval = 5000

        const url = this.profile.env["ZENITH_APP_URL"]

        for (let i = 0; i < maxRetries; i++) {
            const [,response] = await $try(() => fetch(url))

            if (response?.ok) {
                return true
            }

            await new Promise(resolve => setTimeout(resolve, retryInterval))
        }

        throw new Error('Server did not start in time')
    }
}

