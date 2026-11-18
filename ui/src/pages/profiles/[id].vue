<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, FolderOpen, Play, Plus, Trash2 } from '@lucide/vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { profiles } from '@/data/profiles'

const route = useRoute()
const profile = computed(() => profiles.find((item) => item.id === route.params.id))

const name = ref(profile.value?.name ?? '')
const directory = ref(profile.value?.directory ?? '')
let nextVariableId = 0
const envVariables = ref(
  Object.entries(profile.value?.env ?? {}).map(([key, value]) => ({
    id: nextVariableId++,
    key,
    value,
  })),
)
const nodePath = ref('')
const zenithPath = ref('')
const saved = ref(false)

function addVariable() {
  envVariables.value.push({ id: nextVariableId++, key: '', value: '' })
}

function removeVariable(id: number) {
  envVariables.value = envVariables.value.filter((variable) => variable.id !== id)
}

function save() {
  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2200)
}
</script>

<template>
  <div v-if="profile" class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>{{ profile.name }}</PageTitle>
        <PageSubtitle>
          Configure how this Express application runs.
        </PageSubtitle>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="destructive">
          <Trash2 :size="15" /> Delete profile
        </Button>
        <Button @click="save">
          <Check :size="16" /> {{ saved ? 'Saved' : 'Save changes' }}
        </Button>
        <Button @click="save">
          <Play :size="16" /> Lauch
        </Button>
      </div>
    </PageHeader>

    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="space-y-2">
            <Label for="profile-id">Profile ID</Label>
            <Input id="profile-id" :model-value="profile.id" readonly class="bg-muted text-muted-foreground" />
            <p class="text-[11px] text-muted-foreground">
              This identifier is generated when the profile is created.
            </p>
          </div>
          <div class="space-y-2">
            <Label for="profile-name">Name</Label>
            <Input id="profile-name" v-model="name" />
          </div>
          <div class="space-y-2">
            <Label for="profile-directory">Data folder</Label>
            <div class="flex gap-2">
              <Input id="profile-directory" v-model="directory" />
              <Button variant="outline" size="icon" aria-label="Choose data folder">
                <FolderOpen :size="16" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div v-for="variable in envVariables" :key="variable.id" class="flex items-end gap-2">
            <div class="min-w-0 flex-1 space-y-2">
              <Label :for="`env-key-${variable.id}`">Key</Label>
              <Input :id="`env-key-${variable.id}`" v-model="variable.key" placeholder="KEY" />
            </div>
            <div class="min-w-0 flex-1 space-y-2">
              <Label :for="`env-value-${variable.id}`">Value</Label>
              <Input :id="`env-value-${variable.id}`" v-model="variable.value" placeholder="Value" />
            </div>
            <Button variant="outline" size="icon" :aria-label="`Remove ${variable.key || 'environment variable'}`"
              @click="removeVariable(variable.id)">
              <Trash2 :size="16" />
            </Button>
          </div>
          <p v-if="envVariables.length === 0" class="text-sm text-muted-foreground">
            No environment variables added.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Runtime</CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="space-y-2">
            <Label for="node-path">Node.js path</Label>
            <Input id="node-path" v-model="nodePath" placeholder="/path/to/node" />
          </div>
          <div class="space-y-2">
            <Label for="zenith-path">Zenith path</Label>
            <Input id="zenith-path" v-model="zenithPath" placeholder="/path/to/zenith" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  <div v-else class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Profile not found</PageTitle>
        <PageSubtitle>This profile is no longer available.</PageSubtitle>
      </div>
    </PageHeader>
  </div>
</template>
