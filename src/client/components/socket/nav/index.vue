<template>
  <UiFlex type="col" class="bg-gray-1000 rounded-xl overflow-y-hidden">
    <UiFlex class="w-full px-2 py-3 gap-1 border-b border-gray-800">
      <UChip 
        v-for="(item, index) in tabsChat" :key="index"
        :show="socketStore.chat[item.type].new > 0" :text="socketStore.chat[item.type].new >= 99 ? '99+' : socketStore.chat[item.type].new"
        color="rose"
      >
        <UButton color="gray" :icon="item.icon" class="grow justify-center"
          :class="{ 'color-blue-light bg-anim-light': socketStore.tab == item.key }"
          @click="select(item)"
        >
          <span>{{ item.title }}</span>
        </UButton>
      </UChip>

      <UChip 
        v-for="(item, index) in tabsNotify" :key="index"
        :show="socketStore.notify[item.type].new > 0" :text="socketStore.notify[item.type].new >= 99 ? '99+' : socketStore.notify[item.type].new"
        color="rose"
      >
        <UButton color="gray" :icon="item.icon" class="grow justify-center"
          :class="{ 'color-blue-light bg-anim-light': socketStore.tab == item.key }"
          @click="select(item)"
        >
          <span>{{ item.title }}</span>
        </UButton>
      </UChip>

      <UButton icon="i-bx-x" class="ml-auto" square color="gray" v-if="!!props.hasClose" @click="emit('close')" />
    </UiFlex>

    <Transition name="page" mode="out-in">
      <SocketChat class="w-full grow" v-if="socketStore.tab == 'chat-global'" />
      <LazySocketNotify class="w-full grow" v-else-if="socketStore.tab == 'notify-single'" />
      <DataEmpty v-else class="w-full grow" text="Vui lòng chọn 1 mục để xem" />
    </Transition>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  hasClose: Boolean
})
const emit = defineEmits(['close'])

const socketStore = useSocketStore()

const tabsChat = [
  { title: 'Thế Giới', icon: 'i-bx-world', key: 'chat-global', type: 'global'},
]

const tabsNotify = [
  { title: 'Thông Báo', icon: 'i-bxs-bell', key: 'notify-single', type: 'single' },
]

const select = (item) => {
  socketStore.changeTab(item.key)
}
</script>