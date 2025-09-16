<template>
  <UiFlex class="gap-1">
    <NuxtLink to="/payment">
      <DataUserCoin size="md" />
    </NuxtLink>

    <!-- <SocketNavSlide class="flex lg:hidden" /> -->
    
    <UPopover :ui="{wrapper: 'inline-flex'}" :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
      <UButton
        class="relative bg-main-red"
        icon="i-bx-user"
        color="gray" square size="md"
      ></UButton>

      <template #panel>
        <div class="bg-gray-1000 w-[220px] max-w-sreen p-2">
          <UiFlex
            v-for="(item, index) in menuUser" :key="index"
            class="MenuItem gap-2 text-gray-500 rounded-xl"
            @click="item.click()"
          >
            <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" />
            <UiText class="MenuItem__Text" size="sm" weight="semibold" color="gray">{{ item.label }}</UiText>
          </UiFlex>
        </div>
      </template>
    </UPopover>

    <UModal v-model="modal.view" :ui="{width: 'sm:max-w-[500px]'}">
      <DataUserBox :fetch-id="authStore.profile._id" :no-chat="true" />
    </UModal>
    
    <UModal v-model="modal.history.giftcode" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Giftcode" sub="Danh sách các lần nhận mã quà tặng" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.giftcode = false"></UButton>
        </template>

        <DataGiftcodeHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.payment" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Nạp Xu" sub="Danh sách các giao dịch nạp Xu" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.payment = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.event" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Sự Kiện" sub="Danh sách các lần nhận thưởng sự kiện" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.event = false"></UButton>
        </template>

        <DataEventHistory/>
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.shop" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Mua Hàng" sub="Danh sách các đơn hàng đã mua" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.shop = false"></UButton>
        </template>

        <DataShopHistory/>
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.minigame" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Mini Game" sub="Thông tin chơi Minigame của bạn" class="bg-card rounded-xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.minigame = false"></UButton>
        </template>

        <DataMinigameHistory/>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()

const open = ref(false)

const modal = ref({
  view: false,
  history: {
    payment: false,
    giftcode: false,
    event: false,
    shop: false,
    minigame: false
  }
})

const logout = async () => {
  await authStore.removeAuth()
}

const menuUser = computed(() => {
  const list = []

  if(!!authStore.profile.type > 0){
    list.push({
      label: 'Quản trị viên',
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/admin')
    })
  }

  return [
    ...list,
    {
      label: 'Thông tin',
      icon: 'i-bx-user',
      click: () => { open.value = false, modal.value.view = true }
    },{
      label: 'Lịch sử Nạp Xu',
      icon: 'i-bx-credit-card',
      click: () => { open.value = false, modal.value.history.payment = true }
    },{
      label: 'Lịch sử Mua Hàng',
      icon: 'i-bx-cart',
      click: () => { open.value = false, modal.value.history.shop = true }
    },{
      label: 'Lịch sử Giftcode',
      icon: 'i-bx-barcode',
      click: () => { open.value = false, modal.value.history.giftcode = true }
    },{
      label: 'Lịch sử Sự Kiện',
      icon: 'i-mdi-event-star',
      click: () => { open.value = false, modal.value.history.event = true }
    },{
      label: 'Lịch sử Minigame',
      icon: 'i-bx-game',
      click: () => { open.value = false, modal.value.history.minigame = true }
    },{
      label: 'Đăng xuất',
      icon: 'i-bx-log-out',
      click: () => logout()
    }
  ]
})
</script>