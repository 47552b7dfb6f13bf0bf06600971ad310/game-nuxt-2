
<template>
  <UiFlex class="sticky top-[var(--header-size)] bg-body z-[9] px-4 pb-2">
    <ClientOnly>
      <swiper-container 
        :freeMode="true"
        :spaceBetween="5"
        slidesPerView="auto"
        class="rounded-lg overflow-hidden"
      >
        <swiper-slide v-for="(option, index) in items" :key="index" class="!inline-block !w-auto">
          <UiFlex type="col" class="MenuTopItem overflow-hidden h-[68px] min-w-[90px] px-2 pt-2.5" @click="navigateTo(option.to)" :class="{'MenuTopItem--active': route.name === option.type }">
            <UiImg :src="option.image" class="w-[40px] h-[40px] relative top-[-4px]" w="1" h="1" img-size="100px"/>
            <UiText weight="bold" class="MenuTopItem__Text text-xs md:text-sm relative top-[-3px]">{{ option.label }}</UiText>
          </UiFlex>
        </swiper-slide>
      </swiper-container >
    </ClientOnly>
  </UiFlex>
</template>

<script setup>
const route = useRoute()
const items = ref([
  { label: 'Tin Tức', type: 'index', image: '/images/banner/news-min.png', to: '/' },
  { label: 'Nạp Xu', type: 'payment', image: '/images/banner/payment-min.png', to: '/payment' },
  { label: 'Giftcode', type: 'giftcode', image: '/images/banner/giftcode-min.png', to: '/giftcode' },
  { label: 'Cửa Hàng', type: 'shop', image: '/images/banner/shop-min.png', to: '/shop' },
  { label: 'Sự Kiện', type: 'event', image: '/images/banner/event-min.png', to: '/event' },
  { label: 'MiniGame', type: 'minigame', image: '/images/banner/minigame-min.png', to: '/minigame' },
  { label: 'Xếp Hạng', type: 'rank', image: '/images/banner/rank-min.png', to: '/rank' },
])
</script>

<style lang="sass">
.MenuTopItem
  background-repeat: no-repeat
  background-position: 50%
  background-size: contain
  background-image: url('/images/ui/bg-default-alias-mb.webp')
  transition: background-image 0.25s ease
  cursor: pointer
  &:hover
    background-image: url('/images/ui/bg-active-alias-mb.webp')
  &--active
    background-image: url('/images/ui/bg-active-alias-mb.webp')
  &__Text
    background-clip: text
    background-image: linear-gradient(180deg, #ffe1a5 23.5%, #ffc987 66%, #f77b0e)
    color: transparent
</style>