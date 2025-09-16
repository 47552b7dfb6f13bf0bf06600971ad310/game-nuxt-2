<template>
  <UModal v-model="modal" prevent-close>
    <UiContent icon="i-bxs-bell" title="Thông Báo" sub="Tin nhắn từ quản trị viên" class="bg-card rounded-xl p-4">
      <UiEditorContent class="mb-4" :content="notice"></UiEditorContent>

      <UiFlex justify="end">
        <UButton color="gray" @click="modal = false">Đóng</UButton>
      </UiFlex>
    </UiContent>
  </UModal>
</template>

<script setup>
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)

onMounted(() => {
  $socket.on('notice-system', (data) => {
    notice.value = data
    modal.value = true
  })
})
</script>