<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Desktop entry</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-5 md:grid-cols-2">
      <div class="grid gap-2">
        <label class="text-sm font-medium">Filename</label>
        <div>
          <Input
            disabled
            placeholder="profile.desktop"
          />
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm font-medium">Name</label>
        <div>
          <Input
            disabled
            placeholder="Profile name"
          />
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm font-medium">Comment</label>
        <div>
          <Input
            disabled
            placeholder="Profile description"
          />
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm font-medium">Executable</label>
        <div>
          <Input
            disabled
            placeholder="/path/to/zenith-desktop"
          />
        </div>
      </div>

      <div class="grid gap-2">
        <label class="text-sm font-medium">Args</label>
        <div>
          <Input
            disabled
            placeholder="open profile-id"
          />
        </div>
      </div>

      <div class="grid gap-2 md:col-span-2">
        <label class="text-sm font-medium">Categories</label>
        <div>
          <Input
            disabled
            placeholder="Development;"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
