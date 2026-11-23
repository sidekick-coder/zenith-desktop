// oxlint-disable eslint-plugin-unicorn/no-empty-file
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//
import { contextBridge, ipcRenderer } from "electron";
import type { ProfileSchema } from "core/schemas/profile.ts";

contextBridge.exposeInMainWorld("platform", {
    profiles: {
        findMany: () => ipcRenderer.invoke("profiles:findMany"),
        findById: (id: string) => ipcRenderer.invoke("profiles:findById", id),
        findByIdOrFail: (id: string) => ipcRenderer.invoke("profiles:findByIdOrFail", id),
        updateById: (id: string, profile: Partial<Omit<ProfileSchema, "id">>) => ipcRenderer.invoke("profiles:updateById", id, profile),
        deleteById: (id: string) => ipcRenderer.invoke("profiles:deleteById", id),
        create: (payload: Partial<ProfileSchema>) => ipcRenderer.invoke("profiles:create", payload),
    },
    nodes: {
        list: () => ipcRenderer.invoke("nodes:list"),
        download: (version: string) => ipcRenderer.invoke("nodes:download", version),
        remove: (version: string) => ipcRenderer.invoke("nodes:remove", version),
        path: (version: string) => ipcRenderer.invoke("nodes:path", version),
    },
    servers: {
        findMany: (filter?: { id?: string; profile_id?: string }) => ipcRenderer.invoke("servers:findMany", filter),
    },
    zenith: {
        launch: (id: string) => ipcRenderer.invoke("zenith:launch", id),
        kill: (id: string) => ipcRenderer.invoke("zenith:kill", id),
        list: () => ipcRenderer.invoke("zenith:list"),
    }
});
