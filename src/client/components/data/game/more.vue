<template>
  <div class="@container">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <UiTitle name="Trò Chơi Khác" icon="i-famicons-game-controller" />
    </UiFlex>

    <DataEmpty :loading="loading" text="Không có dữ liệu" class="min-h-[250px]" v-if="!!loading || list.length == 0"></DataEmpty>

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
        :autoplay="{ delay: 2500, disableOnInteraction: false }" 
        :loop="true"
        class="rounded-xl overflow-hidden"
      >
        <swiper-slide v-for="(item, idx) in list" :key="idx" >
          <DataGameBox :game="item"/>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<script setup>
const loading = ref(true)
const list = ref([])

const getList = async () => {
  try {
    const data = await useAPI('game/public/more')
    loading.value = false

    list.value = data
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

onMounted(() => setTimeout(getList, 1))
</script>