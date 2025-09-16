<template>
  <div>
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <DataShopHistoryItem v-if="tab == 0" :user="user" />
    <DataShopHistoryPack v-if="tab == 1" :user="user" />
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const tab = ref(0)
const tabs = [
  { label: 'Vật phẩm', key: 'item' },
  { label: 'Gói vật phẩm', key: 'pack' },
]
</script>
