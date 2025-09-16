<template>
  <NuxtLink :to="`/news/${news._id}`">
    <UCard class="overflow-hidden cursor-pointer" :ui="{
      divide: '',
      shadow: 'shadow',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <UiImg :src="news.og_image" w="16" h="9" img-size="500px" class="bg-main-red" />
      </template>

      <template #default>
        <UiText weight="bold" class="mb-0.5 line-clamp-2 text-sm sm:text-base text-gray-300 sm:min-h-[48px] text-title">
          {{ news.title }}
        </UiText>
        
        <UiText color="gray" class="italic line-clamp-2 text-xs min-h-[32px]">
          {{ news.description }}
        </UiText>

        <UiFlex justify="between" class="mt-2">
          <UiText weight="semibold" size="xs" class="text-title">
            {{ news.category?.name || 'News' }}
          </UiText>

          <UiText color="gray" weight="semibold" size="xs">
            {{ useDayJs().displayTime(news.createdAt) }}
          </UiText>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['news'])
</script>