<template>
  <UCard class="relative @container rounded-xl overflow-hidden" :ui="{ body: { padding: 'p-0 sm:p-0'} }">
    <UiFlex items="center">
      <UiImg :src="config.og_image" w="16" h="9" img-size="700px" class="bg-card @3xl:max-w-[55%] @3xl:min-w-[55%] @3xl:w-[55%] w-full" />

      <UiFlex class="
        @3xl:flex-col
        @3xl:p-6 p-4 
        @3xl:relative absolute bottom-0 
        w-full grow 
        gap-4
      ">
        <div class="grow">
          <UiText weight="bold" class="
            SVN line-clamp-2 mb-1 @3xl:mb-2
            text-2xl @3xl:text-3xl @4xl:text-4xl 
            @3xl:text-center
          " >
            {{ config.name }}
          </UiText>
          
          <UiText color="gray" class="
            line-clamp-1 @3xl:line-clamp-3 italic
            text-xs @3xl:text-sm @4xl:text-base 
            @3xl:text-center
          ">
            {{ config.description }}
          </UiText>
        </div>

        <PlayBtn size="md" />
      </UiFlex>
    </UiFlex>

    <!-- <PlayBtn class="absolute top-1 right-1 @xl:bottom-1 @3xl:top-auto"></PlayBtn> -->
  </UCard>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>