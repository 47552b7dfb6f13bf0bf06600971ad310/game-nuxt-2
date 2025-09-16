<template>
  <UiContent title="Payment" sub="Quản lý giao dịch nạp tiền">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()" >
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['CODE', 'USER']" />
        </UiFlex>
      </UForm>

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
        <template #code-data="{ row }">
          <UiText weight="semibold" color="primary" pointer @click="viewPayment(row._id)">{{ row.code }}</UiText>
        </template>

        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #gate-data="{ row }">
          <UBadge variant="soft" color="gray">
            {{ row.gate ? row.gate.name : '...' }}
          </UBadge>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.money) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #[`verify.person-data`]="{ row }">
          <UBadge v-if="!!row.verify && !!row.verify?.person" variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.verify.person._id)">
            {{ row.verify.person.username }}
          </UBadge>

          <span v-else>...</span>
        </template>

        <template #[`verify.time-data`]="{ row }">
          {{ !!row.verify && row.verify?.time ? useDayJs().displayFull(row.verify.time) : '...' }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" />
    </UModal>

    <!-- Modal Payment View -->
    <UModal v-model="modal.payment">
      <UiContent title="Giao Dịch" sub="Thông tin chi tiết giao dịch nạp Xu" class="bg-card p-4 rounded-xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <DataPaymentView :fetch-id="statePayment" :no-history="true" />
      </UiContent>
    </UModal>

    <!-- Modal Success -->
    <UModal v-model="modal.success" preventClose>
      <UForm :state="stateSuccess" @submit="successAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateSuccess.code" readonly />
        </UFormGroup>

        <UFormGroup label="Số tiền thực nhận">
          <UInput v-model="stateSuccess.money" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.success" color="green">Duyệt</UButton>
          <UButton color="gray" @click="modal.success = false" :disabled="loading.success">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Refuse -->
    <UModal v-model="modal.refuse" preventClose>
      <UForm :state="stateRefuse" @submit="refuseAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateRefuse.code" readonly />
        </UFormGroup>

        <UFormGroup label="Lý do từ chối">
          <UTextarea v-model="stateRefuse.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.refuse" color="red">Từ chối</UButton>
          <UButton color="gray" @click="modal.refuse = false" :disabled="loading.refuse">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'user',
    label: 'Người tạo',
  },{
    key: 'gate',
    label: 'Kênh',
  },{
    key: 'money',
    label: 'Số tiền',
    sortable: true
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'verify.person',
    label: 'Người duyệt',
  },{
    key: 'verify.time',
    label: 'Ngày duyệt',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'actions',
    label: 'Chức năng',
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
  search: {
    key: null,
    by: 'CODE'
  },
  range: {
    start: null,
    end: null
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

// State
const stateSuccess = ref({
  _id: null,
  code: null,
  money: null,
  status: null
})
const stateRefuse = ref({
  _id: null,
  code: null,
  money: null,
  reason: null,
  status: null
})
const stateWaiting = ref({
  _id: null,
  redo: true
})
const stateUser = ref(undefined)
const statePayment = ref(undefined)

// Modal
const modal = ref({
  success: false,
  refuse: false,
  waiting: false,
  user: false,
  payment: false
})

// Loading
const loading = ref({
  load: true,
  success: false,
  refuse: false,
  waiting: false,
})

// Status
const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
}

// Actions
const actions = (row) => [
  [{
    label: 'Duyệt',
    icon: 'i-bx-check',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateSuccess.value).forEach(key => stateSuccess.value[key] = row[key])
      stateSuccess.value.status = 1
      modal.value.success = true
    }
  }],[{
    label: 'Từ chối',
    icon: 'i-bx-x',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateRefuse.value).forEach(key => stateRefuse.value[key] = row[key])
      stateRefuse.value.status = 2
      modal.value.refuse = true
    }
  }],[{
    label: 'Chưa duyệt',
    icon: 'i-bx-redo',
    disabled: row.status == 0 || authStore.profile.type < 2,
    click: () => {
      stateWaiting.value._id = row._id
      waitingAction()
    }
  }]
]

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

const viewPayment = (_id) => {
  statePayment.value = _id
  modal.value.payment = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('payment/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const successAction = async () => {
  try {
    loading.value.success = true
    await useAPI('payment/manage/verify', JSON.parse(JSON.stringify(stateSuccess.value)))

    loading.value.success = false
    modal.value.success = false
    getList()
  }
  catch (e) {
    loading.value.success = false
  }
}

const refuseAction = async () => {
  try {
    loading.value.refuse = true
    await useAPI('payment/manage/verify', JSON.parse(JSON.stringify(stateRefuse.value)))

    loading.value.refuse = false
    modal.value.refuse = false
    getList()
  }
  catch (e) {
    loading.value.refuse = false
  }
}

const waitingAction = async () => {
  try {
    loading.value.waiting = true
    await useAPI('payment/manage/verify', JSON.parse(JSON.stringify(stateWaiting.value)))

    loading.value.waiting = false
    modal.value.waiting = false
    getList()
  }
  catch (e) {
    loading.value.waiting = false
  }
}

getList()
</script>
