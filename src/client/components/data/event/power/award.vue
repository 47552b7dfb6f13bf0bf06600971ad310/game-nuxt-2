<template>
  <div>
    <UiText align="center" color="gray" size="sm px-8">
      Từ ngày <span class="text-green-400 font-semibold">{{ useDayJs().displayFull(event.start) }} </span> 
      đến ngày <span class="text-rose-400 font-semibold">{{ useDayJs().displayFull(event.end) }} </span> 
    </UiText>

    <UiText align="center" color="orange" size="xs" class="italic px-8 mb-2">
      Hệ thống tự động trả quà sau khi kết thúc thời gian sự kiện
    </UiText>

    <UCard class="bg-gray" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list" v-model:sort="sort">
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
</template>

<script setup>
const props = defineProps(['event'])

// List
const list = ref(props.event.award)

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
</script>