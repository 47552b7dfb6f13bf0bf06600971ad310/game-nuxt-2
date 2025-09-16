<template>
  <UiContent title="History Minigame" sub="Lịch sử minigame toàn hệ thống">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageMinigameHistoryWheel v-if="tab == 0" />
    <ManageMinigameHistoryDice v-if="tab == 1" />
    <ManageMinigameHistoryEgg v-if="tab == 2" />
  </UiContent>
</template>

<script setup>
const tab = ref(0)
const tabs = [
  { label: 'Vòng Quay', key: 'wheel' },
  { label: 'Xúc Xắc', key: 'dice' },
  { label: 'Đập Trứng', key: 'egg' },
]
</script>
