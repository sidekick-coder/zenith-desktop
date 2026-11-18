<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
</script>

<template>
  <div class="p-4">
    <PageHeader>
      <div>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Configure how Zenith behaves on your device.</PageSubtitle>
      </div>
    </PageHeader>

    <div class="flex flex-col gap-4 text-sm text-muted-foreground">
      No settings yet. Check back later for more options.
    </div>
  </div>
</template>
