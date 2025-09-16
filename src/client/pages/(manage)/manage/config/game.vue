<template>
  <UiContent 
    title="Game Config" 
    sub="Chỉnh sửa cấu hình trò chơi" 
    class="max-w-3xl mx-auto"
  >
    <UCard>
      <UForm :state="state">
        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold" color="orange">Là Game Mobile ?</UiText>
          <UToggle v-model="state.game.mobile" color="orange" />
        </UiFlex>

        <UFormGroup label="Địa chỉ IP">
          <UInput v-model="state.game.ip" />
        </UFormGroup>

        <UFormGroup label="Secret">
          <UInput v-model="state.game.secret" />
        </UFormGroup>

        <UFormGroup label="API Reg Game">
          <UInput v-model="state.game.api.reg" placeholder="Chỉ dành cho các game không có API đăng nhập" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton color="yellow" @click="update('game')" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  game: {
    ip: '',
    mobile: false,
    secret: '',
    api: {
      reg: ''
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>