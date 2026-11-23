import { ipcMain } from "electron";
import desktopEntries from "../facades/desktopEntries.ts";
import desktopEntryRepository from "../facades/desktopEntryRepository.ts";

ipcMain.handle("desktopEntries:create", async (_event, profile) => desktopEntries.create(profile));
ipcMain.handle("desktopEntries:generate", async (_event, entry) => desktopEntries.generate(entry));
ipcMain.handle("desktopEntries:list", async () => desktopEntryRepository.findMany());
ipcMain.handle("desktopEntries:createEmpty", async () => desktopEntryRepository.createEmpty());
ipcMain.handle("desktopEntries:createControlPanel", async () => desktopEntryRepository.createControlPanel());
ipcMain.handle("desktopEntries:findOne", async (_event, filter) => desktopEntryRepository.findOne(filter));
ipcMain.handle("desktopEntries:updateById", async (_event, id, payload) => desktopEntryRepository.updateById(id, payload));
ipcMain.handle("desktopEntries:deleteById", async (_event, id) => desktopEntryRepository.deleteById(id));
