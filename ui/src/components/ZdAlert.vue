<script setup lang="ts">
import type { PropType } from 'vue'
import ZdBtn from './ZdBtn.vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { $try } from '@/utils/try'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  title: {
    type: String,
    default: () => 'Are you sure?'
  },
  description: {
    type: String,
    default: () => 'This action cannot be undone.'
  },
  handle: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve()
  },
})

const emit = defineEmits(['success', 'error'])

const loading = defineModel('loading', {
  type: Boolean,
  default: false
})


async function confirm() {
  loading.value = true

  const [error, response] = await $try(() => props.handle())

  if (error) {
    loading.value = false
    console.error(error)
    emit('error', error)
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 500)) // simulate delay

  emit('success', response)

  loading.value = false
}

</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="loading">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          :disabled="loading"
          @click="confirm"
        >
          Confirm
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
