<template>
  <UiFlex class="gap-1">
    <UButton @click="tabItem = 0, modal = true" color="gray" class="px-4 bg-main-red border">Đăng Nhập</UButton>
    <UButton @click="tabItem = 1, modal = true" color="gray" class="px-4 bg-main-blue border">Đăng Ký</UButton>

    <UModal v-model="modal">
      <UCard class="bg-card">
        <UiFlex class="mb-6 gap-20">
          <UiFlex type="col" items="start">
            <UiText weight="bold" :color="tabItem == 0 ? 'red' : 'blue'" size="2xl" class="SVN">{{ configStore.config.name }}</UiText>
            <UiText color="gray" size="sm" v-if="tabItem == 0">Đăng nhập tài khoản của bạn</UiText>
            <UiText color="gray" size="sm" v-if="tabItem == 1">Đăng ký tài khoản mới</UiText>
          </UiFlex>

          <UButton icon="i-bx-x" class="ml-auto" size="xs" color="gray" variant="link" square @click="modal = false"></UButton>
        </UiFlex>

        <LazyAuthSignIn v-if="tabItem == 0" @up="tabItem = 1" @done="doneIn"></LazyAuthSignIn>
        <LazyAuthSignUp v-if="tabItem == 1" @in="tabItem = 0" @done="doneUp"></LazyAuthSignUp>   
      </UCard>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()

const modal = ref(false)
const tabItem = ref(0) 

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))

const doneIn = async () => {
  modal.value = false
  await nextTick()
  await authStore.setAuth()
}

const doneUp = async () => {
  modal.value = false
  await nextTick()
  await authStore.setAuth()
  useTo().navigateToSSL('/thankyou')
}
</script>