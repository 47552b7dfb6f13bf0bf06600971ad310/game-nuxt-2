<template>
  <UiFlex wrap :justify="justify" class="gap-0.5">
    <UiText size="sm" class="text-gray-600 italic" v-if="!items || items.length == 0">{{empty || 'Chưa có vật phẩm'}}</UiText>
    <DataItem v-for="(data, index) in items" :key="index" :item="data.item" :amount="data.amount" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['items', 'empty', 'justify'])
</script>