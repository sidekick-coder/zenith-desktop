<script setup lang="ts">
import { AppWindow } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PageSubtitle from '@/components/PageSubtitle.vue'
import PageTitle from '@/components/PageTitle.vue'
import { Button } from '@/components/ui/button'
import { profiles } from '@/data/profiles'
</script>

<template>
  <div class="w-full px-8 py-4">
    <PageHeader>
      <div>
        <PageTitle>Profiles</PageTitle>
        <PageSubtitle>
          Manage and launch your local Express applications.
        </PageSubtitle>
      </div>
      <Button>
        Add new
      </Button>
    </PageHeader>

    <div class="flex flex-wrap -mx-4">
      <RouterLink v-for="profile in profiles" :key="profile.id" :to="`/profiles/${profile.id}`"
        class="group flex w-[300px] items-center gap-4 rounded-lg p-4 transition-colors hover:bg-muted">
        <div class="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <AppWindow :size="31" :stroke-width="1.7" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-semibold">{{ profile.name }}</span>
          <span class="text-xs">{{ profile.description }}</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
