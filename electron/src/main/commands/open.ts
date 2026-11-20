import { defineCommand } from "citty";
import profiles from "../facades/profiles.ts";
import zenith from "../facades/zenith.ts";

export default defineCommand({
    meta: {
        name: "open",
        description: "Open the profile window",
    },
    args: {
        profileId: {
            type: "positional",
            description: "The ID of the profile to open",
            required: true,
        },
    },
    run: async ({ args }) => {
        const { profileId } = args;

        const profile = await profiles.findByIdOrFail(profileId);

        await zenith.launch(profile.id);
    }
})
