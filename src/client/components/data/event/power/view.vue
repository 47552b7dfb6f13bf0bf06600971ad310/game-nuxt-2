<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>

    <UCard class="bg-gray my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
        </template>

        <template #power-data="{row}">
          <UiText color="green">+ {{ useMoney().toMoney(row.power) }}</UiText>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="end" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['fetchId'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'rank',
    label: 'Hạng'
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'power',
    label: 'Lực chiến tăng'
  }
]

// Page
const page = ref({
  size: 10,
  current: 1,
  search: null,
  total: 0,
  fetchID: props.fetchId,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// Loading
const loading = ref({
  load: false
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/public/power/view', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>