// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//
import { contextBridge, ipcRenderer } from "electron";
import { EmmitterService } from "@sidekick-coder/zenith-kit/shared";
import type { ProfileSchema } from "core/schemas/profile.ts";

contextBridge.exposeInMainWorld("platform", {
    profiles: {
        findMany: () => ipcRenderer.invoke("profiles:findMany"),
        create: (payload: Partial<ProfileSchema>) => ipcRenderer.invoke("profiles:create", payload),
    }
});
