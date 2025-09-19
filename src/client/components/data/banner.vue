<template>
  <UCard class="relative @container rounded-xl overflow-hidden" :ui="{ body: { padding: 'p-0 sm:p-0'} }">
    <UiImg :src="config.og_image" w="16" h="9" img-size="700px" class="bg-card @3xl:max-w-[55%] @3xl:min-w-[55%] @3xl:w-[55%] w-full" />
  </UCard>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>