<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Monitor, Plus, Trash2 } from '@lucide/vue'
import { useRouter } from 'vue-router'
import type { DesktopEntrySchema } from 'core/schemas/desktopEntry.ts'
import type { ProfileSchema } from 'core/schemas/profile.ts'
import { $try } from 'core/utils/try.ts'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { toast } from 'vue-sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const entries = ref<DesktopEntrySchema[]>([])
const profiles = ref<ProfileSchema[]>([])
const loading = ref(false)
const profileDialogOpen = ref(false)
const profileLoading = ref(false)
const selectedProfileId = ref<string | null>(null)
const router = useRouter()

async function loadEntries() {
  loading.value = true

  const [error, response] = await $try(() => window.platform.desktopEntries.list())

  loading.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load desktop entries.')
    return
  }

  entries.value = response
}

async function loadProfiles() {
  const [error, response] = await $try(() => window.platform.profiles.findMany())

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load profiles.')
    return
  }

  profiles.value = response
}

function selectCreationMode(mode: string) {
  if (mode === 'empty') {
    createEmpty()
    return
  }

  if (mode === 'control panel') {
    createControlPanel()
    return
  }

  if (mode === 'from profile') {
    profileDialogOpen.value = true
    loadProfiles()
    return
  }

  toast.info(`Create ${mode} desktop entry is not implemented yet.`)
}

async function createEmpty() {
  const [error, entry] = await $try(() => window.platform.desktopEntries.createEmpty())

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to create desktop entry.')
    return
  }

  await router.push(`/desktop-entries/${entry.id}`)
}

async function createFromProfile(profile: ProfileSchema) {
  profileLoading.value = true
  selectedProfileId.value = profile.id

  const json = JSON.parse(JSON.stringify(profile))

  const [createError] = await $try(() =>  window.platform.desktopEntries.create(json))

  if (createError) {
    console.error(createError)
    toast.error(createError instanceof Error ? createError.message : 'Failed to create desktop entry.')
    profileLoading.value = false
    selectedProfileId.value = null
    return
  }

  const [findError, entry] = await $try(() => window.platform.desktopEntries.findOne({
    profile_id: profile.id,
  }))

  profileLoading.value = false
  selectedProfileId.value = null

  if (findError || !entry) {
    console.error(findError)
    toast.error(findError instanceof Error ? findError.message : 'Created entry could not be found.')
    return
  }

  profileDialogOpen.value = false
  await router.push(`/desktop-entries/${entry.id}`)
}

async function createControlPanel() {
  const [error, entry] = await $try(() => window.platform.desktopEntries.createControlPanel())

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to create control panel entry.')
    return
  }

  await router.push(`/desktop-entries/${entry.id}`)
}

async function deleteEntry(id: string) {
  const [error] = await $try(() => window.platform.desktopEntries.deleteById(id))

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to delete desktop entry.')
    return
  }

  entries.value = entries.value.filter(entry => entry.id !== id)
}

onMounted(loadEntries)
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Desktop entries</PageTitle>
        <PageSubtitle>Desktop shortcuts generated for your profiles.</PageSubtitle>
      </div>
      <div class="flex items-center gap-2">
        <zd-btn
          variant="outline"
          :loading="loading"
          @click="loadEntries"
        >
          Reload
        </zd-btn>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <zd-btn>
              <Plus :size="16" /> Add new
            </zd-btn>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @select="selectCreationMode('empty')">
              Empty
            </DropdownMenuItem>
            <DropdownMenuItem @select="selectCreationMode('control panel')">
              Control panel
            </DropdownMenuItem>
            <DropdownMenuItem @select="selectCreationMode('from profile')">
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </PageHeader>

    <Dialog v-model:open="profileDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create from profile</DialogTitle>
          <DialogDescription>
            Choose the profile to use for this desktop entry.
          </DialogDescription>
        </DialogHeader>
        <div
          v-if="profiles.length"
          class="flex flex-col gap-2"
        >
          <Button
            v-for="profile in profiles"
            :key="profile.id"
            variant="outline"
            class="justify-start h-14 px-2 flex items-center gap-4"
            :disabled="profileLoading"
            @click="createFromProfile(profile)"
          >
            <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Monitor :size="19" />
            </div>
            <span class="flex flex-col items-start">
              <span>{{ profile.name }}</span>
              <span class="text-xs text-muted-foreground">{{ profile.id }}</span>
            </span>

            <span
              v-if="selectedProfileId === profile.id && profileLoading"
              class="ml-auto"
            >
              Creating...
            </span>
          </Button>
        </div>
        <p
          v-else
          class="text-sm text-muted-foreground"
        >
          No profiles found.
        </p>
      </DialogContent>
    </Dialog>

    <div
      v-if="entries.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      No desktop entries found.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-xl border"
    >
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="flex cursor-pointer items-start gap-4 border-b p-4 last:border-b-0 hover:bg-muted/50"
        @click="router.push(`/desktop-entries/${entry.id}`)"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Monitor :size="19" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold">
            {{ entry.name }}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            {{ entry.comment }}
          </p>
        </div>
        <zd-btn-alert
          variant="destructive"
          size="icon"
          title="Delete desktop entry"
          description="Delete this desktop entry?"
          :handle="() => deleteEntry(entry.id)"
          @click.stop
        >
          <Trash2 :size="16" />
        </zd-btn-alert>
      </div>
    </div>
  </div>
</template>
