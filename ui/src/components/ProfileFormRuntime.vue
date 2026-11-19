<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
            <Input v-bind="componentField" placeholder="/path/to/node" />
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
