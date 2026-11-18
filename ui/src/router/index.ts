import { createRouter, createWebHashHistory } from 'vue-router'
import ProfilesPage from '@/pages/profiles/index.vue'
import SettingsPage from '@/pages/settings/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/profiles' },
    { path: '/profiles', name: 'profiles', component: ProfilesPage },
    { path: '/settings', name: 'settings', component: SettingsPage },
  ],
})

export default router
