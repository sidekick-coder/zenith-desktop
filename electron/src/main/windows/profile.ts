import { ProfileSchema } from 'core/schemas/profile.js';
import { BrowserWindow } from 'electron';

interface Entry {
    profile: ProfileSchema;
    window: BrowserWindow;
}

let entries: Entry[] = [];

export function closeProfileWindows(profileId: string) {
    const pwindows = entries.filter(e => e.profile.id === profileId);

    for (const entry of pwindows) {
        entry.window.close();
    }

    entries = entries.filter(e => e.profile.id !== profileId);
}

export function createProfileWindow(profile: ProfileSchema){
    // Create the browser window.
    const w = new BrowserWindow({
        width: 800,
        height: 600,
        name: profile.name || profile.id,
        webPreferences: {
            partition: `persist:profile-${profile.id}`,
        },
    });

    const url = profile.env['ZENITH_APP_URL']

    w.loadURL(url);

    entries.push({ profile, window: w });

    w.on('closed', () => {
        entries = entries.filter(e => e.window !== w);
    });

    return w
};
