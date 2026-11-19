<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AppWindow, Play, Pencil, Trash2 } from '@lucide/vue'
import ProfileCreateDialog from '@/components/ProfileCreateDialog.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import type { ProfileSchema } from 'core/schemas/profile.js'

const launchMessage = ref('')
const profiles = ref<ProfileSchema[]>([])
const platform = window.platform

async function load(){
  const response = await window.platform.profiles.findMany()

  profiles.value = response
}

function launch(name: string) {
  launchMessage.value = `Launching ${name} is not available in the demo yet.`
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

    <div class="flex flex-wrap">
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
          <zd-btn
            variant="outline"
            size="icon"
            @click="launch(profile.name || profile.id)"
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
