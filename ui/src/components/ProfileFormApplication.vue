<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ZdFormTextField from '@/components/ZdFormTextField.vue'
import { useFormContext } from 'vee-validate'
import { $try } from 'core/utils/try.ts'
import { toast } from 'vue-sonner'
import type { ProfileSchema } from 'core/schemas/profile.js'

const profile = defineModel("profile", {
   type: Object as () => ProfileSchema,
   required: true,
})

const { setFieldValue } = useFormContext()

const selectingIcon = ref(false)

async function selectIcon() {
  selectingIcon.value = true

  const [error, response] = await $try(() => window.platform.profiles.selectIcon(profile.value.id as string))

  selectingIcon.value = false

  if (error) {
    console.error(error)
    toast.error(error instanceof Error ? error.message : 'Failed to select profile icon.')
    return
  }

  if (response) {
    setFieldValue('icon_path', response.icon_path)
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Application</CardTitle>
      <CardDescription>
        General profile information, such as the profile's name and description.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-5">
      <div class="grid gap-3">
        <div class="flex size-24 items-center justify-center overflow-hidden rounded-xl border bg-muted">
          <img
            v-if="profile?.icon_path"
            :src="`media://${profile?.icon_path}`"
            alt="Profile icon preview"
            class="size-full object-cover"
          >
          <span
            v-else
            class="text-xs text-muted-foreground"
          >
            No icon
          </span>
        </div>

        <zd-form-text-field
          name="icon_path"
          label="Icon"
          readonly
          placeholder="No icon"
        >
          <template #append>
            <zd-btn
              type="button"
              variant="outline"
              :loading="selectingIcon"
              @click="selectIcon"
            >
              Choose
            </zd-btn>
          </template>
        </zd-form-text-field>
      </div>

      <zd-form-text-field
        name="id"
        label="Profile ID"
        readonly
      />

      <zd-form-text-field
        name="directory"
        label="Directory"
        readonly
        hint="The directory where the profile's data is stored."
      />

      <zd-form-text-field
        name="name"
        label="Name"
      />

      <zd-form-text-field
        name="description"
        label="Description"
      />

      <zd-form-text-field
        name="data_directory"
        label="Data directory"
        hint="The directory where the zenith data is stored."
      />
    </CardContent>
  </Card>
</template>
