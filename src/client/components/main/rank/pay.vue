<template>
  <div class="relative">
    <UForm @submit="submit">
      <UiFlex class="mb-2 flex-col md:flex-row justify-start md:justify-between gap-2">
        <UiText weight="semibold" class="text-title w-full md:w-auto">Bảng Xếp Hạng</UiText>

        <UiFlex class="gap-1 w-full md:w-auto">
          <SelectDate v-model="page.start" placeholder="Từ ngày" size="lg" class="grow" />
          <SelectDate v-model="page.end" placeholder="Đến ngày" size="lg" class="grow" />
        </UiFlex>
      </UiFlex>
    </UForm>

    <div>
      <DataEmpty :loading="loading" text="Bảng xếp hạng không khả dụng" class="min-h-[300px]" v-if="!!loading || list.length == 0"></DataEmpty>

      <div v-else>
        <div class="mt-4 mb-8" v-if="list3.length > 0">
          <UiFlex justify="center" class="max-w-[400px] w-full mx-auto ">
            <UiFlex 
              v-if="list3[1]"
              justify="end" items="center"
              type="col"
              :style="`background: url(/images/rank/2.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
              class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
            >
              <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[1].user.username }}</UiText>
              <UiText mini align="center" class="max-w-[99%]" weight="semibold">
                {{ list3[1].value }}
              </UiText>
            </UiFlex>

            <UiFlex 
              v-if="list3[0]"
              justify="end" items="center"
              type="col"
              :style="`background: url(/images/rank/1.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
              class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[-10px]"
            >
              <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[0].user.username }}</UiText>
              <UiText mini align="center" class="max-w-[99%]" weight="semibold">
                {{ list3[0].value }}
              </UiText>
            </UiFlex>

            <UiFlex 
              v-if="list3[2]"
              justify="end" items="center"
              type="col"
              :style="`background: url(/images/rank/3.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
              class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
            >
              <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[2].user.username }}</UiText>
              <UiText mini align="center" class="max-w-[99%]" weight="semibold">
                {{ list3[2].value }}
              </UiText>
            </UiFlex>
          </UiFlex>
        </div>

        <UiFlex type="col" class="grow gap-4" v-if="list7.length > 0">
          <UiFlex v-for="(item, index) in list7" :key="index" class="w-full gap-2">
            <UBadge variant="soft" class="px-3">
              <UiText size="sm" class="italic">Hạng {{ item.rank }}</UiText>
            </UBadge>

            <div class="grow">
              <UiText mini size="md" weight="semibold" class="max-w-[70%]">{{ item.user.username }}</UiText>
            </div>

            <UBadge color="gray" variant="soft" class="ml-auto px-3" size="md">
              {{ item.value }}
            </UBadge>
          </UiFlex>
        </UiFlex>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)

const list = ref([])

const list3 = computed(() => {
  return list.value.filter((item, index) => index <= 2)
})

const list7 = computed(() => {
  return list.value.filter((item, index) => index > 2)
})

const page = ref({
  start: null,
  end: null
})
watch(() => page.value.start, (val) => {
  if(!!val && !!page.value.end) return submit()
  if(!val && !page.value.end) return submit()
})
watch(() => page.value.end, (val) => {
  if(!!val && !!page.value.start) return submit()
  if(!val && !page.value.start) return submit()
})

const submit = async () => {
  try {
    loading.value = true
    const data = await useAPI('rank/public/pay', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    loading.value = false
  } 
  catch (e) {
    list.value = []
    loading.value = false
  }
}
</script>