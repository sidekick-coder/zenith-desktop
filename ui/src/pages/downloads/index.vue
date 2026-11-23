<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Download, Package, Trash2 } from '@lucide/vue'
import type { ReleaseSchema } from 'core/schemas/release.ts'
import { $try } from 'core/utils/try.ts'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { toast } from 'vue-sonner'

const releases = ref<ReleaseSchema[]>([])
const loading = ref(false)
const activeTag = ref<string | null>(null)

async function loadReleases() {
  loading.value = true

  const [error, response] = await $try(() => window.platform.releases.list())

  loading.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load Zenith releases.')
    return
  }

  releases.value = response
}

async function download(tagName: string) {
  activeTag.value = tagName

  const [error] = await $try(() => window.platform.releases.download(tagName))

  activeTag.value = null

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : `Failed to download Zenith ${tagName}.`)
    return
  }

  await loadReleases()
}

async function remove(tagName: string) {
  activeTag.value = tagName

  const [error] = await $try(() => window.platform.releases.remove(tagName))

  activeTag.value = null

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : `Failed to delete Zenith ${tagName}.`)
    return
  }

  await loadReleases()
}

function publishedAt(release: ReleaseSchema) {
  return release.publishedAt ? new Date(release.publishedAt).toLocaleDateString() : 'Local release'
}

onMounted(loadReleases)
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Zenith releases</PageTitle>
        <PageSubtitle>Download the Zenith server versions used by your profiles.</PageSubtitle>
      </div>
    </PageHeader>

    <div
      v-if="loading && releases.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      Loading Zenith releases...
    </div>

    <div
      v-else-if="releases.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      No Zenith releases found.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-xl border"
    >
      <div
        v-for="release in releases"
        :key="release.tagName"
        class="flex items-center gap-4 border-b p-4 last:border-b-0"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Package :size="19" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-semibold">
              {{ release.name }}
            </p>
            <span
              v-if="release.downloaded"
              class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              Downloaded
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ release.tagName }} · Published {{ publishedAt(release) }}
          </p>
        </div>

        <zd-btn
          v-if="!release.downloaded"
          variant="outline"
          :loading="activeTag === release.tagName"
          :aria-label="`Download ${release.tagName}`"
          @click="download(release.tagName)"
        >
          <Download :size="16" />
          <span class="hidden sm:inline">Download</span>
        </zd-btn>
        <zd-btn-alert
          v-else
          variant="destructive"
          size="icon"
          title="Delete Zenith release"
          :description="`Delete the downloaded Zenith release ${release.tagName}?`"
          :loading="activeTag === release.tagName"
          :handle="() => remove(release.tagName)"
        >
          <Trash2 :size="16" />
        </zd-btn-alert>
      </div>
    </div>
  </div>
</template>
