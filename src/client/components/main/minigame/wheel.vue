<template>
  <div>
    <div>
      <UiFlex justify="between" class="gap-2 mb-8" v-if="!!authStore.isLogin">
        <UiText weight="semibold" class="text-title">Lượt Quay Của Bạn</UiText>
        <DataUserWheel v-if="!!authStore.isLogin" />
      </UiFlex>
      
      <DataMinigameWheelBox 
        :items="items" 
        :gift-id="gift" 
        :spin="spin" 
        @done="doneSpin" 
        class="mb-6"
      />

      <UForm :state="state" :validate="validate" @submit="spinWheel" >
        <UFormGroup label="Máy chủ" name="server" class="grow" v-if="!!authStore.isLogin">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>
        
        <UFormGroup label="Nhân vật" name="role" class="grow" v-if="!!state.server && !!authStore.isLogin">
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>
        
        <UiFlex class="gap-1">
          <USelectMenu size="lg" class="mr-auto min-w-[120px]" v-model="state.times" :options="[1, 5, 10]">
            <template #label>Quay x{{ state.times }}</template>
            <template #option="{ option }">Quay x{{ option }}</template>
          </USelectMenu>

          <UButton type="submit" color="gray" size="lg" class="bg-main-red" :loading="loading">Quay Ngay</UButton>
        </UiFlex>
      </UForm>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !!val && getWheel())

const props = defineProps({
  history: { type: Boolean, default: true }
})

const state = ref({
  server: null,
  role: null,
  times: 1
})

const loading = ref(false)
const reload = ref(0)
const spin = ref(0)
const items = ref([])
const gift = ref(null)

const validate = (state) => {
  const errors = []
  if (!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước để chơi')
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const doneSpin = async () => {
  loading.value = false
  reload.value++
  getWheel()
}

const spinWheel = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước để chơi')

    loading.value = true
    const data = await useAPI('minigame/wheel/public/spin', JSON.parse(JSON.stringify(state.value)))

    gift.value = data
    spin.value++
  }
  catch {
    loading.value = false
  }
}

const getWheel = async () => {
  const data = await useAPI('minigame/wheel/public/get')
  items.value = data
}

getWheel()
</script>