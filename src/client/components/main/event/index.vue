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
        <MainEventPower v-if="tab === 'powerup'" scroll />
        <MainEventReferral v-else-if="tab === 'referral'" scroll />
        <MainEventLogin v-else-if="tab === 'login'" scroll />
        <MainEventPay v-else-if="tab === 'pay'" scroll />
        <MainEventSpend v-else-if="tab === 'spend'" scroll />
        <MainEventPaymusty v-else-if="tab === 'paymusty'" scroll />
        <MainEventPaydays v-else-if="tab === 'paydays'" scroll />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Boolean
})
const configStore = useConfigStore()
const show = ref(configStore.config.menu.event)

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
const tab = ref(!!items.value[0] ? items.value[0].type : null)

const select = (type) => {
  tab.value = type
}
const active = computed(() => {
  if(items.value.length === 0) return false
  return true
})
</script>