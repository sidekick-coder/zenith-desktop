<script setup lang="ts">
import { ref } from 'vue'
import * as v from 'valibot'
import { toTypedSchema } from '@vee-validate/valibot'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { profileSchema } from 'core/schemas/profile.ts'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { profiles } from '@/data/profiles'

const router = useRouter()
const open = ref(false)

const { handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: toTypedSchema(v.pick(profileSchema.create(), ['id'])),
})

const onSubmit = handleSubmit(async ({ id }) => {
  if (profiles.some((profile) => profile.id === id)) {
    setFieldError('id', `A profile with id "${id}" already exists.`)
    return
  }

  try {
    const profile = await window.platform.profiles.create({ id })

    profiles.push(profile)
    open.value = false
    resetForm()
    router.push({ name: 'profile', params: { id: profile.id } })
  } catch (error) {
    setFieldError('id', error instanceof Error ? error.message : 'Failed to create profile.')
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button>Add new</Button>
    </DialogTrigger>
    <DialogContent>
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>New profile</DialogTitle>
          <DialogDescription>
            Choose a unique identifier. You can configure the rest afterwards.
          </DialogDescription>
        </DialogHeader>
        <FormField
          v-slot="{ componentField }"
          name="id"
        >
          <FormItem class="py-4">
            <FormLabel>Profile ID</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                placeholder="my-profile-id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter>
          <Button type="submit">
            Create profile
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
