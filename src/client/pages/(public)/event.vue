<template>
  <div>
    <DataEmpty text="Sự kiện này hiện đang bảo trì" v-if="!active" />

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
        <MainEventPower v-if="tab === 'powerup'" />
        <MainEventReferral v-else-if="tab === 'referral'" />
        <MainEventLogin v-else-if="tab === 'login'" />
        <MainEventPay v-else-if="tab === 'pay'" />
        <MainEventSpend v-else-if="tab === 'spend'" />
        <MainEventPaymusty v-else-if="tab === 'paymusty'" />
        <MainEventPaydays v-else-if="tab === 'paydays'" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const configStore = useConfigStore()
const show = ref(configStore.config.menu.event)

useSeoMeta({
  title: () => `Sự Kiện - ${configStore.config.name}`,
  ogTitle: () => `Sự Kiện - ${configStore.config.name}`,
  description: () => `Các sự kiện đang diễn ra của trò chơi`,
  ogDescription: () => `Các sự kiện đang diễn ra của trò chơi`,
})

const items = computed(() => {
  const list =  []
  if(!!show.value.powerup) list.push({ label: 'Tăng lực chiến', type: 'powerup', icon: 'i-mdi-trending-up' })
  if(!!show.value.referral) list.push({ label: 'Mời Bạn', type: 'referral', icon: 'i-weui-add-friends-filled' })
  if(!!show.value.login) list.push({ label: 'Điểm Danh', type: 'login', icon: 'i-material-symbols-today' })
  if(!!show.value.pay) list.push({ label: 'Tích Nạp', type: 'pay', icon: 'i-material-symbols-payment-arrow-down-outline-rounded' })
  if(!!show.value.spend) list.push({ label: 'Tiêu Xu', type: 'spend', icon: 'i-game-icons-pay-money' })
  if(!!show.value.paymusty) list.push({ label: 'Nạp Đơn', type: 'paymusty', icon: 'i-fluent-money-hand-20-filled' })
  if(!!show.value.paydays) list.push({ label: 'Liên Nạp', type: 'paydays', icon: 'i-game-icons-take-my-money' })
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