import { ipcMain } from "electron";
import nodes from "../facades/nodes.ts";

ipcMain.handle("nodes:list", async () => nodes.list());
ipcMain.handle("nodes:download", async (_event, version) => nodes.download(version));
ipcMain.handle("nodes:remove", async (_event, version) => nodes.remove(version));
ipcMain.handle("nodes:path", async (_event, version) => nodes.path(version));
