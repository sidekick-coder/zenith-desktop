import { app } from "electron";
import path from "node:path";
import NodeRepository from "../repositories/NodeRepository.ts";

const nodes = new NodeRepository(path.join(app.getPath("userData"), "node"));

export default nodes;
