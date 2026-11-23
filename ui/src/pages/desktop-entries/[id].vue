<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DesktopEntrySchema } from 'core/schemas/desktopEntry.ts'
import { $try } from 'core/utils/try.ts'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner'
import { RefreshCw } from '@lucide/vue'

const route = useRoute()
const entry = ref<DesktopEntrySchema>()
const loading = ref(false)
const saving = ref(false)
const generating = ref(false)
const refreshing = ref(false)

async function loadEntry() {
  loading.value = true

  const [error, response] = await $try(() => window.platform.desktopEntries.findOne({
    id: route.params.id as string,
  }))

  loading.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load desktop entry.')
    return
  }

  if (!response) {
    return
  }

  entry.value = response
}

async function save() {
  if (!entry.value) return

  saving.value = true

  const { id, ...payload } = entry.value
  const [error, response] = await $try(() => window.platform.desktopEntries.updateById(id, payload))

  saving.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to save desktop entry.')
    return
  }

  entry.value = response
  toast.success('Desktop entry saved successfully.')
}

async function generate() {
  if (!entry.value) return

  generating.value = true

  const json = JSON.parse(JSON.stringify(entry.value))

  const [error, filename] = await $try(() => window.platform.desktopEntries.generate(json))

  generating.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to generate desktop entry.')
    return
  }

  entry.value.filename = filename
  toast.success(`Desktop entry generated at ${filename}`)
}

async function refreshFromProfile() {
  if (!entry.value?.profile_id) return

  refreshing.value = true

  const [makeError, defaults] = await $try(() => window.platform.desktopEntries.make({
    profile_id: entry.value!.profile_id,
  }))

  if (makeError) {
    refreshing.value = false
    console.error(makeError)
    toast.error(makeError instanceof Error ? makeError.message : 'Failed to refresh desktop entry.')
    return
  }

  const [updateError, response] = await $try(() => window.platform.desktopEntries.updateById(entry.value!.id, {
    name: defaults.name,
    comment: defaults.comment,
    args: defaults.args,
    icon_path: defaults.icon_path,
  }))

  refreshing.value = false

  if (updateError) {
    console.error(updateError)
    toast.error(updateError instanceof Error ? updateError.message : 'Failed to refresh desktop entry.')
    return
  }

  entry.value = response
  toast.success('Desktop entry refreshed from profile.')
}

onMounted(loadEntry)
</script>

<template>
  <div
    v-if="entry"
    class="w-full px-8 py-4"
  >
    <PageHeader>
      <div>
        <PageTitle>{{ entry.name || 'New desktop entry' }}</PageTitle>
        <PageSubtitle>Edit the generated desktop entry metadata.</PageSubtitle>
      </div>
      <div class="flex items-center gap-2">
        <zd-btn
          :loading="saving"
          @click="save"
        >
          Save
        </zd-btn>
        <zd-btn
          variant="outline"
          :loading="generating"
          @click="generate"
        >
          Generate
        </zd-btn>
        <zd-btn
          v-if="entry.profile_id"
          variant="outline"
          :loading="refreshing"
          @click="refreshFromProfile"
        >
          <RefreshCw :size="16" />
          Refresh
        </zd-btn>
      </div>
    </PageHeader>

    <Card>
      <CardHeader>
        <CardTitle>Desktop entry</CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <label class="grid gap-2 text-sm font-medium">
          Filename
          <Input v-model="entry.filename" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Name
          <Input v-model="entry.name" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Comment
          <Input v-model="entry.comment" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Executable
          <Input v-model="entry.executable" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Args
          <Input v-model="entry.args" />
        </label>
        <label class="grid gap-2 text-sm font-medium">
          Icon path
          <Input v-model="entry.icon_path" />
        </label>
        <label class="grid gap-2 text-sm font-medium md:col-span-2">
          Categories
          <Input v-model="entry.categories" />
        </label>
      </CardContent>
    </Card>
  </div>
  <div
    v-else-if="!loading"
    class="w-full px-8 py-4"
  >
    <PageHeader>
      <div>
        <PageTitle>Desktop entry not found</PageTitle>
        <PageSubtitle>This desktop entry is no longer available.</PageSubtitle>
      </div>
    </PageHeader>
  </div>
</template>
