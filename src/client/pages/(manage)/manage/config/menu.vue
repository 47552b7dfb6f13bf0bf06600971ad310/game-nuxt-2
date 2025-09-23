<template>
  <UiContent 
    title="Menu Config" 
    sub="Chỉnh sửa danh mục trang" 
    class="max-w-3xl mx-auto"
  >
    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">Chức năng</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Nạp xu</UiText>
        <UToggle v-model="state.menu.action.payment" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">Giftcode</UiText>
        <UToggle v-model="state.menu.action.giftcode" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">Cửa hàng</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Nạp game</UiText>
        <UToggle v-model="state.menu.shop.recharge" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Vật phẩm</UiText>
        <UToggle v-model="state.menu.shop.item" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Gói vật phẩm</UiText>
        <UToggle v-model="state.menu.shop.pack" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">Sự kiện</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Tăng lực chiến</UiText>
        <UToggle v-model="state.menu.event.powerup" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Mời bạn</UiText>
        <UToggle v-model="state.menu.event.referral" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Điểm danh</UiText>
        <UToggle v-model="state.menu.event.login" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Tích nạp</UiText>
        <UToggle v-model="state.menu.event.pay" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Tiêu phí</UiText>
        <UToggle v-model="state.menu.event.spend" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Nạp đơn</UiText>
        <UToggle v-model="state.menu.event.paymusty" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Liên nạp</UiText>
        <UToggle v-model="state.menu.event.paydays" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">MiniGame</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Vòng quay</UiText>
        <UToggle v-model="state.menu.minigame.wheel" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Xúc xắc</UiText>
        <UToggle v-model="state.menu.minigame.dice" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">Đập trứng</UiText>
        <UToggle v-model="state.menu.minigame.egg" />
      </UiFlex>
    </UCard>

    <UCard>
      <UiText color="primary" weight="bold" class="mb-4">Xếp hạng</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Cấp độ</UiText>
        <UToggle v-model="state.menu.rank.level" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">Lực chiến</UiText>
        <UToggle v-model="state.menu.rank.power" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">Nạp tiền</UiText>
        <UToggle v-model="state.menu.rank.pay" />
      </UiFlex>
    </UCard>

    <UiFlex justify="end" class="mt-4">
      <UButton color="yellow" @click="update('menu')" :loading="updating">Cập nhật</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  menu: {
    action: {
      payment: false,
      giftcode: false,
    },
    shop: {
      pack: false,
      item: false,
      recharge: false
    },
    event: {
      powerup: false,
      referral: false,
      login: false,
      pay: false,
      spend: false,
      paymusty: false,
      paydays: false
    },
    minigame: {
      wheel: false,
      dice: false,
      egg: false
    },
    rank: {
      level: false,
      power: false,
      pay: false
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>