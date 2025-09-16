<template>
  <div>
    <DataEmpty :loading="loading.load" text="Chưa có nhiệm vụ ở máy chủ này" class="min-h-[300px]" v-if="!!loading.load || list.length == 0"></DataEmpty>

    <div v-else>
      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" >
        <UTable :columns="columns" :rows="list" v-model:sort="sort">
          <template #need-data="{ row }">
            <UiText weight="semibold">{{ useMoney().miniMoney(row.need) }}</UiText>
          </template>

          <template #gift-data="{ row }">
            <DataItemListMini :items="row.gift" :max="2" class="md:hidden"/>
            <DataItemList :items="row.gift" class="max-md:hidden" />
          </template>

          <template #actions-data="{ row }">
            <UiFlex justify="center">
              <UButton color="green" size="xs" @click="openReceive(row)">Nhận Ngay</UButton>
            </UiFlex>
          </template>
        </UTable>
      </UCard>

      <UModal v-model="modal.receive" preventClose>
        <UiContent title="Nhận Thưởng" sub="Trình nhận thưởng nhiệm vụ" class="bg-card rounded-xl p-4" v-if="!!select">
          <template #more>
            <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.receive = false"></UButton>
          </template>

          <UForm :validate="validate" :state="select" @submit="submit">
            <UFormGroup :label="`${type == 'level' ? 'Đạt cấp độ' : 'Đạt lực chiến'}`">
              <UInput :model-value="useMoney().toMoney(select.need)" readonly />
            </UFormGroup>

            <UFormGroup label="Máy chủ" name="server">
              <SelectGameServer v-model="select.server" />
            </UFormGroup>

            <UFormGroup label="Nhân vật" v-if="!!select.server" name="role">
              <SelectGameRole v-model="select.role" :server="select.server" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng" name="gift">
              <div class="bg-gray ring-1 ring-gray-800 rounded-xl p-4">
                <DataItemList :items="select.gift" empty="Chưa có phần thưởng" class="justify-center"/>
              </div>
            </UFormGroup>

            <UiFlex justify="end" class="gap-1">
              <UButton color="yellow" type="submit" :loading="loading.receive">Nhận Ngay</UButton>
              <UButton color="gray" @click="modal.receive = false" :disabled="!!loading.receive">Đóng</UButton>
            </UiFlex>
          </UForm>
        </UiContent>
      </UModal>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['type', 'server'])

// List
const list = ref([])
const loading = ref({
  load: true,
  receive: false
})
const modal = ref({
  receive: false,
})

// Columns
const columns = computed(() => ([
  {
    key: 'need',
    label: props.type == 'level' ? 'Cấp độ' : 'Lực chiến'
  },{
    key: 'gift',
    label: 'Quà tặng',
  },{
    key: 'actions',
  }
]))

const select = ref({
  server: null,
  role: null,
  need: null
})

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  else if(state.server != props.server) errors.push({ path: 'server', message: 'Máy chủ này không hỗ trợ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if (!state.gift || state.gift.length == 0) errors.push({ path: 'gift', message: 'Chưa có quà tặng để nhận' })
  return errors
}

const openReceive = (row) => {
  select.value = Object.assign(select.value, row)
  modal.value.receive = true
} 

const getList = async () => {
  try {
    loading.value.load = true
    const type = props.type
    const server = props.server
    const data = await useAPI('rank/public/mission/list', { type, server })

    list.value = data
    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

const submit = async () => {
  try {
    loading.value.receive = true
    const post = JSON.parse(JSON.stringify(select.value))
    delete post['gift']
    delete post['createdAt']
    delete post['updatedAt']
    const data = await useAPI('rank/public/mission/receive', post)

    loading.value.receive = false
    modal.value.receive = false
  }
  catch (e) {
    loading.value.receive = false
  } 
}

watch(() => props.server, () => getList())
watch(() => props.type, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>