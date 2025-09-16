<template>
  <div class="max-w-[500px] mx-auto">
    <ManageGameOs class="md:max-w-xl max-w-full mx-auto my-8 px-8" />

    <UiFlex justify="center" class="gap-2 flex-wrap mt-12">
      <UButton 
        v-for="(item, index) in menus" :key="index"
        size="xl" 
        class="
          flex flex-col justify-center 
          h-36 w-36
        "
        :class="{
          'bg-gray-1000': !!item.color
        }"
        :ui="{
          icon: { base: 'mb-2', size: { xl: 'h-10 w-10' } },
          font: 'font-semibold'
        }"
        :icon="item.icon"
        :color="item.color"
        @click="useTo().navigateToSSL(item.to)"
      >
        {{ item.label }}
      </UButton>
    </UiFlex>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const profile = computed(() => authStore.profile)

const cfgStore = useConfigStore()
const config = computed(() => cfgStore.config)

const menus = [
  { label: 'Thống Kê', icon: 'i-bxs-bar-chart-alt-2', color: 'gray', to: '/manage/statistic' },
  { label: 'Nạp Tiền', icon: 'i-bxs-credit-card', color: 'gray', to: '/manage/payment' },
  { label: 'Thành Viên', icon: 'i-bxs-user', color: 'gray', to: '/manage/user' },
  { label: 'Cài Đặt', icon: 'i-bxs-cog', color: 'gray', to: '/manage/config/page' },
  { label: 'Giftcode', icon: 'i-bx-barcode-reader', color: 'gray', to: '/manage/giftcode' },
  { label: 'Cửa Hàng', icon: 'i-bx-shopping-bag', color: 'gray', to: '/manage/shop/item' },
  { label: 'Sự Kiện', icon: 'i-bx-calendar', color: 'gray', to: '/manage/event/login' },
  { label: 'Minigame', icon: 'i-bx-game', color: 'gray', to: '/manage/minigame/wheel' },
  { label: 'Nhật Ký', icon: 'i-bx-book', color: 'gray', to: '/manage/log/admin' },
]
</script>