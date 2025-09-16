<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <USelectMenu 
        v-model="page.type" 
        value-attribute="value"
        option-attribute="label"
        :options="typeOptions"
        class="mr-auto"
      >
        <template #label>{{ page.type ? typeFormat[page.type] : 'Tất cả sự kiện' }}</template>
      </USelectMenu>

      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>

    <UCard class="bg-gray my-2" :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #[`event.need-data`]="{ row }">
          <UBadge variant="soft">{{ (row.event && row.event.need) ? useMoney().toMoney(row.event.need) : '...' }}</UBadge>
        </template>

        <template #[`event.type-data`]="{ row }">{{ (row.event && row.event.type) ? typeFormat[row.event.type] : '...' }}</template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'event.type',
    label: 'Loại',
  },{
    key: 'event.need',
    label: 'Điều kiện',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  type: undefined,
  total: 0,
  range: {
    start: null,
    end: null
  },
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

const typeFormat = {
  'login.month': 'Đăng nhập tháng',
  'login.total': 'Đăng nhập tổng',
  'pay.day.money': 'Tích nạp ngày',
  'pay.month.money': 'Tích nạp tháng',
  'pay.total.money': 'Tích nạp tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'spend.total.coin': 'Tiêu phí tổng',
  'referral.count': 'Giới thiệu bạn',
  'paymusty': 'Nạp đơn ngày',
  'paydays': 'Liên nạp'
}

const typeOptions = [
  { label: 'Tất cả sự kiện', value: undefined },
  { label: 'Đăng nhập tháng', value: 'login.month' },
  { label: 'Đăng nhập tổng', value: 'login.total' },
  { label: 'Tích nạp ngày', value: 'pay.day.money' },
  { label: 'Tích nạp tháng', value: 'pay.month.money' },
  { label: 'Tích nạp tổng', value: 'pay.total.money' },
  { label: 'Tiêu phí ngày', value: 'spend.day.coin' },
  { label: 'Tiêu phí tháng', value: 'spend.month.coin' },
  { label: 'Tiêu phí tổng', value: 'spend.total.coin' },
  { label: 'Giới thiệu bạn', value: 'referral.count' },
  { label: 'Nạp đơn ngày', value: 'paymusty' },
  { label: 'Liên nạp', value: 'paydays' },
]

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/public/history', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>