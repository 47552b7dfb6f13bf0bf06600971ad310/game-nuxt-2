<template>
  <div>
    <DataEmpty text="Cửa hàng này hiện đang bảo trì" v-if="!active" />

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
        <MainShopRecharge v-if="tab === 'recharge'" scroll />
        <MainShopItem v-else-if="tab === 'item'" scroll />
        <MainShopPack v-else-if="tab === 'pack'" scroll />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Boolean
})
const configStore = useConfigStore()
const show = ref(configStore.config.menu.shop)

const items = computed(() => {
  const list =  []
  if(!!show.value.recharge) list.push({ label: 'Nạp Game', type: 'recharge', icon: 'i-simple-icons-gamejolt' })
  if(!!show.value.item) list.push({ label: 'Vật Phẩm', type: 'item', icon: 'i-pajamas-work-item-ticket' })
  if(!!show.value.pack) list.push({ label: 'Gói Vật Phẩm', type: 'pack', icon: 'i-ix-package-filled' })
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