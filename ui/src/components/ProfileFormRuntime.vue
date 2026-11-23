<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NodeSchema } from 'core/schemas/node.ts'
import type { ReleaseSchema } from 'core/schemas/release.ts'
import { $try } from 'core/utils/try.ts'
import { toast } from 'vue-sonner'
import { ChevronDown } from '@lucide/vue'
import { useFormContext } from 'vee-validate'

type DownloadedNode = NodeSchema & { path: string }
type DownloadedRelease = ReleaseSchema & { path: string }

const nodes = ref<DownloadedNode[]>([])
const releases = ref<DownloadedRelease[]>([])
const { setFieldValue } = useFormContext()

async function loadNodes() {
  const [error, response] = await $try(() => window.platform.nodes.list())

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load downloaded Node.js versions.')
    return
  }

  const installed = response.filter(node => node.installed)
  nodes.value = await Promise.all(installed.map(async node => ({
    ...node,
    path: await window.platform.nodes.path(node.version),
  })))
}

async function loadReleases() {
  const [error, response] = await $try(() => window.platform.releases.list())

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to load downloaded Zenith releases.')
    return
  }

  const downloaded = response.filter(release => release.downloaded)
  releases.value = await Promise.all(downloaded.map(async release => ({
    ...release,
    path: await window.platform.releases.path(release.tagName),
  })))
}

onMounted(() => Promise.all([loadNodes(), loadReleases()]))
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Runtime</CardTitle>
    </CardHeader>
    <CardContent class="space-y-5">
      <FormField
        v-slot="{ componentField }"
        name="node_path"
      >
        <FormItem>
          <FormLabel>Node.js path</FormLabel>
          <FormControl>
            <div class="flex gap-2">
              <Input
                v-bind="componentField"
                class="flex-1"
                placeholder="/path/to/node"
              />
              <DropdownMenu v-if="nodes.length">
                <DropdownMenuTrigger as-child>
                  <zd-btn
                    type="button"
                    variant="outline"
                  >
                    <ChevronDown :size="16" />
                  </zd-btn>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    v-for="node in nodes"
                    :key="node.version"
                    @select="setFieldValue('node_path', node.path)"
                  >
                    {{ node.version }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="nodes.length === 0"
                    disabled
                  >
                    No downloaded Node.js versions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField
        v-slot="{ componentField }"
        name="zenith_path"
      >
        <FormItem>
          <FormLabel>Zenith path</FormLabel>
          <FormControl>
            <div class="flex gap-2">
              <Input
                v-bind="componentField"
                class="flex-1"
                placeholder="/path/to/zenith"
              />
              <DropdownMenu v-if="releases.length">
                <DropdownMenuTrigger as-child>
                  <zd-btn
                    type="button"
                    variant="outline"
                  >
                    <ChevronDown :size="16" />
                  </zd-btn>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    v-for="release in releases"
                    :key="release.tagName"
                    @select="setFieldValue('zenith_path', release.path)"
                  >
                    {{ release.tagName }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </CardContent>
  </Card>
</template>
