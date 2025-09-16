<template>
  <div>
    <DataEmpty text="Chức năng đang bảo trì, vui lòng quay lại sau" class="min-h-[300px]" :loading="loading.config" v-if="!!loading.config || !config || (!!config && !!config.maintenance)"></DataEmpty>

    <div  v-else>
      <DataPromoPayment class="mb-2" />

      <SelectGate auto v-model="state.gate" v-model:gate="gateSelect" class="mb-2" />

      <UCard>
        <UForm ref="form" :state="state" :validate="validate" @submit="submit">
          <DataEmpty class="min-h-[300px]" text="Các kênh nạp chưa sẵn sàng, vui lòng quay lại sau" v-if="!gateSelect"/>
          
          <div v-else>
            <UAlert title="Ưu Đãi" icon="i-bxs-gift" color="red" variant="soft" class="mb-2" v-if="(!!savePayBonus && savePayBonus.number > 0)">
              <template #description>
                <UiText>
                  Tặng 
                  <b>{{ savePayBonus.number }}%</b> 
                  giá trị nạp vào tích nạp ngày và tháng
                  <b v-if="savePayBonus.time">{{ savePayBonus.time }}</b>
                </UiText>
              </template>
            </UAlert>

            <UFormGroup label="Khuyến mãi" v-if="!!promo && promo.number > 0">
              <UInput :model-value="`+${promo.number}% ${promo.time}`" readonly />
            </UFormGroup>

            <!-- QR -->
            <div v-if="gateSelect.type != 1">
              <UFormGroup label="Số tiền nạp" name="money">
                <UInput v-model="state.money" type="number" placeholder="Nhập số tiền nạp (>= 20.000)"/>
              </UFormGroup>

              <UFormGroup label="Số xu nhận" v-if="!!totalCoin">
                <UInput :model-value="`${useMoney().toMoney(totalCoin)} Xu`" readonly />
              </UFormGroup>
            </div>

            <!-- Card -->
            <div v-if="gateSelect.type == 1">
              <UFormGroup label="Chọn nhà mạng" name="card_net">
                <USelectMenu v-model="state.card.net" :options="card.net" value-attribute="value" size="lg" />
              </UFormGroup>

              <UFormGroup label="Chọn mệnh giá" name="card_money">
                <USelectMenu v-model="state.money" :options="card.money" value-attribute="value" size="lg" />
              </UFormGroup>

              <UiFlex items="start" class="gap-1 flex-col @xl:flex-row">
                <UFormGroup label="Số Series" name="card_seri" class="grow w-full">
                  <UInput v-model="state.card.seri" placeholder="Nhập số Series" />
                </UFormGroup>

                <UFormGroup label="Mã thẻ (PIN)" name="card_pin" class="grow w-full">
                  <UInput v-model="state.card.pin" placeholder="Nhập mã thẻ PIN"/>
                </UFormGroup>
              </UiFlex>

              <UFormGroup label="Số xu nhận" name="money" v-if="!!totalCoin">
                <UInput :model-value="`${useMoney().toMoney(totalCoin)} Xu`" readonly />
              </UFormGroup>
            </div>

            <!-- Button -->
            <UButton block type="submit" :loading="loading.create" class="bg-main-red" size="lg" :disabled="!!payment">   
              {{ gateSelect.type != 1 ? 'Tạo Mã QR' : 'Kiểm Tra Thẻ' }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>

    <!-- Modal View -->
    <UModal v-model="modal.payment" preventClose :ui="{width: 'sm:max-w-[370px]'}">
      <UiContent title="Giao Dịch" sub="Thông tin chi tiết giao dịch nạp Xu" class="bg-card p-4 rounded-xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false, reset()"></UButton>
        </template>

        <DataPaymentView :fetch-id="payment" @history="modal.payment = false, modal.history = true, reset()" v-if="payment" />
      </UiContent>
    </UModal>

    <!-- Modal History -->
    <UModal v-model="modal.history" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Nạp" sub="Danh sách các giao dịch nạp Xu" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { dayjs, displayFull } = useDayJs()
const authStore = useAuthStore()
const configStore = useConfigStore()

const form = ref()
const loading = ref({
  config: true,
  create: false
})

const config = ref(null)
const limit = ref(undefined)
const payment = ref(undefined)

// Modal
const modal = ref({
  payment: false,
  history: false
})

watch(() => modal.value.payment, (val) => {
  if(!!val) return
  payment.value = undefined
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
})

// State
const state = ref({
  gate: null,
  card: {
    pin: null,
    seri: null,
    net: null
  },
  money: null
})

const reset = async (reloadConfig) => {
  payment.value = null
  form.value.clear()
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
}

watch(() => state.value.gate, () => reset())

// Save Pay Bonus
const savePayBonus = computed(() => {
  if(!config.value) return null

  let number = 0
  let time = ''
  const bonus = parseInt(config.value.pay?.number || 0)
  const expired = config.value.pay?.expired || null

  if(!expired) number = bonus, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = bonus, time = `đến ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

// Gate
const gateSelect = ref(undefined)

const gateBonus = computed(() => {
  if(!gateSelect.value) return null
  if(!gateSelect.value['bonus']) return null

  const bonus = gateSelect.value['bonus']
  const defaultBonus = parseInt(bonus.default || 0)
  const limitBonus = parseInt(bonus.limit?.number || 0)
  const limitExpired = bonus.limit?.expired || null
  let number, time

  if(limitBonus < 1 || (limitBonus > 0 && !limitExpired)) {
    number = defaultBonus
    time = ''
  }
  else {
    const now = dayjs(Date.now()).unix()
    const expired = dayjs(limitExpired).unix()
    if(now <= expired) {
      number = limitBonus
      time = `đến ${displayFull(limitExpired)}`
    }
    else {
      number = defaultBonus
      time = ''
    }
  }

  return { number, time }
})

// Promo
const promo = computed(() => {
  if(!gateBonus.value) return null

  const numberFrist = !config.value.frist ? parseInt(configStore.config.promo.payment.first || 0) : 0
  const numberSecond = (!!config.value.frist && numberFrist == 0) ? (!config.value.second ? parseInt(configStore.config.promo.payment.second || 0) : 0) : 0
  if(numberFrist > 0) return { number: numberFrist, time: 'Nạp Đầu' }
  if(numberSecond > 0) return { number: numberSecond, time: 'Nạp Lần 2' }
  return gateBonus.value
})

// Total Coin
const totalCoin = computed(() => {
  if(!promo.value) return null
  if(!state.value.money) return null
  if(state.value.money < 20000) return null

  const coin = state.value.money
  const coinBonus = Math.floor((parseInt(state.value.money) * parseInt(promo.value.number)) / 100)
  return coin + coinBonus
})

// Card
const card = {
  net:  [
    { label: 'Viettel', value: 'VIETTEL' },
    { label: 'Mobifone', value: 'MOBIFONE' },
    { label: 'Vinaphone', value: 'VINAPHONE' },
  ],
  money: [
    // { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '30.000', value: 30000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '300.000', value: 300000 },
    { label: '500.000', value: 500000 },
    { label: '1.000.000', value: 1000000 },
  ]
}

// Validate
const validate = (st) => {
  const errors = []
  if (!st.gate) errors.push({ path: 'gate', message: 'Vui lòng chọn kênh nạp' })
  if (!!gateSelect.value) {
    if(gateSelect.value['type'] == 1){
      if (!st.money) errors.push({ path: 'card_money', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.net) errors.push({ path: 'card_net', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.seri) errors.push({ path: 'card_seri', message: 'Vui lòng nhập đầy đủ' })
      if (!st.card.pin) errors.push({ path: 'card_pin', message: 'Vui lòng nhập đầy đủ' })
    }
    if(gateSelect.value['type'] != 1){
      if (!st.money) errors.push({ path: 'money', message: 'Vui lòng nhập đầy đủ' })
    }
  }
  return errors
}

// Get Config
const getConfig = async () => {
  try {
    loading.value.config = true
    const configData = await useAPI('payment/public/config')

    config.value = configData
    loading.value.config = false
  }
  catch (e) {
    config.value = null
    loading.value.config = false
  }
}

// Submit
const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập để nạp xu')
    loading.value.create = true
    const pay = await useAPI('payment/public/create', JSON.parse(JSON.stringify(state.value)))

    payment.value = pay
    modal.value.payment = true
    loading.value.create = false
  }
  catch (e) {
    loading.value.create = false
  }
}

getConfig()
watch(() => authStore.isLogin, () => getConfig())
</script>