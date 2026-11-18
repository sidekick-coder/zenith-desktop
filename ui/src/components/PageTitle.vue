<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <h1 :class="cn('text-lg font-bold tracking-[-.045em]', props.class)">
    <slot />
  </h1>
</template>
