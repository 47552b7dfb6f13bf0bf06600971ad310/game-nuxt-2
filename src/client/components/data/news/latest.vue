<template>
  <div class="@container">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <NuxtLink to="/news">
        <UiTitle name="Tin Tức" icon="i-bx-news" />
      </NuxtLink>

      <UButton icon="i-bxs-chevrons-right" color="gray" to="/news" class="@2xl:hidden">Xem thêm</UButton>
    </UiFlex>

    <DataEmpty :loading="loading" text="Không có dữ liệu" class="min-h-[280px]" v-if="!!loading || list.length == 0"></DataEmpty>

    <ClientOnly v-else>
      <swiper-container 
        ref="containerRef" 
        :slidesPerView="2" 
        :spaceBetween="12"
        :breakpoints="{
          '768': {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          '1500': {
            slidesPerView: 4,
            spaceBetween: 12,
          },
        }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }" 
        :loop="true"
        class="rounded-xl overflow-hidden"
      >
        <swiper-slide v-for="(item, idx) in list" :key="idx" >
          <DataNewsBox :news="item"></DataNewsBox>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<script setup>
const loading = ref(true)
const list = ref([])

const getLatest = async () => {
  try {
    const latest = await useAPI('news/public/latest')
    loading.value = false

    list.value = latest
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getLatest()
</script>