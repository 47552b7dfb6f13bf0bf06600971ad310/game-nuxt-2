<template>
  <div>
    <UAccordion 
      :items="navItems" 
      :ui="{
        'item': { padding: 'pt-0 pb-2 pl-8' },
      }"
      multiple
    >
      <template #default="{ item, open }">
        <UButton size="md" block class="justify-start mb-2 bg-gray-1000" :icon="item.icon" :class="{
          '!text-white': !!open,
          '!text-gray-400': !open,
        }">
          <UiText class="mr-auto">{{ item.label }}</UiText>
          <UiIcon
            name="i-bx-chevron-right"
            size="5"
            color="gray"
            class="ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </UButton>
      </template>

      <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
      <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
      <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
      <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
      <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
      <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
      <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emit('to')"/></template>
      <template #tab-7><UVerticalNavigation :links="navItems[7].children" @click="emit('to')"/></template>
      <template #tab-8><UVerticalNavigation :links="navItems[8].children" @click="emit('to')"/></template>
      <template #tab-9><UVerticalNavigation :links="navItems[9].children" @click="emit('to')"/></template>
      <template #tab-10><UVerticalNavigation :links="navItems[10].children" @click="emit('to')"/></template>
      <template #tab-11><UVerticalNavigation :links="navItems[11].children" @click="emit('to')"/></template>
      <template #tab-12><UVerticalNavigation :links="navItems[12].children" @click="emit('to')"/></template>
      <template #tab-13><UVerticalNavigation :links="navItems[13].children" @click="emit('to')"/></template>
    </UAccordion>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Thống kê', to: '/manage/statistic' },
      { label: 'Chi tiêu', to: '/manage/spend' },
    ]
  },
  {
    label: 'Cài đặt',
    icon: 'i-bxs-cog',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: 'Kích hoạt tính năng', to: '/manage/config/enable' },
      { label: 'Thông tin trang', to: '/manage/config/page' },
      { label: 'Danh mục trang', to: '/manage/config/menu' },
      { label: 'Khuyến mãi', to: '/manage/config/promo' },
      { label: 'Cấu hình trò chơi', to: '/manage/config/game' },
      { label: 'Thời gian thực', to: '/manage/config/socket' },
      { label: 'API Mạng xã hội', to: '/manage/config/apisocial' },
      { label: 'Quyền hạn quản trị', to: '/manage/config/permission' },
      { label: 'Chức năng ADMIN', to: '/manage/config/action' },
    ]
  },
  {
    label: 'Địa chỉ IP',
    icon: 'i-bxs-barcode',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: 'White List', to: '/manage/ip/whitelist' },
      { label: 'Danh sách', to: '/manage/ip/user' },
    ]
  },
  {
    label: 'Quảng cáo',
    icon: 'i-bx-spreadsheet',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
      { label: 'Landing', to: '/manage/ads/landing' },
      { label: 'From', to: '/manage/ads/from' }
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
    { label: 'Danh mục', to: '/manage/news/category' }, 
    { label: 'Danh sách', to: '/manage/news' }, 
    ]
  },
  {
    label: 'Tài khoản',
    icon: 'i-bx-user',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: 'Danh sách', to: '/manage/user' }, 
      { label: 'Cấp độ', to: '/manage/user/level' },
    ]
  },
  {
    label: 'Nạp tiền',
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
      { label: 'Kênh nạp', to: '/manage/payment/gate' }, 
      { label: 'Danh sách', to: '/manage/payment' }, 
    ]
  },
  {
    label: 'Trò chơi',
    icon: 'i-bx-cube-alt',
    defaultOpen: false,
    slot: 'tab-7',
    children: [
      { label: 'Gửi thư', to: '/manage/game/send' },
      { label: 'Vật phẩm', to: '/manage/game/item' },
      { label: 'Bộ vật phẩm', to: '/manage/game/itembox' }, 
      { label: 'Máy chủ', to: '/manage/game/server' },
      { label: 'Nhân vật', to: '/manage/game/roles' }
    ]
  },
  {
    label: 'Giftcode',
    icon: 'i-bx-barcode-reader',
    defaultOpen: false,
    slot: 'tab-8',
    children: [
      { label: 'Danh sách', to: '/manage/giftcode' }, 
      { label: 'Lịch sử', to: '/manage/giftcode/history' }, 
    ]
  },
  {
    label: 'Cửa hàng',
    icon: 'i-bx-shopping-bag',
    defaultOpen: false,
    slot: 'tab-9',
    children: [
      { label: 'Vật phẩm', to: '/manage/shop/item' },
      { label: 'Gói vật phẩm', to: '/manage/shop/pack' },
      { label: 'Lịch sử', to: '/manage/shop/history' }, 
    ]
  },
  {
    label: 'Sự Kiện',
    icon: 'i-bx-calendar',
    defaultOpen: false,
    slot: 'tab-10',
    children: [
      { label: 'Tăng lực chiến', to: '/manage/event/power' },
      { label: 'Mời bạn', to: '/manage/event/referral' },
      { label: 'Điểm danh', to: '/manage/event/login' }, 
      { label: 'Tích nạp', to: '/manage/event/pay' }, 
      { label: 'Tiêu phí', to: '/manage/event/spend' },
      { label: 'Nạp đơn', to: '/manage/event/paymusty' }, 
      { label: 'Liên nạp', to: '/manage/event/paydays' }, 
      { label: 'Lịch sử', to: '/manage/event/history' },
    ]
  },
  {
    label: 'Mini Game',
    icon: 'i-bx-game',
    defaultOpen: false,
    slot: 'tab-11',
    children: [
      { label: 'Vòng quay', to: '/manage/minigame/wheel' }, 
      { label: 'Xúc xắc', to: '/manage/minigame/dice' },
      { label: 'Đập trứng', to: '/manage/minigame/egg' },
      { label: 'Lịch sử', to: '/manage/minigame/history' },
    ]
  },
  {
    label: 'Xếp hạng',
    icon: 'i-bx-bar-chart-alt-2',
    defaultOpen: false,
    slot: 'tab-12',
    children: [
      { label: 'Cấp độ', to: '/manage/rank/level' },
      { label: 'Lực chiến', to: '/manage/rank/power' }, 
      { label: 'Nạp tiền', to: '/manage/rank/payment' }, 
      { label: 'Tiêu phí', to: '/manage/rank/spend' },
    ]
  },
  {
    label: 'Nhật ký',
    icon: 'i-bx-book',
    defaultOpen: false,
    slot: 'tab-13',
    children: [
      { label: 'Quản trị viên', to: '/manage/log/admin' }, 
      { label: 'Gửi vật phẩm', to: '/manage/log/send-item' },
    ]
  }
]

const openLink = (link) => {
  window.location.href = link
}
</script>