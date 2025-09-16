<template>
  <div class="w-full py-4 px-6">
    <UiFlex type="col" v-for="(item, index) in list" :key="`m-${index}`">
      <UiFlex 
        v-if="!item.child" 
        class="MenuItem gap-4 text-gray-500 rounded-xl" 
        @click="goTo(item.to)"
        :class="{
          'MenuItem--Active': item.to == activeTo
        }"
      >
        <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" />
        <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ item.title }}</UiText>
      </UiFlex>

      <div class="w-full my-2" v-else>
        <UiText size="xs" weight="bold" class="mb-4">{{ item.title }}</UiText>
        <UiFlex 
          v-for="(child, cIndex) in item.child" :key="`c-${index}-${cIndex}`" 
          class="MenuItem gap-4 text-gray-500 rounded-xl" 
          @click="goTo(child.to)"
          :class="{
            'MenuItem--Active': child.to == activeTo
          }"
        >
          <UiIcon class="MenuItem__Icon" :name="child.icon" size="6" />
          <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ child.title }}</UiText>
        </UiFlex>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const route = useRoute()
const emit = defineEmits(['to'])
const show = ref(configStore.config.menu)

const activeTo = computed(() => {
  return route.fullPath
})

const goTo = (link) => {
  if(link == activeTo.value) return
  navigateTo(link)
  emit('to')
}

const list =  computed(() => { 
  const data = [
    { title: 'Chức Năng', child: [
      { title: 'Tin tức', icon: 'i-bx-news', to: '/news' },
      { title: 'Nạp xu', icon: 'i-bxs-credit-card', to: '/payment', disabled: !show.value.action.payment },
      { title: 'Giftcode', icon: 'i-bxs-barcode', to: '/giftcode', disabled: !show.value.action.giftcode },
    ]},
    { title: 'Cửa Hàng', child: [
      { title: 'Nạp game', icon: 'i-simple-icons-gamejolt', to: '/shop?type=recharge', disabled: !show.value.shop.recharge },
      { title: 'Vật phẩm', icon: 'i-pajamas-work-item-ticket', to: '/shop?type=item', disabled: !show.value.shop.item },
      { title: 'Gói vật phẩm', icon: 'i-ix-package-filled', to: '/shop?type=pack', disabled: !show.value.shop.pack },
    ]},
    { title: 'Sự Kiện', child: [
      { title: 'Tăng lực chiến', icon: 'i-mdi-trending-up', to: '/event?type=powerup', disabled: !show.value.event.powerup },
      { title: 'Mời bạn', icon: 'i-weui-add-friends-filled', to: '/event?type=referral', disabled: !show.value.event.referral },
      { title: 'Điểm danh', icon: 'i-material-symbols-today', to: '/event?type=login', disabled: !show.value.event.login },
      { title: 'Tích nạp', icon: 'i-material-symbols-payment-arrow-down-outline-rounded', to: '/event?type=pay', disabled: !show.value.event.pay },
      { title: 'Tiêu phí', icon: 'i-game-icons-pay-money', to: '/event?type=spend', disabled: !show.value.event.spend },
      { title: 'Đơn nạp', icon: 'i-fluent-money-hand-20-filled', to: '/event?type=paymusty', disabled: !show.value.event.paymusty },
      { title: 'Liên nạp', icon: 'i-game-icons-take-my-money', to: '/event?type=paydays', disabled: !show.value.event.paydays },
    ]},
    { title: 'Mini Game', child: [
      { title: 'Vòng quay', icon: 'i-mynaui-wheel', to: '/minigame?type=wheel', disabled: !show.value.minigame.wheel },
      { title: 'Xúc xắc', icon: 'i-fa6-solid-dice', to: '/minigame?type=dice', disabled: !show.value.minigame.dice },
      { title: 'Đập trứng', icon: 'i-mdi-egg-easter', to: '/minigame?type=egg', disabled: !show.value.minigame.egg },
    ]},
    { title: 'Xếp Hạng', child: [
      { title: 'Cấp độ', icon: 'i-icon-park-solid-level', to: '/rank?type=level', disabled: !show.value.rank.level },
      { title: 'Lực chiến', icon: 'i-game-icons-pointy-sword', to: '/rank?type=power', disabled: !show.value.rank.power },
    ]},
  ]

  return data
    .map(section => {
      const enabledChildren = section.child.filter(item => !item.disabled);
      if (enabledChildren.length > 0) {
        return {
          ...section,
          child: enabledChildren
        };
      }
      return null;
    })
    .filter(Boolean);
})
</script>