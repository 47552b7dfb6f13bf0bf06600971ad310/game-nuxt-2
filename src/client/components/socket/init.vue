<template></template>

<script setup>
import { useOnline } from '@vueuse/core'
const online = useOnline()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const socketStore = useSocketStore()
const { $socket } = useNuxtApp()

watch(() => authStore.isLogin, (val) => {
  if(!!val) $socket.emit('online-join', authStore.profile._id )
  else {
    $socket.emit('online-logout')
    socketStore.changeNotifyData('single', { new: 0 })
  }
})

// Kết nối lại khi online
watch(() => online, (val) => !!val && $socket.emit('online-join', authStore.isLogin ? authStore.profile._id : null))

onMounted(() => {
  // Web Update
  $socket.on('config-update', () => configStore.bootConfig())

  // Auth Update
  $socket.on('auth-update', async () => !!authStore.isLogin && await authStore.setAuth())

  // Online
  $socket.emit('online-join', authStore.isLogin ? authStore.profile._id : null)
  $socket.on('online', (data) => socketStore.updateOnline(data))
  $socket.on('online-sign-in', () => {
    $socket.emit('notify-single-new') // Lấy thông tin số thông báo mới
  })

  // Chat Global
  $socket.on('chat-global-push', (data) => socketStore.changeChatData('global', { push: { update: socketStore.chat.global.push.update + 1, data: data } })) // Nhận tin nhắn thế giới mới
  $socket.on('chat-global-send-error', (data) => useNotify().error(data.message))

  // Notify
  $socket.on('notify-single-new', data => socketStore.changeNotifyData('single', { new: data })) // Nhận thông tin số thông báo mới
  $socket.on('notify-single-push', (data) => {
    socketStore.changeNotifyData('single', { push: { update: socketStore.notify.single.push.update + 1, data: data } }) // Nhận thông báo mới
    if(socketStore.tab != 'notify-single') return $socket.emit('notify-single-new') // Không trong tab thông báo, thì nhận số thông báo mới
  })
})
</script>