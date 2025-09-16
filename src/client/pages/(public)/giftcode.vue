<template>
  <div>
    <MainActionGiftcode />
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Giftcode - ${configStore.config.name}`,
  ogTitle: () => `Giftcode - ${configStore.config.name}`,
  description: () => 'Nhập mã quà tặng và nhận thưởng',
  ogDescription: () => 'Nhập mã quà tặng và nhận thưởng',
})

const check = () => !configStore.config.menu.action.giftcode && useTo().navigateToSSL('/')
check()
</script>