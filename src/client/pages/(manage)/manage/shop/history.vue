<template>
  <UiContent title="History Shop" sub="Lịch sử mua toàn hệ thống">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageShopHistoryItem v-if="tab == 0" />
    <ManageShopHistoryPack v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const tab = ref(0)
const tabs = [
  { label: 'Vật phẩm', key: 'item' },
  { label: 'Gói vật phẩm', key: 'pack' },
]
</script>
