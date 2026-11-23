import { dialog, ipcMain } from "electron";
import profiles from "../facades/profiles.ts";

ipcMain.handle("profiles:findMany", async () => profiles.findMany());
ipcMain.handle("profiles:findById", async (_event, id) => profiles.findById(id));
ipcMain.handle("profiles:findByIdOrFail", async (_event, id) => profiles.findByIdOrFail(id));
ipcMain.handle("profiles:updateById", async (_event, id, profile) => profiles.updateById(id, profile));
ipcMain.handle("profiles:deleteById", async (_event, id) => profiles.deleteById(id));
ipcMain.handle("profiles:create", async (_event, payload) => profiles.create(payload));
ipcMain.handle("profiles:selectIcon", async (_event, id) => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }],
    });

    if (result.canceled || !result.filePaths[0]) {
        return profiles.findById(id);
    }

    return profiles.updateIconById(id, result.filePaths[0]);
});
ipcMain.handle("profiles:getIconData", async (_event, id) => profiles.getIconDataById(id));
