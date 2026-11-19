<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { CircleHelp, Command, LayoutGrid, Settings } from '@lucide/vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <div class="flex items-center gap-2.5 px-2 text-lg font-bold tracking-tight">
          <div class="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Command :size="17" />
          </div>
          zenith
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="route.name === 'profiles'"
                  tooltip="Profiles"
                >
                  <RouterLink to="/profiles">
                    <LayoutGrid :size="18" /><span>Profiles</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  as-child
                  :is-active="route.name === 'settings'"
                  tooltip="Settings"
                >
                  <RouterLink to="/settings">
                    <Settings :size="18" /><span>Settings</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <header class="flex h-[70px] items-center border-b px-4">
        <div class="flex items-center gap-3">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage class="text-muted-foreground">
                  Workspace
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{{ route.name === 'settings' ? 'Settings' : route.name === 'profile' ? 'Edit profile' : 'Profiles' }}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main>
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
  <Toaster position="top-right" />
</template>
