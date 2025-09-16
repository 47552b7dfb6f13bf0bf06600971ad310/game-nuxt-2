<template>
  <div class="md:max-w-[900px] mx-auto">
    <DataEmpty loading class="min-h-[300px]" v-if="!!loading"/>

    <div v-else>
      <UiFlex class="mb-4">
        <UAvatar :src="news.updater?.avatar" size="md" class="mr-4"/>

        <UiFlex type="col" items="start">
          <UiText color="primary" weight="semibold" class="capitalize">{{ news.updater?.username }}</UiText>
          <UiText color="gray" weight="semibold" size="xs">Đăng {{ useDayJs().displayFull(news.createdAt) }}</UiText>
        </UiFlex>
      </UiFlex>

      <div class="my-6">
        <DataEmpty class="h-[300px]" v-if="!news.content || news.content == '<p></p>'" />
        <UiEditorContent :content="news.content" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const route = useRoute()
const news = ref({
  title: '...',
  description: '...',
  og_image: null,
  updater: {
    username: '...',
  },
  category: {
    name: '...'
  },
  createdAt: '...',
  updatedAt: '...',
})
const loading = ref(true)

useSeoMeta({
  title: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  description: () => news.value.description,
  ogDescription: () => news.value.description,
  ogImage: () => new URL(news.value.og_image || '/images/null.webp', runtimeConfig.public.clientURL), 
  ogImageAlt: () => news.value.title
})

const getNews = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/id', {
      _id: route.params._id
    })
    
    news.value = data
    loading.value = false
  }
  catch(e){
    return false
  }
}

getNews()
</script>