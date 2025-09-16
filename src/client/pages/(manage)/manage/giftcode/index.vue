<template>
  <UiContent title="Giftcode" sub="Quản lý mã quà tặng">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true" >Thêm mới</UButton>
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
          <UBadge variant="soft" color="primary">{{ row.code }}</UBadge>
        </template>

        <template #limit-data="{ row }">
          <UiText weight="semibold">{{ row.limit == 0  ? 'Không' : `${row.limit} lần` }}</UiText>
        </template>

        <template #servers-data="{ row }">
          <UiText weight="semibold" v-if="!row.servers || row.servers.length == 0">Tất cả</UiText>
          <UiFlex v-else wrap class="gap-0.5">
            <UBadge variant="soft" color="gray" v-for="i in row.servers" :key="i">{{ i }}</UBadge>
          </UiFlex>
        </template>

        <template #users-data="{ row }">
          <UiText weight="semibold" v-if="!row.users || row.users.length == 0">Tất cả</UiText>
          <UiFlex v-else wrap class="gap-0.5">
            <UBadge variant="soft" color="gray" v-for="i in row.users" :key="i">{{ i.username }}</UBadge>
          </UiFlex>
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift" class="max-w-[400px]" />
        </template>

        <template #expired-data="{ row }">
          {{ row.expired ? useDayJs().displayFull(row.expired) : '...' }}
        </template>

        <template #public-data="{ row }">
          <UBadge :color="!!row.public ? 'green' : 'gray'" variant="soft">{{ !!row.public ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #justone-data="{ row }">
          <UBadge :color="!!row.justone ? 'green' : 'gray'" variant="soft">{{ !!row.justone ? 'Có' : 'Không' }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Tên mã">
          <UInput v-model="stateAdd.code" />
        </UFormGroup>

        <UFormGroup label="Giới hạn">
          <UInput v-model="stateAdd.limit" type="number" />
        </UFormGroup>

        <UFormGroup label="Máy chủ">
          <SelectGameServers v-model="stateAdd.servers" />
        </UFormGroup>

        <UFormGroup label="Tài khoản">
          <SelectUserList class="bg-gray" v-model="stateAdd.users" />
        </UFormGroup>

        <UFormGroup label="Hết hạn">
          <SelectDate v-model="stateAdd.expired" time placeholder="..." />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <UiFlex class="mr-auto gap-1" type="col" items="start">
            <UiFlex class="gap-2">
              <UToggle v-model="stateAdd.public" color="green" />
              <UiText size="xs" weight="bold">Công Khai</UiText>
            </UiFlex>

            <UiFlex class="gap-2">
              <UToggle v-model="stateAdd.justone" color="rose" />
              <UiText size="xs" weight="bold">Dùng Một Lần</UiText>
            </UiFlex>
          </UiFlex>

          <UButton color="yellow" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Tên mã">
          <UInput v-model="stateEdit.code" />
        </UFormGroup>

        <UFormGroup label="Giới hạn">
          <UInput v-model="stateEdit.limit" type="number" />
        </UFormGroup>

        <UFormGroup label="Máy chủ">
          <SelectGameServers v-model="stateEdit.servers" />
        </UFormGroup>

        <UFormGroup label="Tài khoản">
          <SelectUserList class="bg-gray" v-model="stateEdit.users" />
        </UFormGroup>

        <UFormGroup label="Hết hạn">
          <SelectDate v-model="stateEdit.expired" time placeholder="..." />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <UiFlex class="mr-auto gap-1" type="col" items="start">
            <UiFlex class="gap-2">
              <UToggle v-model="stateEdit.public" color="green" />
              <UiText size="xs" weight="bold">Công Khai</UiText>
            </UiFlex>

            <UiFlex class="gap-2">
              <UToggle v-model="stateEdit.justone" color="rose" />
              <UiText size="xs" weight="bold">Dùng Một Lần</UiText>
            </UiFlex>
          </UiFlex>

          <UButton color="yellow" type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Gift-->
    <UModal v-model="modal.gift" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm :state="stateGift" @submit="giftAction" class="bg-card rounded-xl p-4">
        <SelectItemList class="bg-gray" v-model="stateGift.gift" :types="['coin', 'wheel', 'game_item']" />

        <UiFlex justify="end" class="mt-2 gap-1">
          <UButton color="yellow" type="submit" :loading="loading.gift">Lưu</UButton>
          <UButton color="gray" @click="modal.gift = false" :disabled="loading.gift">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
    sortable: true
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'limit',
    label: 'Giới hạn',
    sortable: true
  },{
    key: 'servers',
    label: 'Máy chủ'
  },{
    key: 'users',
    label: 'Tài khoản'
  },{
    key: 'expired',
    label: 'Hết hạn',
    sortable: true
  },{
    key: 'public',
    label: 'Công khai',
    sortable: true
  },{
    key: 'justone',
    label: 'Dùng 1 lần',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
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
  search: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  code: null,
  limit: 0,
  servers: [],
  users: [],
  expired: null,
  public: false,
  justone: false,
  display: 1
})
const stateEdit = ref({
  _id: null,
  code: null,
  limit: null,
  servers: null,
  users: null,
  expired: null,
  public: false,
  justone: false,
  display: null
})
const stateGift = ref({
  _id: null,
  gift: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  gift: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  code: null,
  limit: 0,
  servers: [],
  users: [],
  expired: null,
  public: false,
  display: 1
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  gift: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  },{
    label: 'Sửa phần thưởng',
    icon: 'i-bx-gift',
    click: () => {
      stateGift.value._id = row._id
      stateGift.value.gift = JSON.parse((JSON.stringify(row.gift)))
      modal.value.gift = true
    }
  }],[{
    label: 'Xóa mã',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('giftcode/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true

    const clone = JSON.parse(JSON.stringify(stateAdd.value))
    clone.users = clone.users.map(i => i._id)
    
    await useAPI('giftcode/manage/add', clone)

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true

    const clone = JSON.parse(JSON.stringify(stateEdit.value))
    clone.users = clone.users.map(i => i._id)

    await useAPI('giftcode/manage/edit', clone)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const giftAction = async () => {
  try {
    loading.value.gift = true
    await useAPI('giftcode/manage/gift', JSON.parse(JSON.stringify(stateGift.value)))

    loading.value.gift = false
    modal.value.gift = false
    getList()
  }
  catch (e) {
    loading.value.gift = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('giftcode/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
