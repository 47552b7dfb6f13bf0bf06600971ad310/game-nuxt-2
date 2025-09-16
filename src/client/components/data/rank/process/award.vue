<template>
  <div>
    <DataEmpty :loading="loading" text="Chưa có sự kiện ở máy chủ này" class="min-h-[300px]" v-if="!!loading || !process"></DataEmpty>

    <div v-else>
      <UiText align="center" color="gray" size="sm" class="px-8">
        Kết thúc ngày <span class="text-rose-400 font-semibold">{{ useDayJs().displayFull(process.end) }} </span> 
      </UiText>
      <UiText align="center" color="orange" size="xs" class="italic px-8">
        Hệ thống tự động trả quà sau khi kết thúc thời gian sự kiện
      </UiText>

      <UCard class="mt-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }" >
        <UTable :columns="columns" :rows="process.award" v-model:sort="sort">
          <template #rank-data="{ row }">
            <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
          </template>

          <template #gift-data="{ row }">
            <DataItemListMini :items="row.gift" :max="3" class="md:hidden"/>
            <DataItemList :items="row.gift" class="max-md:hidden" />
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['type', 'server'])
const loading = ref(true)

// List
const process = ref(null)

// Columns
const columns = [
  {
    key: 'rank',
    label: 'Hạng'
  },{
    key: 'gift',
    label: 'Phần thưởng',
  }
]

const getProcess = async () => {
  try {
    loading.value = true
    const type = props.type
    const server = props.server
    const data = await useAPI('rank/public/process/get', { type, server })

    process.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

watch(() => props.server, () => getProcess())
watch(() => props.type, () => getProcess())
onMounted(() => setTimeout(getProcess, 1))
</script>