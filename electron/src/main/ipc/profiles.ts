import { ipcMain } from "electron";
import profiles from "../facades/profiles.ts";

ipcMain.handle("profiles:findMany", async () => profiles.findMany());
ipcMain.handle("profiles:findById", async (_event, id) => profiles.findById(id));
ipcMain.handle("profiles:findByIdOrFail", async (_event, id) => profiles.findByIdOrFail(id));
ipcMain.handle("profiles:updateById", async (_event, id, profile) => profiles.updateById(id, profile));
ipcMain.handle("profiles:deleteById", async (_event, id) => profiles.deleteById(id));
ipcMain.handle("profiles:create", async (_event, payload) => profiles.create(payload));
