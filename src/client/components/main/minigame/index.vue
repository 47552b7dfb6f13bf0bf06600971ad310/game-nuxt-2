<template>
  <div>
    <DataEmpty text="Minigame này hiện đang bảo trì" v-if="!active" />

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
              class="p-4 min-w-[120px] md:min-w-[145px]"
            >
              <UiFlex type="col">
                <UiIcon :name="option.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
                <UiText weight="bold" class="text-white text-xs md:text-sm">{{ option.label }}</UiText>
              </UiFlex>
            </UiButtonSelect>
          </swiper-slide>
        </swiper-container >
      </ClientOnly>

      <Transition name="page" mode="out-in">
        <MainMinigameWheel v-if="tab === 'wheel'" />
        <MainMinigameDice v-else-if="tab === 'dice'" />
        <MainMinigameEgg v-else-if="tab === 'egg'" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const show = ref(configStore.config.menu.minigame)

const items = computed(() => {
  const list =  []
  if(!!show.value.wheel) list.push({ label: 'Vòng Quay', type: 'wheel', icon: 'i-mynaui-wheel' })
  if(!!show.value.dice) list.push({ label: 'Xúc Xắc', type: 'dice', icon: 'i-fa6-solid-dice' })
  if(!!show.value.egg) list.push({ label: 'Đập Trứng', type: 'egg', icon: 'i-mdi-egg-easter' })
  return list
})
const tab = ref(!!items.value[0] ? items.value[0].type : null)

const select = (type) => {
  tab.value = type
}
const active = computed(() => {
  if(items.value.length === 0) return false
  return true
})
</script>