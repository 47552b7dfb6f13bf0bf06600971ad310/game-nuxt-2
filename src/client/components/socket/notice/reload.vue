<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'max-w-[300px]'}">
    <UiFlex type="col" justify="center" class="bg-card rounded-xl p-6">
      <UiIcon name="i-bxs-cloud-download" size="20" color="primary" />
      <UiText weight="bold" align="center" size="3xl" class="mb-2">Update Now</UiText>
      <UiText color="gray" align="center" class="mb-4">{{ notice }}</UiText>
      <UButton color="gray" @click="reload">Tải lại sau {{ num }} giây</UButton>
    </UiFlex>
  </UModal>
</template>

<script setup>
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)
const num = ref(5)
const anim = ref(null)

const reload = () => {
  if(anim.value) clearInterval(anim.value), anim.value = null
  useTo().navigateToSSL('/')
  location.reload()
}

onMounted(() => {
  $socket.on('notice-reload', (data) => {
    notice.value = data
    modal.value = true

    num.value = 5
    anim.value = setInterval(() => {
      num.value = num.value - 1
      if(num.value == 0) reload()
    }, 1000)
  })
})
</script>