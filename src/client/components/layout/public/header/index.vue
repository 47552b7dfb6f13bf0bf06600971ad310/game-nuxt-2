<template>
  <header class=" 
    sticky safe-area-top
    top-0 left-0 z-[10] 
    bg-body
    flex items-center
    w-full
    h-[var(--header-size)] max-h-[var(--header-size)]
    px-4
    md:gap-1 gap-0.5
  ">
    <NuxtLink to="/" class="max-md:hidden mr-4">
      <UiLogo/>
    </NuxtLink>

    <UiFlex>
      <PlayBtn />
    </UiFlex>

    <UiFlex class="gap-1 ml-auto">
      <AuthSign v-if="!authStore.isLogin"  />
      <LazyAuthHeader v-else />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
</script>