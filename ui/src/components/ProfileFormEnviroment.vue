<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Trash2 } from '@lucide/vue'
import { useField } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const { value: env } = useField<Record<string, string>>('env')

const variables = computed(() => Object.entries(env.value ?? {}))

function addVariable() {
  const current = env.value ?? {}
  let key = 'NEW_VARIABLE'
  let suffix = 2
  while (key in current) key = `NEW_VARIABLE_${suffix++}`
  env.value = { ...current, [key]: '' }
}

function updateKey(previousKey: string, key: string, value: string) {
  const current = { ...env.value }

  if (key === previousKey) {
    current[key] = value
    env.value = current
    return
  }

  const previousValue = current[previousKey] ?? ''
  delete current[previousKey]
  if (key) current[key] = value || previousValue
  env.value = current
}

function updateValue(key: string, value: string) {
  env.value = { ...env.value, [key]: value }
}

function removeVariable(key: string) {
  const current = { ...env.value }
  delete current[key]
  env.value = current
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-start justify-between gap-4">
        <div>
          <CardTitle>Environment variables</CardTitle>
          <CardDescription>
            Configure variables passed to this application.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" @click="addVariable">
          <Plus :size="14" /> Add variable
        </Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-for="[key, value] in variables" :key="key" class="flex items-end gap-2">
        <div class="min-w-0 flex-1 space-y-2">
          <Label :for="`env-key-${key}`">Key</Label>
          <Input
            :id="`env-key-${key}`"
            :model-value="key"
            placeholder="KEY"
            @update:model-value="updateKey(key, String($event), value)"
          />
        </div>
        <div class="min-w-0 flex-1 space-y-2">
          <Label :for="`env-value-${key}`">Value</Label>
          <Input
            :id="`env-value-${key}`"
            :model-value="value"
            placeholder="Value"
            @update:model-value="updateValue(key, String($event))"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          :aria-label="`Remove ${key || 'environment variable'}`"
          @click="removeVariable(key)"
        >
          <Trash2 :size="16" />
        </Button>
      </div>
      <p v-if="variables.length === 0" class="text-sm text-muted-foreground">
        No environment variables added.
      </p>
    </CardContent>
  </Card>
</template>
