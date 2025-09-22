<template>
  <UiFlex class="box-green rounded-xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/download.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Chơi Nhanh</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bx-world" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" v-if="!configStore.config.game.mobile" @click="playWeb()"/>
        <UiIcon name="i-bxl-android" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.apk, 'android')"/>
        <UiIcon name="i-bxl-apple" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.ios, 'ios')" />
      </UiFlex>
    </div>

    <UModal v-model="iosPWA" :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent title="IPhone và IPad" sub="Hướng dẫn cài đặt trò chơi toàn màn hình" class="bg-card rounded-xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="iosPWA = false"></UButton>
        </template>

        <UiFlex class="flex gap-1 mb-2" wrap>
          1. Nhấn nút 
          <UiIcon name="i-ion-share-outline" color="yellow" size="5" />
          <strong class="text-yellow-500">Chia sẻ</strong> 
        </UiFlex>

        <UiFlex class="flex gap-1" wrap>
          2. Chọn 
          <UiIcon name="i-icon-park-outline-add" color="yellow" size="5" />
          <strong class="text-yellow-500">Thêm vào Màn hình chính</strong> 
        </UiFlex>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()

const loading = ref(false)
const iosPWA = ref(false)
const isClickOpenButNotAuth = ref(false)

const download = async (url, type) => {
  if(type == 'ios' && !configStore.config.game.mobile) return iosPWA.value = true
  if(type == 'android' && !configStore.config.game.mobile && !!configStore.installPrompt && !url){
    await configStore.installPrompt.prompt()
    configStore.setInstallPrompt(null)
    return
  }

  if(!url) return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const playWeb = async () => {
  try {
    if(!authStore.isLogin) return isClickOpenButNotAuth.value = true, authStore.setModal(true)

    loading.value = true
    await useAPI('game/public/start')

    loading.value = false
    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://play.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    loading.value = false
  }
}

watch(() => authStore.isLogin, (val) => !!val && !!isClickOpenButNotAuth.value && playWeb())
</script>