<template>
  <div>
    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" text="Chưa có mã quà tặng nào công khai" class="min-h-[300px]"></DataEmpty>

    <div class="@container grid grid-cols-12 gap-2" v-else>
      <UCard v-for="(row, index) in list" :key="index" class="bg-gray @4xl:col-span-3 @xl:col-span-4 col-span-6 ring-1">
        <UiFlex type="col">
          <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mb-4 max-w-[90%]">
            {{ row.code }}
          </UiText>

          <DataItemListMini :max="2" :items="row.gift" justify="center" />

          <UiText size="xs" weight="semibold" class="line-clamp-1 my-4" color="gray">{{ row.gift.length }} Vật Phẩm</UiText>

          <UButton color="gray" @click="fast(row.code)" class="px-4 md:px-6 max-w-full">
            Nhận Ngay
          </UButton>
        </UiFlex>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['giftcodes'])
const emits = defineEmits(['update:giftcodes', 'fast'])

const loading = ref(true)
const list = ref([])

const fast = (code) => {
  emits('fast', code)
}

const getPublic = async () => {
  try {
    loading.value = true
    const data = await useAPI('giftcode/public/overt')

    list.value = data
    loading.value = false
    emits('update:giftcodes', data)
  }
  catch (e){
    list.value = []
    loading.value = false
    emits('update:giftcodes', null)
  }
}

onMounted(() => setTimeout(getPublic, 1))
</script>