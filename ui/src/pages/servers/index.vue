<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RefreshCw, Square } from '@lucide/vue'
import type { ServerSchema } from 'core/schemas/server.ts'
import { $try } from 'core/utils/try.ts'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { toast } from 'vue-sonner'

const servers = ref<ServerSchema[]>([])
const loading = ref(false)
const killingId = ref<string | null>(null)

async function loadServers() {
  loading.value = true

  const [error, response] = await $try(() => window.platform.servers.findMany())

  loading.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load servers.')
    return
  }

  servers.value = response
}

async function kill(server: ServerSchema) {
  killingId.value = server.id

  const [error] = await $try(() => window.platform.zenith.kill(server.profile_id))

  killingId.value = null

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to kill server.')
    return
  }

  await loadServers()
}

onMounted(loadServers)
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Servers</PageTitle>
        <PageSubtitle>Manage running Zenith servers.</PageSubtitle>
      </div>
      <zd-btn
        variant="outline"
        :loading="loading"
        aria-label="Reload servers"
        @click="loadServers"
      >
        <RefreshCw :size="16" />
      </zd-btn>
    </PageHeader>

    <div
      v-if="servers.length === 0"
      class="rounded-xl border border-dashed py-20 text-center text-sm text-muted-foreground"
    >
      No servers found.
    </div>

    <div
      v-else
      class="overflow-hidden rounded-xl border"
    >
      <div
        v-for="server in servers"
        :key="server.id"
        class="flex items-center gap-4 border-b p-4 last:border-b-0"
      >
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">
            {{ server.id }}
          </p>
          <p class="text-xs text-muted-foreground">
            Profile: {{ server.profile_id }} · Status: {{ server.status }}<span v-if="server.pid"> · PID: {{ server.pid }}</span>
          </p>
        </div>
        <zd-btn-alert
          variant="destructive"
          size="icon"
          title="Kill server"
          description="This will stop the selected server."
          :loading="killingId === server.id"
          :handle="() => kill(server)"
        >
          <Square :size="15" />
        </zd-btn-alert>
      </div>
    </div>
  </div>
</template>
