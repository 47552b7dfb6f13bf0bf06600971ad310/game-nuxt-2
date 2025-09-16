<template>
  <div>
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <DataMinigameWheelHistory v-if="tab == 0" :user="user" />
    <DataMinigameDiceHistory v-if="tab == 1" :user="user" />
    <DataMinigameEggHistory v-if="tab == 2" :user="user" />
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const tab = ref(0)
const tabs = [
  { label: 'Vòng quay', key: 'wheel' },
  { label: 'Xúc xắc', key: 'dice' },
  { label: 'Đập trứng', key: 'egg' },
]
</script>
