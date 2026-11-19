<script setup lang="ts">
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form/index.ts'

import { Input } from '@/components/ui/input/index.ts'

defineProps({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'text',
    },
    step: {
        type: [String, Number],
        default: null,
    },
    label: {
        type: String,
        required: true,
    },
    hint: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    autofocus: {
        type: Boolean,
        default: false,
    },
    presets: {
        type: Array as () => Array<{ label: string; value: string }>,
        default: () => [],
    },
})
</script>
<template>
  <FormField
    v-slot="{ componentField }"
    :name
    :validate-on-blur="false"
  >
    <FormItem>
      <FormLabel class="font-medium">
        {{ label }}
      </FormLabel>
      <FormControl>
        <div class="flex gap-2">
          <Input
            :type
            :placeholder
            :disabled
            :autocomplete
            :readonly
            :autofocus
            :step
            class="h-10 flex-1 read-only:bg-muted read-only:text-muted-foreground"
            v-bind="componentField"
          />

          <slot name="append" />
        </div>
      </FormControl>
      <FormDescription v-if="hint">
        {{ hint }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
