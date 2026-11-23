import { createRouter, createWebHashHistory } from 'vue-router'
import ProfilesPage from '@/pages/profiles/index.vue'
import ProfilePage from '@/pages/profiles/[id].vue'
import SettingsPage from '@/pages/settings/index.vue'
import ServersPage from '@/pages/servers/index.vue'
import NodesPage from '@/pages/nodes/index.vue'
import DownloadsPage from '@/pages/downloads/index.vue'
import DesktopEntriesPage from '@/pages/desktop-entries/index.vue'
import DesktopEntryPage from '@/pages/desktop-entries/[id].vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/profiles' },
    { path: '/profiles', name: 'profiles', component: ProfilesPage },
    { path: '/profiles/:id', name: 'profile', component: ProfilePage },
    { path: '/settings', name: 'settings', component: SettingsPage },
    { path: '/servers', name: 'servers', component: ServersPage },
    { path: '/nodes', name: 'nodes', component: NodesPage },
    { path: '/downloads', name: 'downloads', component: DownloadsPage },
    { path: '/desktop-entries', name: 'desktop-entries', component: DesktopEntriesPage },
    { path: '/desktop-entries/:id', name: 'desktop-entry', component: DesktopEntryPage },
  ],
})

export default router
