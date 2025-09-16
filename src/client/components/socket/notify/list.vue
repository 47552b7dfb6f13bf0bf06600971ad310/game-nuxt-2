<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <DataEmpty 
      text="Không có thông báo nào" 
      :loading="loading.start" 
      class="grow w-full" 
      v-if="!!loading.start || list.length == 0"
    />
    <div class="HideScroll grow w-full gap-4 overflow-y-auto px-2" ref="box">
      <UiFlex 
        v-for="(item, index) in listFormat" :key="index" 
        class="w-full gap-2 cursor-pointer my-4" 
        items="start"
      >
        <UAvatar icon="i-bxs-bell" size="md" color="gray" />

        <div class="grow w-full">
          <UiFlex class="mb-1" justify="between">
            <UiText color="gray" weight="bold" size="xs" class="line-clamp-1" :style="{ wordBreak: 'break-word' }">
              Thông Báo
            </UiText>

            <UiText color="gray" class="leading-none whitespace-nowrap text-[0.7rem]">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
          </UiFlex>

          <UiText 
            size="sm" 
            :style="{ wordBreak: 'break-word' }" 
            class="bg-gray py-2 px-4 rounded-r-2xl rounded-bl-2xl"
            v-html="item.action" 
          />
        </div>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'

const { $socket } = useNuxtApp()
const socketStore = useSocketStore()

const box = ref()

const loading = ref({
  start: false,
  list: false
})
const list = ref([])
const page = ref({
  size: 20,
  skip: 0,
  total: 0
})

const listFormat = computed(() => {
  return list.value.sort((a,b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  })
})

const getLazy = async () => {
  try {
    loading.value.list = true

    const data = await useAPI('socket/public/notify/list', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data.list)
    page.value.total = data.total
    page.value.skip = list.value.length

    loading.value.list = false
    
    $socket.emit('notify-single-new')
  }
  catch(e){
    loading.value.list = false
  }
}

const getStart = async () => {
  try {
    loading.value.start = true
    const data = await useAPI('socket/public/notify/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    page.value.skip = list.value.length

    loading.value.start = false

    $socket.emit('notify-single-new')
  }
  catch(e){
    loading.value.start = false
  }
}

const { reset } = useInfiniteScroll(box, getLazy, { distance: 10, canLoadMore: () => {
  if(!!loading.value.start) return false
  if(!!loading.value.list) return false
  if(list.value.length >= page.value.total) return false
  return true
}})

watch(() => socketStore.notify.single.push.update, () => {
  if(!!loading.start) return

  const data = socketStore.notify.single.push.data

  list.value.push(data)
  page.value.skip = list.value.length
})

onMounted(() => {
  setTimeout(getStart, 1)
})
</script>

