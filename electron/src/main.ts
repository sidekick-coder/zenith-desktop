import { app } from 'electron';
import started from 'electron-squirrel-startup';
import { defineCommand, runMain, showUsage } from 'citty';
import pkg from '../package.json' with { type: 'json' };

const program = defineCommand({
    meta: {
        name: "zenith-desktop",
        version: pkg.version,
    },
    default: "main",
    subCommands: {
        open: () => import('./main/commands/open.ts').then(m => m.default),
        main: () => import('./main/commands/main.ts').then(m => m.default),
    },
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    await import('./main/ipc/profiles');
    await import('./main/ipc/nodes');
    await import('./main/ipc/servers');
    await import('./main/ipc/zenith');

    const args = app.isPackaged ? process.argv.slice(1) : process.argv.slice(2);

    await runMain(program, {
        rawArgs: args,
        async showUsage(cmd, parent) {
            await showUsage(cmd, parent);

            app.quit();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
