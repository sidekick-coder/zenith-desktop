import { ipcMain } from "electron";
import servers from "../facades/servers.ts";

ipcMain.handle("servers:findMany", async (_event, filter) => servers.findMany(filter));
