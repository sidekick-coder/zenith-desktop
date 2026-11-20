<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
import { toast } from 'vue-sonner'
import { $try } from 'core/utils/try.ts'

const route = useRoute()
const platform = window.platform

const profile = ref<ProfileSchema>()
const saving = ref(false)
const launching = ref(false)

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(profileSchema.create()),
})

async function load() {
  const response = await window.platform.profiles.findByIdOrFail(route.params.id as string)

  resetForm({
    values: response,
  })

  profile.value = response
}

async function launch() {
  launching.value = true

  const [error] = await $try(() => platform.zenith.launch(profile.value!.id))

  if (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to launch profile.')
    launching.value = false
    return
  }

  toast.success('Launched successfully!')

  await new Promise((resolve) => setTimeout(resolve, 800)) // simulate launch delay

  launching.value = false
}

const onSubmit = handleSubmit(async (values) => {
  saving.value = true

  const [error] = await $try(() => window.platform.profiles.updateById(values.id, values))

  if (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to save profile.')
    saving.value = false
    return
  }



  toast.success('Saved successfully!')

  await new Promise((resolve) => setTimeout(resolve, 800)) // simulate save delay

  saving.value = false
})

onMounted(load)
</script>

<template>
  <form
    v-if="profile"
    class="w-full px-8 py-4"
    @submit="onSubmit"
  >
    <PageHeader>
      <div>
        <PageTitle>{{ profile.name }}</PageTitle>
        <PageSubtitle>
          Configure how this Express application runs.
        </PageSubtitle>
      </div>
      <div class="flex items-center gap-2">
        <zd-btn-alert
          variant="destructive"
          :handle="() => platform.profiles.deleteById(profile!.id)"
          @success="() => $router.push('/profiles')"
        >
          <Trash2 :size="15" /> Delete profile
        </zd-btn-alert>

        <zd-btn
          type="submit"
          :loading="saving"
        >
          <Check :size="16" /> Save
        </zd-btn>
        <zd-btn
          type="button"
          :loading="launching"
          @click="launch"
        >
          <Play :size="16" /> Lauch
        </zd-btn>
      </div>
    </PageHeader>

    <div class="space-y-6">
      <ProfileFormApplication />
      <ProfileFormEnviroment />
      <ProfileFormRuntime />
    </div>
  </form>
  <div
    v-else
    class="w-full px-8 py-4"
  >
    <PageHeader>
      <div>
        <PageTitle>Profile not found</PageTitle>
        <PageSubtitle>This profile is no longer available.</PageSubtitle>
      </div>
    </PageHeader>
  </div>
</template>
