import { ipcMain } from "electron";
import profiles from "../facades/profiles.ts";

export default async function () {
    ipcMain.handle("profiles:findMany", async () => profiles.findMany());
    ipcMain.handle("profiles:create", async (_event, payload) => profiles.create(payload));
}
