<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { NodeSchema } from 'core/schemas/node.ts'
import { $try } from 'core/utils/try.ts'
import { toast } from 'vue-sonner'

type DownloadedNode = NodeSchema & { path: string }

const nodes = ref<DownloadedNode[]>([])

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

onMounted(loadNodes)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Runtime</CardTitle>
    </CardHeader>
    <CardContent class="space-y-5">
      <FormField v-slot="{ componentField }" name="node_path">
        <FormItem>
          <FormLabel>Node.js path</FormLabel>
          <FormControl>
            <div class="flex gap-2">
              <Input
                v-bind="componentField"
                class="flex-1"
                placeholder="/path/to/node"
              />
              <Select v-bind="componentField">
                <SelectTrigger class="w-40">
                  <SelectValue placeholder="Downloaded" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="node in nodes"
                    :key="node.version"
                    :value="node.path"
                  >
                    {{ node.version }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="zenith_path">
        <FormItem>
          <FormLabel>Zenith path</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="/path/to/zenith" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </CardContent>
  </Card>
</template>
