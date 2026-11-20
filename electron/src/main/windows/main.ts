import { BrowserWindow } from 'electron';
import path from 'node:path';

export function createMainWindow() {
    // Create the browser window.
    const w = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        w.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

        return w;
    }

    const filename = path.resolve(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);

    w.loadFile(filename);

    return w
};
