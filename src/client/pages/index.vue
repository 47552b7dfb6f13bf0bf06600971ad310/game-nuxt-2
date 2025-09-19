<template>
  <div class="@container">
    <DataBanner class="mb-2" />
    <DataPromoHome class="mb-2" />

    <DataEmpty :loading="loading" text="Không có tin tức" v-if="!!loading || list.length == 0" class="min-h-[300px]"></DataEmpty>

    <div class="grid grid-cols-12 gap-4" v-else>
      <DataNewsBox 
        v-for="(item, index) in list" 
        :key="index" 
        class="@4xl:col-span-3 @xl:col-span-4 col-span-6"
        :news="item"
      ></DataNewsBox>
    </div>

    <UiFlex justify="end" class="mt-2" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})

const list = ref([])
const loading = ref(true)

const page = ref({
  size: 12,
  current: 1,
  total: 0,
  category: undefined,
  search: undefined
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list', JSON.parse(JSON.stringify(page.value)))

    page.value.total = data.total
    list.value = data.list
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getList()
</script>