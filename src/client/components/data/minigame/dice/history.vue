<template>
  <UCard :ui="{ 
    body: { padding: 'p-0 sm:p-0' },
    header: { padding: 'p-2 sm:p-2' },
    footer: { padding: 'p-2 sm:p-2' },
  }">
    <template #header>
      <UiFlex class="gap-1">
        <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto" />

        <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" />
        <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
      </UiFlex>
    </template>

    <LoadingTable v-if="loading.load" />

    <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
      <template #dices-data="{ row }">
        <UiFlex>
          <UiIcon :name="`i-bxs-dice-${i}`" class="min-h-10 min-w-10 rounded-full !text-white" v-for="i in row.dices" :key="`dice-${i}-${row._id}`"/>
        </UiFlex>
      </template>

      <template #my-data="{ row }">
        <UiFlex wrap v-if="!!row.my && row.my.length > 0">
          <UiIcon :name="`i-bxs-dice-${i}`" class="min-h-10 min-w-10 rounded-full !text-white" v-for="i in row.my" :key="`my-${i}-${row._id}`"/>
        </UiFlex>
        <span v-else>...</span>
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

    <template #footer>
      <UiFlex justify="end">
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
      </UiFlex>
    </template>
  </UCard>
</template>

<script setup>
const { toMoney } = useMoney()

const props = defineProps(['reload', 'user'])

const route = useRoute()

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
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

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  range: {
    start: null,
    end: null
  },
  user: props.user || null,
})

watch(() => props.reload, () => getList())
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('minigame/dice/public/history', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>