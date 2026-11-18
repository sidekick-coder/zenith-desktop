<script setup lang="ts">
import type { ProfileSchema } from 'core/schemas/profile'
import { AppWindow } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const profiles: ProfileSchema[] = [
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
]

function launch(profile: ProfileSchema) {
  console.log(`Launching ${profile.name} on port ${profile.port}`)
}
</script>

<template>
  <div class="w-full p-4">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h1 class="text-lg font-bold tracking-[-.045em]">Profiles</h1>
        <p class="text-sm text-muted-foreground">
          Manage and launch your local Express applications.
        </p>
      </div>
      <Button>
        Add new
      </Button>
    </div>

    <div class="flex flex-wrap gap-4">
      <Card
      v-for="profile in profiles" :key="profile.id"
      class="size-[200px] group cursor-pointer hover:bg-muted"
      @click="launch(profile)"
      >
        <CardContent class="flex flex-col items-center justify-center gap-4 p-6">
          <div class="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <AppWindow :size="31" :stroke-width="1.7" />
          </div>
          <span class="text-sm font-semibold">{{ profile.name }}</span>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
