import { ipcMain } from "electron";
import releases from "../facades/releases.ts";

ipcMain.handle("releases:list", async () => releases.list());
ipcMain.handle("releases:download", async (_event, tagName) => releases.download(tagName));
ipcMain.handle("releases:remove", async (_event, tagName) => releases.remove(tagName));
ipcMain.handle("releases:path", async (_event, tagName) => releases.path(tagName));
