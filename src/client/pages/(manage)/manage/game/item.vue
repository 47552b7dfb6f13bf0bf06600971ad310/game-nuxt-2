<template>
  <UiContent title="Item" sub="Quản lý vật phẩm">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true">Thêm mới</UButton>
      <UButton color="orange" icon="i-bx-plus" @click="modal.multiple = true">Thêm hàng loạt</UButton>

      <UDropdown :items="[
        [{ label: 'Excel', click: () => exportAction('excel')}],
        [{ label: 'Json', click: () => exportAction('json')}],
      ]">
        <UButton color="green" icon="i-healthicons-excel-logo" :loading="loading.export">Xuất</UButton>
      </UDropdown>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #type-data="{ row }">
          <UBadge color="gray" variant="soft">
            {{ typeFormat[row.type] }}
          </UBadge>
        </template>

        <template #item_image-data="{ row }">
          <DataItemImage :src="row.item_image" :type="row.type" />
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
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
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="Loại">
          <USelectMenu 
            v-model="stateAdd.type" 
            size="lg" 
            value-attribute="value"
            :options="[
              { label: 'Gói nạp', value: 'game_recharge' },
              { label: 'Vật phẩm', value: 'game_item' },
            ]"
          >
            <template #label>
              <span v-if="!stateAdd.type">Chọn loại</span>
              <span v-else>{{ typeFormat[stateAdd.type] }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="ID">
          <UInput v-model="stateAdd.item_id" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateAdd.item_name" />
        </UFormGroup>

        <UFormGroup label="Hình ảnh">
          <UInput v-model="stateAdd.item_image" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="ID">
          <UInput v-model="stateEdit.item_id" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateEdit.item_name" />
        </UFormGroup>

        <UFormGroup label="Hình ảnh">
          <UInput v-model="stateEdit.item_image" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Multiple -->
    <UModal v-model="modal.multiple" preventClose>
      <UForm :state="stateMultiple" @submit="multipleAction" class="bg-card rounded-xl p-4">
        <UFormGroup label="File Vật Phẩm">
          <UiUploadJson v-model="stateMultiple.items">
            <template #default="{ select, loading : loadingFile }">
              <UInput icon="i-bx-box" placeholder="Bấm vào đây để tải file JSON" :model-value="stateMultiple.items" :loading="loadingFile" :disabled="loading.multiple" readonly @click="select"/>
            </template>
          </UiUploadJson>
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.multiple">Thêm</UButton>
          <UButton color="gray" @click="modal.multiple = false" :disabled="loading.multiple">Đóng</UButton>
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
    key: 'item_id',
    label: 'ID',
    sortable: true
  },{
    key: 'type',
    label: 'Loại',
    sortable: true
  },{
    key: 'item_image',
    label: 'Hình ảnh',
  },{
    key: 'item_name',
    label: 'Tên',
    sortable: true
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
  item_id: null,
  item_name: null,
  item_image: null,
  type: null
})
const stateEdit = ref({
  _id: null,
  item_id: null,
  item_name: null,
  item_image: null,
})
const stateMultiple = ref({
  items: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  multiple: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  item_id: null,
  item_name: null,
  item_image: null,
  type: null
}))
watch(() => modal.value.multiple, (val) => !val && (stateMultiple.value = {
  items: null
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  multiple: false,
  export: false
})

// Type
const typeFormat = {
  'game_recharge': 'Gói nạp',
  'game_item': 'Vật phẩm',
}

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa vật phẩm',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('item/manage/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('item/manage/add/single', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const multipleAction = async () => {
  try {
    loading.value.multiple = true
    await useAPI('item/manage/add/multiple', JSON.parse(JSON.stringify(stateMultiple.value)))

    loading.value.multiple = false
    modal.value.multiple = false
    getList()
  }
  catch (e) {
    loading.value.multiple = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('item/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('item/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const exportAction = async (type) => {
  try {
    loading.value.export = true
    const url = await useAPI('item/manage/export', { type: type })

    window.open(url, '_blank')

    loading.value.export = false
  }
  catch (e) {
    loading.value.export = false
  }
}

getList()
</script>
