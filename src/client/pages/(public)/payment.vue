<template>
  <div>
    <MainActionPayment />
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nạp Xu - ${configStore.config.name}`,
  ogTitle: () => `Nạp Xu - ${configStore.config.name}`,
  description: () => 'Nạp xu vào tài khoản với các ưu đãi hấp dẫn',
  ogDescription: () => 'Nạp xu vào tài khoản với các ưu đãi hấp dẫn',
})

const check = () => !configStore.config.menu.action.payment && useTo().navigateToSSL('/')
check()
</script>