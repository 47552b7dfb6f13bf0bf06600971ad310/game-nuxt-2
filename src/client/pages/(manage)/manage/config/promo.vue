<template>
  <UiContent 
    title="Promo Config" 
    sub="Cấu hình khuyến mãi" 
    class="max-w-3xl mx-auto"
  >
    <UCard class="mb-4">
      <UForm :state="stateConfig">
        <UFormGroup label="Tặng Xu khi đăng ký tài khoản">
          <UInput v-model="stateConfig.promo.register.coin" />
        </UFormGroup>

        <UFormGroup label="Thưởng nạp lần đầu">
          <UInput v-model="stateConfig.promo.payment.first" />
        </UFormGroup>

        <UFormGroup label="Thưởng nạp lần 2">
          <UInput v-model="stateConfig.promo.payment.second" />
        </UFormGroup>

        <UiText color="gray" size="sm" class="mb-2">
          Khuyến mãi <b class="text-rose-500"> nạp đầu</b> và <b class="text-rose-500">nạp lần 2</b> sẽ không cộng dồn với khuyến mãi của kênh nạp !
        </UiText>

        <UiFlex justify="end">
          <UButton color="yellow" @click="updateConfig('promo')" :loading="updating">Cập Nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UCard class="mb-4">
      <UForm :state="statePayment" @submit="updatePayment">
        <UFormGroup label="Khuyến mại tích nạp">
          <UInput v-model="statePayment.pay.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời hạn">
          <SelectDate v-model="statePayment.pay.expired" time />
        </UFormGroup>

        <UiFlex>
          <UToggle v-model="statePayment.maintenance" :disabled="!!updating" />
          <UiText size="sm" class="ml-2 mr-auto">Bảo trì</UiText>

          <UButton type="submit" color="yellow" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UCard>
      <UForm :state="stateShop" @submit="updateShop">
        <UFormGroup label="Giảm giá cửa hàng">
          <UInput v-model="stateShop.discount.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời hạn">
          <SelectDate v-model="stateShop.discount.expired" time />
        </UFormGroup>

        <UiFlex>
          <UToggle v-model="stateShop.maintenance" :disabled="!!updating" />
          <UiText size="sm" class="ml-2 mr-auto">Bảo trì</UiText>

          <UButton type="submit" color="yellow" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const load = ref(true)
const updating = ref(false)

const stateConfig = ref({
  change: null,

  promo: {
    register: {
      coin: 0
    },
    payment: {
      first: 0,
      second: 0
    }
  }
})

const statePayment = ref({
  maintenance: null,
  pay: {
    number: null,
    expired: null
  }
})

const stateShop = ref({
  maintenance: null,
  discount: {
    number: null,
    expired: null
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  const configPayment = await useAPI('payment/manage/config/get')
  const configShop = await useAPI('shop/manage/config/get')
  stateConfig.value = Object.assign(stateConfig.value, config)
  statePayment.value = Object.assign(statePayment.value, configPayment)
  stateShop.value = Object.assign(stateShop.value, configShop)
  load.value = false
}

const updateConfig = async (change) => {
  try {
    updating.value = true
    stateConfig.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(stateConfig.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

const updatePayment = async () => {
  try {
    updating.value = true
    await useAPI('payment/manage/config/update', JSON.parse(JSON.stringify(statePayment.value)))

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

const updateShop = async () => {
  try {
    updating.value = true
    await useAPI('shop/manage/config/update', JSON.parse(JSON.stringify(stateShop.value)))

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>