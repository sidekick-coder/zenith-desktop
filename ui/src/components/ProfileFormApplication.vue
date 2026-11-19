<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ZdFormTextField from '@/components/ZdFormTextField.vue'

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
