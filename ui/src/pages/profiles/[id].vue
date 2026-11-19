<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/valibot'
import { useForm } from 'vee-validate'
import { Check, Play, Trash2 } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { profileSchema, type ProfileSchema } from 'core/schemas/profile.ts'
import ProfileFormApplication from '@/components/ProfileFormApplication.vue'
import ProfileFormEnviroment from '@/components/ProfileFormEnviroment.vue'
import ProfileFormRuntime from '@/components/ProfileFormRuntime.vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { Button } from '@/components/ui/button'
import { profiles } from '@/data/profiles'

const route = useRoute()
const existingProfile = computed(() => profiles.find((item) => item.id === route.params.id))
const saved = ref(false)

function toFormValues(profile?: ProfileSchema) {
  return {
    id: profile?.id ?? '',
    name: profile?.name ?? '',
    directory: profile?.directory ?? '',
    data_folder: profile?.data_folder ?? '',
    env: { ...profile?.env },
    node_path: profile?.node_path ?? '',
    zenith_path: profile?.zenith_path ?? '',
  }
}

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(profileSchema.create()),
  initialValues: toFormValues(existingProfile.value),
})

watch(existingProfile, (profile) => {
  if (profile) resetForm({ values: toFormValues(profile) })
})

const onSubmit = handleSubmit((values) => {
  if (!existingProfile.value) return

  existingProfile.value.name = values.name
  existingProfile.value.directory = values.directory
  existingProfile.value.data_folder = values.directory
  existingProfile.value.env = values.env
  existingProfile.value.node_path = values.node_path
  existingProfile.value.zenith_path = values.zenith_path
  existingProfile.value.updated_at = new Date().toISOString()

  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2200)
})
</script>

<template>
  <form v-if="existingProfile" class="w-full px-8 py-4" @submit="onSubmit">
    <PageHeader>
      <div>
        <PageTitle>{{ existingProfile.name }}</PageTitle>
        <PageSubtitle>
          Configure how this Express application runs.
        </PageSubtitle>
      </div>
      <div class="flex items-center gap-2">
        <Button type="button" variant="destructive">
          <Trash2 :size="15" /> Delete profile
        </Button>
        <Button type="submit">
          <Check :size="16" /> {{ saved ? 'Saved' : 'Save changes' }}
        </Button>
        <Button type="button" @click="onSubmit">
          <Play :size="16" /> Lauch
        </Button>
      </div>
    </PageHeader>

    <div class="space-y-6">
      <ProfileFormApplication />
      <ProfileFormEnviroment />
      <ProfileFormRuntime />
    </div>
  </form>
  <div v-else class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Profile not found</PageTitle>
        <PageSubtitle>This profile is no longer available.</PageSubtitle>
      </div>
    </PageHeader>
  </div>
</template>
