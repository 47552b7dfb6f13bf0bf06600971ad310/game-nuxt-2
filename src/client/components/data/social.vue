<template>
  <UiFlex class="box-blue rounded-xl overflow-hidden gap-2 py-2 px-0">
    <UiFlex class="inline-flex h-[90%] w-[20%] ml-2">
      <UiImg src="/images/icon/support.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs mb-2">Liên Hệ Hỗ Trợ</UiText>
      <UiFlex class="gap-1">
        <UiImg 
          class="max-w-[22px] max-h-[22px] cursor-pointer rounded-full"
          :src="`/images/social/facebook.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          img-size="200px"
          alt="facebook"
          @click="open(configStore.config.social.facebook)"
        ></UiImg>

        <UiImg 
          class="max-w-[22px] max-h-[22px] cursor-pointer rounded-full"
          :src="`/images/social/messenger.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          img-size="200px"
          alt="messenger"
          @click="open(configStore.config.social.messenger)"
        ></UiImg>

        <UiImg 
          class="max-w-[22px] max-h-[22px] cursor-pointer rounded-full"
          :src="`/images/social/zalo.png`"
          w="1" h="1"
          imgW="90" imgH="90"
          img-size="200px"
          alt="zalo"
          @click="open(configStore.config.social.zalo)"
        ></UiImg>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error('Kênh hỗ trợ chưa sẵn sàng, vui lòng quay lại sau')
  useTo().openNewTab(link)
}
</script>