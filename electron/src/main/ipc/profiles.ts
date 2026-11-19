import { ipcMain } from "electron";
import profiles from "../facades/profiles.ts";

export default async function () {
    ipcMain.handle("profiles:findMany", async () => profiles.findMany());
}
