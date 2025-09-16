<template>
  <UiContent title="Level Rank" sub="Quản lý các sự kiện cấp độ nhân vật">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageRankProcessLevel v-if="tab == 0" />
    <ManageRankMissionLevel v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const tab = ref(0)
const tabs = [
  { label: 'Đua TOP', key: 'top' },
  { label: 'Nhiệm vụ', key: 'mission' },
]
</script>
