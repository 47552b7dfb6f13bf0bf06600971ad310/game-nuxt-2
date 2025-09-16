<template>
  <div>
    <!-- Match -->
    <UiFlex justify="between" class="mb-2 gap-1">
      <UForm :state="page" @submit="getList" class="grow sm:grow-0">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="md" />
      </UForm>

      <UDropdown :items="menuList">
        <UButton icon="i-mynaui-filter" color="gray" size="md">Bộ Lọc</UButton>
      </UDropdown>
    </UiFlex>

    <div :class="{ 'HideScroll max-h-[60vh] overflow-y-auto p-0.5' : !!scroll }">
      <!-- Loading-->
      <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" text="Không có vật phẩm nào đang bày bán" class="min-h-[300px]"></DataEmpty>
      
      <!-- Main-->
      <div class="@container grid grid-cols-12 gap-2" v-else>
        <DataShopPack
          class="@4xl:col-span-3 @xl:col-span-4 col-span-6" 
          v-for="pack in list" :key="pack._id"
          :pack="pack"
          :config="config"
          :max="2"
          @click="buyPack(pack)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-2" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!-- Buy -->
    <UModal v-model="modal.buy" prevent-close v-if="authStore.isLogin">
      <DataShopBuyPack :pack="packSelect" @close="modal.buy = false" class="p-4"/>
    </UModal>

    <!-- Limit -->
    <UModal v-model="modal.limit" v-if="authStore.isLogin">
      <DataShopLimit auth />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  scroll: Boolean
})
const authStore = useAuthStore()

const config = ref({
  maintenance: true,
  discount: {
    number: null,
    expired: null
  }
})
const list = ref([])

const loading = ref(true)
const modal = ref({
  limit: false,
  buy: false
})

const page = ref({
  size: 6,
  current: 1,
  sort: {
    direction: 'desc',
    column: 'price'
  },
  search: undefined,
  total: 0,
})
watch(() => page.value.sort, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const packSelect = ref(undefined)
watch(() => modal.value.buy, (val) => (!val && (packSelect.value = undefined)))

const menuList = computed(() => [
  [{
    label: 'Cập nhật mới', 
    icon: 'i-bx-sort', 
    click: () => page.value.sort = { direction: 'desc', column: 'updatedAt' }
  }],[{
    label: 'Giá giảm dần', 
    icon: 'i-bx-sort-down', 
    click: () => page.value.sort = { direction: 'desc', column: 'price' }
  },{ 
    label: 'Giá tăng dần', 
    icon: 'i-bx-sort-up', 
    click: () => page.value.sort = { direction: 'asc', column: 'price' }
  }], [{ 
    label: 'Giới hạn mua', 
    icon: 'i-bx-sushi', 
    disabled: !authStore.isLogin,
    click: () => modal.value.limit = true
  }]
])

const buyPack = (pack) => {
  const toast = useToast()
  if(!authStore.isLogin) return toast.add({
    title: 'Xác thực',
    description: 'Vui lòng đăng nhập trước',
    icon: 'i-bx-shield-quarter',
    color: 'red'
  })

  packSelect.value = pack
  modal.value.buy = true
}

const getList = async () => {
  try {
    loading.value = true

    const configData = await useAPI('shop/public/config')
    config.value = Object.assign(config.value, configData)

    const listData = await useAPI('shop/public/pack/list', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    page.value.total = listData.total
    list.value = listData.list
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getList()
</script>