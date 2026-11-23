import { ipcMain } from "electron";
import type { MakePayload } from "core/services/DesktopEntryService.ts";
import type { DesktopEntrySchema } from "core/schemas/desktopEntry.ts";
import desktopEntries from "../facades/desktopEntries.ts";
import desktopEntryRepository from "../facades/desktopEntryRepository.ts";

ipcMain.handle("desktopEntries:make", async (_event, payload: MakePayload) => desktopEntries.make(payload));
ipcMain.handle("desktopEntries:create", async (_event, entry: DesktopEntrySchema) => desktopEntryRepository.create(entry));
ipcMain.handle("desktopEntries:generate", async (_event, entry) => desktopEntries.generate(entry));
ipcMain.handle("desktopEntries:list", async () => desktopEntryRepository.findMany());
ipcMain.handle("desktopEntries:findOne", async (_event, filter) => desktopEntryRepository.findOne(filter));
ipcMain.handle("desktopEntries:updateById", async (_event, id, payload) => desktopEntryRepository.updateById(id, payload));
ipcMain.handle("desktopEntries:deleteById", async (_event, id) => desktopEntryRepository.deleteById(id));
