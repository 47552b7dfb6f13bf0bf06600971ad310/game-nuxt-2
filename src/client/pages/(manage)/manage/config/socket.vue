<template>
  <UiContent 
    title="Real-time Functions" 
    sub="Chức năng thời gian thực" 
    class="max-w-3xl mx-auto"
  >
    <UAlert title="Xóa kênh Chat" :ui="{ title: 'text-primary font-bold'}" class="bg-gray-1000 mb-4">
      <template #description>
        <UiText size="sm">Xóa toàn bộ tất cả các tin nhắn trên hệ thống</UiText>
        <UiFlex justify="end">
          <UButton color="yellow" :loading="loading.delAllChat" @click="delAllChat">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert title="Cập nhật" :ui="{ title: 'text-primary font-bold'}" class="bg-gray-1000 mb-4">
      <template #description>
        <UiText size="sm" class="mb-2">Ép tất cả máy khách tải lại trang</UiText>
        <UiFlex class="gap-1">
          <UInput v-model="noticeReload" class="grow" size="md" placeholder="Nội dung thông báo" />
          <UButton color="yellow" :loading="loading.noticeReload" @click="sendNoticeReload">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert title="Thông báo" :ui="{ title: 'text-primary font-bold'}" class="bg-gray-1000">
      <template #description>
        <UiText size="sm" class="mb-4">Gửi thông báo đến tất cả người trực tuyến</UiText>

        <UiEditor v-model="noticeSystem" class="bg-gray mb-2" />

        <UiFlex justify="end">
          <UButton color="yellow" :loading="loading.noticeSystem" @click="sendNoticeSystem">Gửi Ngay</UButton>
        </UiFlex>
      </template>
    </UAlert>
  </UiContent>
</template>

<script setup>
const loading = ref({
  delAllChat: false,
  noticeReload: false,
  noticeSystem: false
})

const noticeReload = ref('Có bản cập nhật mới, vui lòng tải lại trang !')
const noticeSystem = ref(null)

const delAllChat = async () => {
  try {
    loading.value.delAllChat = true
    await useAPI('socket/manage/chat/del-all')

    loading.value.delAllChat = false
  }
  catch (e) {
    loading.value.delAllChat = false
  }
}

const sendNoticeReload = async () => {
  try {
    loading.value.noticeReload = true
    await useAPI('socket/manage/action/notice-reload', {
      notice: noticeReload.value
    })

    loading.value.noticeReload = false
  }
  catch (e) {
    loading.value.noticeReload = false
  }
}

const sendNoticeSystem = async () => {
  try {
    loading.value.noticeSystem = true
    await useAPI('socket/manage/action/notice-system', {
      notice: noticeSystem.value
    })

    loading.value.noticeSystem = false
  }
  catch (e) {
    loading.value.noticeSystem = false
  }
}
</script>