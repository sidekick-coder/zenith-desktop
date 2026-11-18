import type { ProfileSchema } from 'core/schemas/profile.ts'
import { reactive } from 'vue'

export const profiles = reactive<ProfileSchema[]>([
  {
    id: 'acme-dashboard',
    name: 'Acme Dashboard',
    description: 'Internal analytics and reporting',
    directory: '~/Projects/acme-dashboard',
    port: 3000,
    icon: 'server',
    env: {
      NODE_ENV: 'development',
      API_URL: 'http://localhost:3001',
      SESSION_SECRET: 'local',
      LOG_LEVEL: 'debug',
    },
    created_at: '2026-01-08T10:00:00.000Z',
    updated_at: '2026-11-18T12:00:00.000Z',
  },
  {
    id: 'notes-api',
    name: 'Notes API',
    description: 'Personal notes and productivity API',
    directory: '~/Projects/notes-api',
    port: 4000,
    icon: 'terminal',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'sqlite://notes.db',
    },
    created_at: '2026-02-14T10:00:00.000Z',
    updated_at: '2026-11-17T12:00:00.000Z',
  },
  {
    id: 'storefront',
    name: 'Storefront',
    description: 'Demo commerce application',
    directory: '~/Projects/storefront',
    port: 5173,
    icon: 'server',
    env: {
      NODE_ENV: 'development',
      API_URL: 'http://localhost:3001',
      FEATURE_CART: 'true',
      STORE_ID: 'demo',
      LOG_LEVEL: 'info',
      VITE_PORT: '5173',
    },
    created_at: '2026-03-22T10:00:00.000Z',
    updated_at: '2026-11-15T12:00:00.000Z',
  },
])
