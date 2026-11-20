import { ipcMain } from "electron";
import zenith from "../facades/zenith.ts";

ipcMain.handle("zenith:launch", async (_event, id) => zenith.launch(id));
ipcMain.handle("zenith:kill", async (_event, id) => zenith.kill(id));
ipcMain.handle("zenith:list", async () => zenith.list());
