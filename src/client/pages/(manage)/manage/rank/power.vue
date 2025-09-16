<template>
  <UiContent title="Power Rank" sub="Quản lý các sự kiện lực chiến nhân vật">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageRankProcessPower v-if="tab == 0" />
    <ManageRankMissionPower v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const tab = ref(0)
const tabs = [
  { label: 'Đua TOP', key: 'top' },
  { label: 'Nhiệm vụ', key: 'mission' },
]
</script>
