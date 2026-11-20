import { api } from '@electron-forge/core'
import path from 'path'

const args = process.argv.slice(2);

const root = path.join(import.meta.dirname, '..', '..');

await api.start({
    dir: root,
    interactive: false,
    args,
})

