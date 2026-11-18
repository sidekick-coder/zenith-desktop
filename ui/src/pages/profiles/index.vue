<script setup lang="ts">
import { ref } from 'vue'
import { AppWindow, MoreHorizontal, Pencil, Trash2 } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { profiles } from '@/data/profiles'

const launchMessage = ref('')

function launch(name: string) {
  launchMessage.value = `Launching ${name} is not available in the demo yet.`
}

function deleteProfile(id: string) {
  const index = profiles.findIndex((profile) => profile.id === id)
  if (index !== -1) profiles.splice(index, 1)
}
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
      <Button>Add new</Button>
    </PageHeader>

    <p v-if="launchMessage" role="status" class="mb-4 text-sm text-muted-foreground">
      {{ launchMessage }}
    </p>

    <div class="-mx-4 flex flex-wrap">
      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="flex w-[300px] items-center rounded-lg transition-colors hover:bg-muted"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-4 rounded-lg p-4 text-left focus-visible:outline-2 focus-visible:outline-ring"
          :aria-label="`Launch ${profile.name}`"
          @click="launch(profile.name)"
        >
          <div class="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <AppWindow :size="31" :stroke-width="1.7" />
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <span class="text-sm font-semibold">{{ profile.name }}</span>
            <span class="text-xs">{{ profile.description }}</span>
          </div>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="mr-2" :aria-label="`Options for ${profile.name}`">
              <MoreHorizontal :size="18" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem as-child>
              <RouterLink :to="{ name: 'profile', params: { id: profile.id } }">
                <Pencil :size="16" /> Edit
              </RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" @select="deleteProfile(profile.id)">
              <Trash2 :size="16" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>
