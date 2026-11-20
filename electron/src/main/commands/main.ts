import { defineCommand } from "citty";
import { createMainWindow } from "../windows/main.ts";

export default defineCommand({
    meta: {
        name: "open",
        description: "Open the profile window",
    },
    run: async () => {
        createMainWindow();
    }
})
