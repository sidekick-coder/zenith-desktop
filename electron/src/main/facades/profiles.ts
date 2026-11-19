import ProfileRepository from "../repositories/ProfileRepository.ts";
import { app } from "electron";
import path from "node:path";

const directory = path.join(app.getPath("userData"), "profiles");

const profiles = new ProfileRepository(directory)

export default profiles
