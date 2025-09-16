<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput size="sm" v-model="page.user" placeholder="Tìm kiếm theo tài khoản" />
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
        <template #user-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
        </template>

        <template #my-data="{ row }">
          <UiFlex wrap v-if="!!row.my && row.my.length > 0">
            <UiIcon :name="`i-bxs-dice-${i}`" class="min-h-10 min-w-10 rounded-full !text-white" v-for="i in row.my" :key="`my-${i}-${row._id}`"/>
          </UiFlex>
          <span v-else>...</span>
        </template>

        <template #dices-data="{ row }">
          <UiFlex>
            <UiIcon :name="`i-bxs-dice-${i}`" class="min-h-10 min-w-10 rounded-full !text-white" v-for="i in row.dices" :key="`dice-${i}-${row._id}`"/>
          </UiFlex>
        </template>

        <template #[`coin.play-data`]="{ row }">
          <UiText weight="semibold">{{ toMoney(row.coin.play) }}</UiText>
        </template>

        <template #[`coin.receive-data`]="{ row }">
          <UiText weight="semibold" color="rose" v-if="row.coin.receive < 0">
            - {{ toMoney(row.coin.receive*-1) }}
          </UiText>
          <UiText weight="semibold" color="green" v-else>
            + {{ toMoney(row.coin.receive) }}
          </UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
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
  </div>
</template>

<script setup>
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'my',
    label: 'Đặt',
  },{
    key: 'dices',
    label: 'Kết quả',
  },{
    key: 'coin.play',
    label: 'Cước',
    sortable: true
  },{
    key: 'coin.receive',
    label: 'Lãi / Lỗ',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
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
  range: {
    start: null,
    end: null
  },
  user: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
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

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('minigame/dice/manage/history', JSON.parse(JSON.stringify(page.value)))

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
