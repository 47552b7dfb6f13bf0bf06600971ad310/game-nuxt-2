<template>
  <div>
    <UForm @submit="submit">
      <UiFlex justify="between" class="mb-2">
        <UiText weight="semibold" class="text-title">Bảng Xếp Hạng</UiText>
        <SelectGameServer auto v-model="server" v-model:loading="loading" size="md"  />
      </UiFlex>

      <UiFlex v-if="!!server">
        <UTabs v-model="tab" :items="tabItems"></UTabs>
      </UiFlex>
    </UForm>

    <DataEmpty :loading="loading" text="Vui lòng chọn máy chủ" class="min-h-[300px]" v-if="!!loading || !server"></DataEmpty>

    <div v-else>
      <Transition name="page" mode="out-in">
        <DataRankList type="power" :server="server" v-if="tab == 0" />
        <DataRankProcessAward type="power" :server="server" v-else-if="tab == 1" />
        <DataRankMissionAward type="power" :server="server" v-else-if="tab == 2" />
        <DataEmpty text="Mục chọn không khả dụng" class="min-h-[300px]" v-else></DataEmpty>
      </Transition>
    </div>
  </div>
</template>

<script setup>
const tab = ref(0) 
const tabItems = [
  { label: 'Danh Sách' },
  { label: 'Đua TOP' },
  { label: 'Nhiệm Vụ' },
]
const loading = ref(true)
const server = ref()
</script>