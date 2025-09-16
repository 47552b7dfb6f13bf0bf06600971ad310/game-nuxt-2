<template>
  <header class="
    sticky top-0 z-50 
    bg-white/75 dark:bg-transparent backdrop-blur-xl
    border-b border-gray-200 dark:border-gray-800
    px-4
  ">
    <UiFlex justify="between" class="h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutManageNavSlide class="mr-2" />
      
      <UiFlex class="hidden md:flex">
        <NuxtLink to="/manage">
          <UiLogo />
        </NuxtLink>
      </UiFlex>
      
      <UiFlex justify="end" items="center" class="gap-1 ml-auto">
        <LazyAuthHeader />
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()


</script>