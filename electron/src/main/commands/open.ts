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
            required: false,
        },
        profile: {
            type: "string",
            description: "The ID of the profile to open",
            required: false,
        },
    },
    run: async ({ args }) => {
        const profileId = args.profile || args.profileId;

        if (!profileId) {
            throw new Error("A profile ID is required.");
        }

        const profile = await profiles.findByIdOrFail(profileId);

        await zenith.launch(profile.id);
    }
})
