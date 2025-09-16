<template>
  <div>
    <ClientOnly>
      <swiper-container 
        :freeMode="true"
        :spaceBetween="5"
        slidesPerView="auto"
        class="rounded-xl overflow-hidden mb-2"
      >
        <swiper-slide class="!inline-block !w-auto">
          <UiButtonSelect class="px-4 py-2" @click="tab = 0" :active="tab == 0">
            <UiFlex class="gap-2">
              <UiIcon name="i-bxs-barcode" class="h-6 w-6" />
              <UiText weight="bold" class="text-white text-xs md:text-sm">Nhập Mã</UiText>
            </UiFlex>
          </UiButtonSelect>
        </swiper-slide>

        <swiper-slide class="!inline-block !w-auto">
          <UiButtonSelect class="px-4 py-2" @click="tab = 1" :active="tab == 1">
            <UiFlex class="gap-2">
              <UiIcon name="i-material-symbols-public" class="h-6 w-6" />
              <UiText weight="bold" class="text-white text-xs md:text-sm">Mã Công Khai</UiText>
            </UiFlex>
          </UiButtonSelect>
        </swiper-slide>
      </swiper-container >
    </ClientOnly>

    <Transition name="page" mode="out-in">
      <div class="bg-gray-1000 p-4 rounded-xl" v-if="tab == 0">
        <UForm :validate="validate" :state="state" @submit="submit" >
          <UFormGroup name="code" label="Điền mã nhận thưởng vào đây">
            <UInput v-model="state.code" class="grow" size="xl" placeholder="VIP888, VIP999..."/>
          </UFormGroup>

          <UButton type="submit" block :loading="loading" color="gray" class="bg-main-red" size="md">KIỂM TRA</UButton>
        </UForm>
      </div>

      <DataGiftcodePublic v-model:giftcodes="giftcodes" @fast="onFast" v-else />
    </Transition>

    <UModal v-model="modal.receive" prevent-close>
      <DataGiftcodeReceive :giftcode="giftcode" @done="doneReceive" @close="modal.receive = false" class="p-4" />
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const tab = ref(0)

const loading = ref(false)

const modal = ref({
  receive: false
})

const giftcodes = ref(undefined)
const giftcode = ref(undefined)

const state = ref({
  code: null
})

const doneReceive = () => {
  modal.value.receive = false
  state.value.code = null
}

const validate = (state) => {
  const errors = []
  if(!state.code) errors.push({ path: 'code', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const onFast = (code) => {
  if(!!loading.value) return useNotify().error('Đang xử lý, vui lòng đợi giây lát')
  state.value.code = code
  submit()
}

const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập để nhận mã')
    loading.value = true
    const post = JSON.parse(JSON.stringify(state.value))
    const data = await useAPI('giftcode/public/get', {
      code: post.code
    })

    giftcode.value = data
    loading.value = false
    modal.value.receive = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>