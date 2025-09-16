<template>
  <UiContent title="User" sub="Quản lý tài khoản người dùng">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PHONE', 'MAIL', 'IP']" />
        </UiFlex>
      </UForm>

      <UButton color="green" icon="i-healthicons-excel-logo" class="ml-auto" :loading="loading.exportExcel" @click="exportExcel">Xuất Excel</UButton>

      <UDropdown :items="actionsReset()">
        <UButton color="orange" icon="i-bx-reset" :loading="loading.reset">Đặt Lại</UButton>
      </UDropdown>

      <UButton color="rose" icon="i-mi-delete" :loading="loading.del" @click="modal.del = true">Xóa</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #username-data="{ row }">
          <UBadge variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row._id)">
            {{ row.username }}
          </UBadge>
        </template>

        <template #level-data="{ row }">
          <UBadge color="primary" variant="soft">{{ row.level ? `Cấp ${row.level.number || 0}` : `Cấp 0` }}</UBadge>
        </template>
        
        <template #[`pay.total.money-data`]="{ row }">
          {{ toMoney(row.pay.total.money || 0) }}
        </template>

        <template #[`spend.total.coin-data`]="{ row }">
          {{ toMoney(row.spend.total.coin || 0) }}
        </template>

        <template #[`currency.coin-data`]="{ row }">
          {{ toMoney(row.currency.coin || 0) }}
        </template>

        <template #[`diamond.coin-data`]="{ row }">
          {{ toMoney(row.currency.diamond || 0) }}
        </template>

        <template #[`login.total-data`]="{ row }">
          {{ `${row.login.total || 0} ngày` }}
        </template>

        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'" variant="soft">{{ row.block == 1 ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #type-data="{ row }">
          <UBadge :color="typeFormat[row.type].color" variant="soft">
            {{ typeFormat[row.type].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UiFlex class="gap-1">
            <UDropdown :items="actions(row)">
              <UButton color="gray" icon="i-bxs-pencil" />
            </UDropdown>

            <UDropdown :items="actionsReset(row._id)">
              <UButton color="gray" icon="i-bx-reset" />
            </UDropdown>
          </UiFlex>
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

    <!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Email">
          <UInput v-model="stateEditAuth.email" disabled />
        </UFormGroup>

        <UFormGroup label="Số điện thoại">
          <UInput v-model="stateEditAuth.phone" disabled />
        </UFormGroup>

        <UFormGroup label="Mật khẩu">
          <UInput v-model="stateEditAuth.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Khóa">
          <SelectAuthBlock v-model="stateEditAuth.block" />
        </UFormGroup>

        <UFormGroup label="Quyền">
          <SelectAuthType v-model="stateEditAuth.type" />
        </UFormGroup>

        <UiFlex justify="end"  class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editAuth">Sửa</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading.editAuth">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Currency-->
    <UModal v-model="modal.editCurrency" preventClose>
      <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Xu Web">
          <UInput v-model="stateEditCurrency.plus.coin" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.coin" type="number" v-if="stateEditCurrency.type == 'origin'" />
        </UFormGroup>

        <UFormGroup label="Lượt quay vòng may mắn">
          <UInput v-model="stateEditCurrency.plus.wheel" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.wheel" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup label="Cống Hiến">
          <UInput v-model="stateEditCurrency.plus.diamond" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.diamond" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditCurrency.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editCurrency">
            {{ stateEditCurrency.type == 'plus' ? 'Thêm' : 'Sửa' }}
          </UButton>
          <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading.editCurrency">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Pay-->
    <UModal v-model="modal.editPay" preventClose>
      <UForm :state="stateEditPay" @submit="editPayAction" class="bg-card rounded-xl p-4" v-if="stateEditPay.pay">
        <UFormGroup label="Ngày">
          <UInput v-model="stateEditPay.pay.day.money" type="number" />
        </UFormGroup>

        <UFormGroup label="Tháng">
          <UInput v-model="stateEditPay.pay.month.money" type="number" />
        </UFormGroup>

        <!-- <UFormGroup label="Tổng">
          <UInput v-model="stateEditPay.pay.total.money" type="number" />
        </UFormGroup> -->

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditPay.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editPay">Sửa</UButton>
          <UButton color="gray" @click="modal.editPay = false" :disabled="loading.editPay">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Spend-->
    <UModal v-model="modal.editSpend" preventClose>
      <UForm :state="stateEditSpend" @submit="editSpendAction" class="bg-card rounded-xl p-4" v-if="stateEditSpend.spend">
        <UFormGroup label="Ngày">
          <UInput v-model="stateEditSpend.spend.day.coin" type="number" />
        </UFormGroup>

        <UFormGroup label="Tháng">
          <UInput v-model="stateEditSpend.spend.month.coin" type="number" />
        </UFormGroup>

        <!-- <UFormGroup label="Tổng">
          <UInput v-model="stateEditSpend.spend.total.coin" type="number" />
        </UFormGroup> -->

        <UFormGroup label="Lý do">
          <UTextarea v-model="stateEditSpend.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editSpend">Sửa</UButton>
          <UButton color="gray" @click="modal.editSpend = false" :disabled="loading.editSpend">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Login-->
    <UModal v-model="modal.editLogin" preventClose>
      <UForm :state="stateEditLogin" @submit="editLoginAction" class="bg-card rounded-xl p-4" v-if="stateEditLogin.login">
        <UFormGroup label="Tháng">
          <UInput v-model="stateEditLogin.login.month" type="number" />
        </UFormGroup>

        <UFormGroup label="Tổng">
          <UInput v-model="stateEditLogin.login.total" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editLogin">Sửa</UButton>
          <UButton color="gray" @click="modal.editLogin = false" :disabled="loading.editLogin">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Send Item-->
    <UModal v-model="modal.sendItem" preventClose :ui="{width: 'sm:max-w-[800px]'}">
      <ManageGameSend class="bg-card rounded-xl p-4" :user="stateSendItem.user" @close="modal.sendItem = false" />
    </UModal>

    <!-- Modal Del-->
    <UModal v-model="modal.del" preventClose>
      <UiContent title="Xóa Tài Khoản" sub="Xóa các tài khoản không hoạt động" class="bg-card rounded-xl p-4">
        <UForm :state="stateDel" @submit="delAction" >
          <UFormGroup label="Số ngày chưa đăng nhập" help="Các tài khoản đã từng nạp tiền sẽ không bị xóa">
            <UInput v-model="stateDel.day" type="number" />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton color="rose" type="submit" :loading="loading.del">Xác Nhận</UButton>
            <UButton color="gray" @click="modal.del = false" :disabled="loading.del">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'username',
    label: 'Tên',
  },{
    key: 'level',
    label: 'Cấp độ'
  },{
    key: 'pay.total.money',
    label: 'Tổng nạp',
    sortable: true
  },{
    key: 'spend.total.coin',
    label: 'Tổng tiêu',
    sortable: true
  },{
    key: 'currency.coin',
    label: 'Xu',
    sortable: true
  },{
    key: 'currency.diamond',
    label: 'Cống hiến',
    sortable: true
  },{
    key: 'login.total',
    label: 'Đăng nhập',
    sortable: true
  },{
    key: 'referral.count',
    label: 'Mời',
    sortable: true
  },{
    key: 'block',
    label: 'Khóa',
    sortable: true
  },{
    key: 'type',
    label: 'Quyền',
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
    by: 'USER'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)

const stateEditAuth = ref({
  _id: null,
  email: null,
  phone: null,
  password: null,
  type: null,
  block: null
})

const stateEditCurrency = ref({
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    diamond: 0,
  },
  origin: {
    coin: null,
    wheel: null,
    diamond: null,
  },
  reason: null
})

const stateEditPay = ref({
  _id: null,
  pay: null,
  reason: null
})

const stateEditSpend = ref({
  _id: null,
  spend: null,
  reason: null
})

const stateEditLogin = ref({
  _id: null,
  login: null
})

const stateSendItem = ref({
  user: null
})

const stateDel = ref({
  day: 30
})


// Modal
const modal = ref({
  user: false,
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
  editLogin: false,
  sendItem: false,
  del: false
})

watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    diamond: 0,
  },
  origin: {
    coin: null,
    wheel: null,
    diamond: null,
  },
  reason: null
}))

watch(() => modal.value.editPay, (val) => !val && (stateEditPay.value.reason = null))
watch(() => modal.value.editSpend, (val) => !val && (stateEditSpend.value.reason = null))

// Loading
const loading = ref({
  load: true,
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editSpend: false,
  editLogin: false,
  exportExcel: false,
  del: false
})

// Type
const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
      modal.value.editAuth = true
    }
  }],[{
    label: 'Thêm tiền tệ',
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  },{
    label: 'Sửa tiền tệ',
    icon: 'i-bx-coin',
    click: () => {
      Object.keys(stateEditCurrency.value.origin).forEach(key => stateEditCurrency.value.origin[key] = row.currency[key])
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'origin'
      modal.value.editCurrency = true
    }
  }],[{
    label: 'Sửa tích nạp',
    icon: 'i-bx-wallet',
    click: () => {
      stateEditPay.value.pay = JSON.parse(JSON.stringify(row.pay))
      stateEditPay.value._id = row._id
      modal.value.editPay = true
    }
  },{
    label: 'Sửa tiêu phí',
    icon: 'i-bx-wallet-alt',
    click: () => {
      stateEditSpend.value.spend = JSON.parse(JSON.stringify(row.spend))
      stateEditSpend.value._id = row._id
      modal.value.editSpend = true
    }
  },{
    label: 'Sửa đăng nhập',
    icon: 'i-bx-calendar',
    click: () => {
      stateEditLogin.value.login = JSON.parse(JSON.stringify(row.login))
      stateEditLogin.value._id = row._id
      modal.value.editLogin = true
    }
  }],
  [{
    label: 'Gửi vật phẩm',
    icon: 'i-bx-mail-send',
    click: () => {
      stateSendItem.value.user = row._id
      modal.value.sendItem = true
    }
  }]
]

const actionsReset = (user) => [
  [{ label: 'Đặt lại tiền tệ', click: () => resetAction('currency', user)}],
  [
    { label: 'Đặt lại tích nạp ngày', click: () => resetAction('pay.day', user)},
    { label: 'Đặt lại tích nạp tháng', click: () => resetAction('pay.month', user)},
    // { label: 'Đặt lại tích nạp năm', click: () => resetAction('pay.total', user)},
  ],
  [
    { label: 'Đặt lại tiêu phí ngày', click: () => resetAction('spend.day', user)},
    { label: 'Đặt lại tiêu phí tháng', click: () => resetAction('spend.month', user)},
    // { label: 'Đặt lại tiêu phí năm', click: () => resetAction('spend.total', user)},
  ],
  [
    { label: 'Đặt lại đăng nhập tháng', click: () => resetAction('login.month', user)},
    { label: 'Đặt lại đăng nhập năm', click: () => resetAction('login.total', user)},
  ],
  [ { label: 'Đặt lại đập trứng', click: () => resetAction('egg', user)},
]]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editAuthAction = async () => {
  try {
    loading.value.editAuth = true
    await useAPI('user/manage/edit/auth', JSON.parse(JSON.stringify(stateEditAuth.value)))

    loading.value.editAuth = false
    modal.value.editAuth = false
    getList()
  }
  catch (e) {
    loading.value.editAuth = false
  }
}

const editCurrencyAction = async () => {
  try {
    loading.value.editCurrency = true
    await useAPI('user/manage/edit/currency', JSON.parse(JSON.stringify(stateEditCurrency.value)))

    loading.value.editCurrency = false
    modal.value.editCurrency = false
    getList()
  }
  catch (e) {
    loading.value.editCurrency = false
  }
}

const editPayAction = async () => {
  try {
    loading.value.editPay = true
    await useAPI('user/manage/edit/pay', JSON.parse(JSON.stringify(stateEditPay.value)))

    loading.value.editPay = false
    modal.value.editPay = false
    getList()
  }
  catch (e) {
    loading.value.editPay = false
  }
}

const editSpendAction = async () => {
  try {
    loading.value.editSpend = true
    await useAPI('user/manage/edit/spend', JSON.parse(JSON.stringify(stateEditSpend.value)))

    loading.value.editSpend = false
    modal.value.editSpend = false
    getList()
  }
  catch (e) {
    loading.value.editSpend = false
  }
}

const editLoginAction = async () => {
  try {
    loading.value.editLogin = true
    await useAPI('user/manage/edit/login', JSON.parse(JSON.stringify(stateEditLogin.value)))

    loading.value.editLogin = false
    modal.value.editLogin = false
    getList()
  }
  catch (e) {
    loading.value.editLogin = false
  }
}

const delAction = async () => {
  try {
    loading.value.del = true
    await useAPI('user/manage/del', JSON.parse(JSON.stringify(stateDel.value)))

    loading.value.del = false
    modal.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const exportExcel = async () => {
  try {
    loading.value.exportExcel = true
    const url = await useAPI('user/manage/excel')

    window.open(url, '_blank')

    loading.value.exportExcel = false
  }
  catch (e) {
    loading.value.exportExcel = false
  }
}

const resetAction = async (type, user) => {
  try {
    loading.value.reset = true
    await useAPI('user/manage/reset', { type, user })

    loading.value.reset = false
    getList()
  }
  catch (e) {
    loading.value.reset = false
  }
}

getList()
</script>
