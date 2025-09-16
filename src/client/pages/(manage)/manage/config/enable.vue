<template>
  <UiContent 
    title="Enable Config" 
    sub="Kích hoạt các tính năng hệ thống" 
    class="max-w-3xl mx-auto"
  >
    <UCard>
      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">Đăng nhập</UiText>
        <UToggle v-model="state.enable.signin" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">Đăng ký</UiText>
        <UToggle v-model="state.enable.signup" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">Giới thiệu</UiText>
        <UToggle v-model="state.enable.referral" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">Chơi trò chơi</UiText>
        <UToggle v-model="state.enable.play" />
      </UiFlex>

      <div class="mb-4">
        <UiFlex justify="between" class="mb-2">
          <UiText weight="semibold" size="sm">Landing Home</UiText>
          <UToggle v-model="state.enable.landing" />
        </UiFlex>

        <SelectAdsLanding v-model="state.homepage.landing" class="mt-1.5" v-if="!!state.enable.landing" />
      </div>

      <div class="mb-2">
        <UiText weight="semibold" size="sm">Số tài khoản trên 1 IP</UiText>
        <UInput v-model="state.enable.signup_count" class="mt-1.5" />
      </div>

      <div justify="between" class="mb-2">
        <UiText weight="semibold" size="sm">Link kết thúc ThankYou</UiText>
        <UInput v-model="state.thankyou.link" class="mt-1.5" />
      </div>

      <UiFlex justify="end" class="mt-4">
        <UButton color="yellow" @click="update('enable')" :loading="updating">Cập nhật</UButton>
      </UiFlex>
    </UCard>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  enable: {
    signin: true,
    signup: true,
    play: true,
    referral: true,
    landing: false,
    signup_count: 0
  },

  homepage: {
    landing: null
  },

  thankyou: {
    link: ''
  },
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