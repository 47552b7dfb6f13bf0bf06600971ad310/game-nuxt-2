<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" :disabled="!page.server" />
      <SelectGameServer auto v-model="page.server" size="sm" />

      <UButton color="yellow" class="ml-auto" @click="modal.add = true" :disabled="!page.server">Thêm mới</UButton>
    </UiFlex>

    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #need-data="{ row }">
          <UBadge color="gray" variant="soft">Cấp {{ useMoney().toMoney(row.need) }}</UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift"  />
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row, index }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="addAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Đạt cấp">
          <UInput v-model="stateAdd.need" />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <SelectItemList class="bg-gray" v-model="stateAdd.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="editAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Đạt cấp">
          <UInput v-model="stateEdit.need" />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <SelectItemList class="bg-gray" v-model="stateEdit.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'need',
    label: 'Yêu cầu',
    sortable: true
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
    column: 'need',
    direction: 'asc'
  },
  total: 0,
  server: null,
  type: 'level'
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.server, () => getList())

// State
const stateAdd = ref({
  server: null,
  type: 'level',
  need: null,
  gift: []
})

const stateEdit = ref({
  _id: null,
  need: null,
  gift: null
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  server: null,
  type: 'level',
  need: null,
  gift: []
}))

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.gift = JSON.parse(JSON.stringify(row.gift))
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa nhiệm vụ',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('rank/manage/mission/list', JSON.parse(JSON.stringify(page.value)))

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
    stateAdd.value.server = page.value.server
    stateAdd.value.type = 'level'
    await useAPI('rank/manage/mission/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('rank/manage/mission/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('rank/manage/mission/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>