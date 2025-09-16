<template>
  <div v-if="!!config">
    <UiText  color="gray" size="sm" v-if="!!config.start && !!config.end">
      Từ ngày <span class="text-green-400 font-semibold italic">{{ useDayJs().displayFull(config.start) }} </span> 
      đến ngày <span class="text-rose-400 font-semibold italic">{{ useDayJs().displayFull(config.end) }} </span> 
    </UiText>
    <UiText  color="gray" size="sm" v-else-if="!!config.start && !config.end">
      Bắt đầu ngày <span class="text-green-400 font-semibold italic">{{ useDayJs().displayFull(config.start) }} </span> 
    </UiText>
    <UiText  color="gray" size="sm" v-else-if="!config.start && !!config.end">
      Kết thúc ngày <span class="text-rose-400 font-semibold italic">{{ useDayJs().displayFull(config.end) }} </span> 
    </UiText>
    <UiText  color="gray" size="sm" v-else-if="!config.start && !config.end">
      Sự kiện này <span class="text-green-400 font-semibold italic">không giới hạn</span> thời gian
    </UiText>
  </div>
</template>

<script setup>
const props = defineProps(['config'])
</script>