<template>
  <UiContent title="History Event" sub="Lịch sử nhận toàn hệ thống">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput size="sm" v-model="page.user" placeholder="Tìm kiếm theo tài khoản" />
      </UForm>

      <USelectMenu 
        v-model="page.type" 
        value-attribute="value"
        option-attribute="label"
        :options="typeOptions"
      >
        <template #label>{{ page.type ? typeFormat[page.type] : 'Tất cả sự kiện' }}</template>
      </USelectMenu>  

      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" class="ml-auto" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #user-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
        </template>

        <template #server-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #role-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.role ? `${row.role}` : '...' }}</UBadge>
        </template>

        <template #[`event.type-data`]="{ row }">{{ (row.event && row.event.type) ? typeFormat[row.event.type] : '...' }}</template>

        <template #[`event.need-data`]="{ row }">
          <UiText weight="semibold">{{ (row.event && row.event.need) ? useMoney().toMoney(row.event.need) : '...' }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #del-data="{ row }">
          <UButton color="gray" icon="i-bx-trash" :disabled="loading.del" @click="delAction(row._id)"/>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" />
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'event.type',
    label: 'Loại',
  },{
    key: 'event.need',
    label: 'Điều kiện',
  },{
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role',
    label: 'Nhân vật',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  },{
    key: 'del',
    label: 'Xóa',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  type: undefined,
  user: null,
  range: {
    start: null,
    end: null
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.user, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// Type
const typeFormat = {
  'login.month': 'Đăng nhập tháng',
  'login.total': 'Đăng nhập tổng',
  'pay.day.money': 'Tích nạp ngày',
  'pay.month.money': 'Tích nạp tháng',
  'pay.total.money': 'Tích nạp tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'spend.total.coin': 'Tiêu phí tổng',
  'referral.count': 'Giới thiệu bạn'
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
  { label: 'Giới thiệu bạn', value: 'referral.count' }
]

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/manage/history/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('event/manage/history/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
