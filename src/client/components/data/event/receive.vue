<template>
  <UiContent :title="typeFormat[event.type]" sub="Trình nhận thưởng sự kiện" class="bg-card rounded-xl p-4" v-if="!!event">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emit('close')"></UButton>
    </template>

    <UForm :state="state" @submit="submit" >
      <UFormGroup label="Mốc thưởng" >
        <UInput :model-value="useMoney().toMoney(event.need)" readonly />
      </UFormGroup>

      <UFormGroup label="Máy chủ">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup label="Phần thưởng">
        <div class="bg-gray ring-1 ring-gray-800 rounded-xl p-4">
          <DataItemList :items="event.gift" empty="Chưa có phần thưởng" class="justify-center"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton color="yellow" @click="submit" :loading="loading" v-if="!!isActive">Nhận ngay</UButton>
        <UButton color="gray" :disabled="loading" @click="emit('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['event'])
const emit = defineEmits(['done', 'close'])

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

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  event: props.event ? props.event._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await authStore.setAuth()
    await useAPI('event/public/receive', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>