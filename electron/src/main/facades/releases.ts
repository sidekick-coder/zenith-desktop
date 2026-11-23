import { app } from "electron";
import path from "node:path";
import ReleaseRepository from "../repositories/ReleaseRepository.ts";

const releases = new ReleaseRepository(path.join(app.getPath("userData"), "zenith"));

export default releases;
