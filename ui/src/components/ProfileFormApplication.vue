<script setup lang="ts">
import { FolderOpen } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

withDefaults(defineProps<{ idEditable?: boolean }>(), {
  idEditable: false,
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Application</CardTitle>
    </CardHeader>
    <CardContent class="space-y-5">
      <FormField v-slot="{ componentField }" name="id">
        <FormItem>
          <FormLabel>Profile ID</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              :readonly="!idEditable"
              :class="!idEditable && 'bg-muted text-muted-foreground'"
              placeholder="my-profile-id"
            />
          </FormControl>
          <p class="text-[11px] text-muted-foreground">
            {{ idEditable ? 'Choose a unique identifier for this profile.' : 'This identifier is generated when the profile is created.' }}
          </p>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="directory">
        <FormItem>
          <FormLabel>Data folder</FormLabel>
          <div class="flex gap-2">
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <Button variant="outline" size="icon" aria-label="Choose data folder">
              <FolderOpen :size="16" />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
    </CardContent>
  </Card>
</template>
