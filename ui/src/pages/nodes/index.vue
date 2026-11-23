<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Download, HardDrive, Trash2 } from '@lucide/vue'
import type { NodeSchema } from 'core/schemas/node.ts'
import { $try } from 'core/utils/try.ts'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { toast } from 'vue-sonner'

const nodes = ref<NodeSchema[]>([])
const loading = ref(false)
const activeVersion = ref<string | null>(null)

async function loadNodes() {
  loading.value = true

  const [error, response] = await $try(() => window.platform.nodes.list())

  loading.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load Node.js versions.')
    return
  }

  nodes.value = response
}

async function download(version: string) {
  activeVersion.value = version

  const [error] = await $try(() => window.platform.nodes.download(version))

  activeVersion.value = null

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : `Failed to download Node.js ${version}.`)
    return
  }

  await loadNodes()
}

async function remove(version: string) {
  activeVersion.value = version

  const [error] = await $try(() => window.platform.nodes.remove(version))

  activeVersion.value = null

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : `Failed to delete Node.js ${version}.`)
    return
  }

  await loadNodes()
}

function releasedAt(node: NodeSchema) {
  return node.releasedAt ? new Date(node.releasedAt).toLocaleDateString() : 'Local version'
}

onMounted(loadNodes)
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Node.js versions</PageTitle>
        <PageSubtitle>Download the Node.js runtimes used by your profiles.</PageSubtitle>
      </div>
    </PageHeader>

    <div
      v-if="loading && nodes.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      Loading Node.js versions...
    </div>

    <div
      v-else-if="nodes.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      No compatible Node.js versions found.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-xl border"
    >
      <div
        v-for="node in nodes"
        :key="node.version"
        class="flex items-center gap-4 border-b p-4 last:border-b-0"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <HardDrive :size="19" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold">
              {{ node.version }}
            </p>
            <span
              v-if="node.lts"
              class="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              LTS
            </span>
            <span
              v-if="node.installed"
              class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              Installed
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            Released {{ releasedAt(node) }}
          </p>
        </div>

        <zd-btn
          v-if="!node.installed"
          variant="outline"
          :loading="activeVersion === node.version"
          :aria-label="`Download ${node.version}`"
          @click="download(node.version)"
        >
          <Download :size="16" />
          <span class="hidden sm:inline">Download</span>
        </zd-btn>
        <zd-btn-alert
          v-else
          variant="destructive"
          size="icon"
          title="Delete Node.js version"
          :description="`Delete the downloaded Node.js ${node.version}?`"
          :loading="activeVersion === node.version"
          :handle="() => remove(node.version)"
        >
          <Trash2 :size="16" />
        </zd-btn-alert>
      </div>
    </div>
  </div>
</template>
