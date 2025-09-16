<template>
  <div>
    <DataEmpty text="Xếp hạng đang bảo trì" v-if="!active" />

    <div v-else>
      <ClientOnly>
        <swiper-container 
          :freeMode="true"
          :spaceBetween="5"
          slidesPerView="auto"
          class="rounded-xl overflow-hidden mb-2"
        >
          <swiper-slide v-for="(option, index) in items" :key="index" class="!inline-block !w-auto">
            <UiButtonSelect
              @click="select(option.type)"
              :active="!!tab && tab == option.type"
              class="px-4 py-2"
            >
              <UiFlex class="gap-2">
                <UiIcon :name="option.icon" class="h-6 w-6" />
                <UiText weight="bold" class="text-white text-xs md:text-sm">{{ option.label }}</UiText>
              </UiFlex>
            </UiButtonSelect>
          </swiper-slide>
        </swiper-container >
      </ClientOnly>

      <Transition name="page" mode="out-in">
        <MainRankLevel v-if="tab === 'level'" />
        <MainRankPower v-else-if="tab === 'power'" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const configStore = useConfigStore()
const show = ref(configStore.config.menu.rank)

useSeoMeta({
  title: () => `Xếp Hạng - ${configStore.config.name}`,
  ogTitle: () => `Xếp Hạng - ${configStore.config.name}`,
  description: () => `Các loại xếp hạng của trò chơi`,
  ogDescription: () => `Các loại xếp hạng của trò chơi`,
})

const items = computed(() => {
  const list =  []
  if(!!show.value.level) list.push({ label: 'Cấp Độ', type: 'level', icon: 'i-icon-park-solid-level' })
  if(!!show.value.power) list.push({ label: 'Lực Chiến', type: 'power', icon: 'i-game-icons-pointy-sword' })
  return list
})
const tab = ref(route.query.type ? route.query.type : (!!items.value[0] ? items.value[0].type : null))

const select = (type) => {
  navigateTo({ path: route.fullPath, query: { type: type }})
  tab.value = type
}
const active = computed(() => {
  if(items.value.length === 0) return false
  if(!!route.query.type){
    const shop = items.value.find(item => item.type === route.query.type)
    if(!shop) return false
  }
  return true
})

watch(() => route.query.type, (val) => tab.value = val ? val : (!!items.value[0] ? items.value[0].type : null))
</script>