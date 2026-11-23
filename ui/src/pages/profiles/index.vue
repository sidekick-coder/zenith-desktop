<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AppWindow, FolderPlus, Play, Square, Pencil, Trash2 } from '@lucide/vue'
import ProfileCreateDialog from '@/components/ProfileCreateDialog.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import type { ProfileSchema } from 'core/schemas/profile.ts'
import type { ServerSchema } from 'core/schemas/server.ts'
import { $try } from 'core/utils/try.js'
import { toast } from 'vue-sonner'

const profiles = ref<ProfileSchema[]>([])
const servers = ref<ServerSchema[]>([])
const platform = window.platform
const launchingIds = ref<string[]>([])

async function loadServers() {
  const response = await window.platform.zenith.list()

  servers.value = response
}

async function loadProfiles() {
  const response = await window.platform.profiles.findMany()

  profiles.value = response
}

async function load() {
  await Promise.all([loadProfiles(), loadServers()])
}

async function launch(id: string) {
  launchingIds.value.push(id)

  const [error] = await $try(() => platform.zenith.launch(id))

  if (error) {
    console.error(error)
    launchingIds.value = launchingIds.value.filter(launchingId => launchingId !== id)
    toast.error(error instanceof Error ? error.message : 'Failed to launch profile.')
    return
  }

  launchingIds.value = launchingIds.value.filter(launchingId => launchingId !== id)

  await load()
}

function isRunning(profileId: string) {
  return servers.value.some(s => s.profile_id === profileId && s.status === 'running')
}

onMounted(load)
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Profiles</PageTitle>
        <PageSubtitle>
          Manage and launch your local Express applications.
        </PageSubtitle>
      </div>
      <ProfileCreateDialog />
    </PageHeader>

    <div
      v-if="profiles.length === 0"
      class="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center"
    >
      <div class="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FolderPlus
          :size="32"
          :stroke-width="1.7"
        />
      </div>
      <div class="space-y-1">
        <p class="text-sm font-semibold">
          No profiles yet
        </p>
        <p class="max-w-xs text-xs text-muted-foreground">
          Create your first profile to start running your local Express applications.
        </p>
      </div>
      <ProfileCreateDialog />
    </div>

    <div
      v-else
      class="flex flex-wrap"
    >
      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="flex px-4 py-4 w-md border items-center justify-start rounded-lg"
      >
        <div
          class="flex min-w-0 items-center gap-4 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-ring"
        >
          <div class="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <AppWindow
              :size="31"
              :stroke-width="1.7"
            />
          </div>
        </div>

        <div class="flex min-w-0 flex-col px-6">
          <span class="text-sm font-semibold">{{ profile.name || profile.id }}</span>
          <span class="text-xs text-muted-foreground">{{ profile.description || 'No description' }}</span>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <zd-btn-alert
            v-if="isRunning(profile.id)"
            variant="destructive"
            size="icon"
            :handle="() => platform.zenith.kill(profile.id)"
            @success="load"
          >
            <Square :size="15" />
          </zd-btn-alert>

          <zd-btn
            variant="outline"
            size="icon"
            :loading="launchingIds.includes(profile.id)"
            @click="launch(profile.id)"
          >
            <Play :size="16" />
          </zd-btn>

          <zd-btn
            variant="outline"
            size="icon"
            :aria-label="`Edit ${profile.name}`"
            :to="`/profiles/${profile.id}`"
          >
            <Pencil :size="16" />
          </zd-btn>

          <zd-btn-alert
            variant="destructive"
            size="icon"
            :handle="() => platform.profiles.deleteById(profile.id)"
            @success="load"
          >
            <Trash2 :size="15" />
          </zd-btn-alert>
        </div>
      </div>
    </div>
  </div>
</template>
