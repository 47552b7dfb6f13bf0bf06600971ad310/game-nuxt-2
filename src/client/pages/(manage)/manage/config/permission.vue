<template>
  <UiContent 
    title="Permission Config" 
    sub="Chỉnh sửa quyền hạn Quản Trị Viên" 
    class="max-w-3xl mx-auto"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
      v-if="!load"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="mb-2" :class="{
          'bg-gray-1000' : !open,
          'color-blue-light bg-anim-light': !!open
        }">
          <UiText class="text-white">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #config>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Cập nhật</UiText>
            <SelectPermission v-model="state.config.update" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Chức năng ADMIN</UiText>
            <SelectPermission v-model="state.config.action" />
          </UiFlex>
        </UCard>
      </template>

      <template #user>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.user.editAuth" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa tiền tệ</UiText>
            <SelectPermission v-model="state.user.editCurrency" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa tích nạp</UiText>
            <SelectPermission v-model="state.user.editPay" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa tiêu phí</UiText>
            <SelectPermission v-model="state.user.editSpend" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa đăng nhập</UiText>
            <SelectPermission v-model="state.user.editLogin" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đặt lại thông số</UiText>
            <SelectPermission v-model="state.user.reset" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xáo tài khoản</UiText>
            <SelectPermission v-model="state.user.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #gate>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.gate.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.gate.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xóa kênh</UiText>
            <SelectPermission v-model="state.gate.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #payment>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa cấu hình</UiText>
            <SelectPermission v-model="state.payment.configUpdate" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Duyệt / Từ chối</UiText>
            <SelectPermission v-model="state.payment.verify" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Hoàn tác</UiText>
            <SelectPermission v-model="state.payment.undo" />
          </UiFlex>
        </UCard>
      </template>

      <template #spend>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.spend.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.spend.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xóa chi tiêu</UiText>
            <SelectPermission v-model="state.spend.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #shop>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa cấu hình</UiText>
            <SelectPermission v-model="state.shop.configUpdate" />
          </UiFlex>
          
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.shop.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.shop.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Xóa vật phẩm</UiText>
            <SelectPermission v-model="state.shop.del" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Sửa gói vật phẩm</UiText>
            <SelectPermission v-model="state.shop.editGift" />
          </UiFlex>
        </UCard>
      </template>

      <template #event>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.event.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.event.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Xóa sự kiện</UiText>
            <SelectPermission v-model="state.event.del" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa phần thưởng</UiText>
            <SelectPermission v-model="state.event.editGift" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xóa lịch sử</UiText>
            <SelectPermission v-model="state.event.delHistory" />
          </UiFlex>
        </UCard>
      </template>

      <template #giftcode>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.giftcode.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.giftcode.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Xóa mã</UiText>
            <SelectPermission v-model="state.giftcode.del" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa phần thưởng</UiText>
            <SelectPermission v-model="state.giftcode.editGift" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xóa lịch sử</UiText>
            <SelectPermission v-model="state.giftcode.delHistory" />
          </UiFlex>
        </UCard>
      </template>

      <template #wheel>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Thêm mới</UiText>
            <SelectPermission v-model="state.wheel.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Sửa thông tin</UiText>
            <SelectPermission v-model="state.wheel.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xóa phần thưởng</UiText>
            <SelectPermission v-model="state.wheel.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #dice>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">Sửa cấu hình</UiText>
            <SelectPermission v-model="state.dice.update" />
          </UiFlex>
        </UCard>
      </template>

      <template #egg>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">Sửa cấu hình</UiText>
            <SelectPermission v-model="state.egg.update" />
          </UiFlex>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">Gửi vật phẩm</UiText>
            <SelectPermission v-model="state.game.sendItem" />
          </UiFlex>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="end" class="mt-2">
      <UButton color="yellow" @click="update()" :loading="updating">Cập nhật</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const load = ref(true)
const updating = ref(false)

const state = ref({
  config: {
    update: [],
    action: [],
  },
  user: {
    editAuth: [],
    editCurrency: [],
    editPay: [],
    editSpend: [],
    editLogin: [],
    reset: [],
    del: [],
  },
  gate: {
    add: [],
    edit: [],
    del: [],
  },
  payment: {
    configUpdate: [],
    verify: [],
    undo: [],
  },
  spend: {
    add: [],
    edit: [],
    del: [],
  },
  shop: {
    configUpdate: [],
    add: [],
    edit: [],
    del: [],
    editGift: [],
    delHistory: [],
  },
  event: {
    add: [],
    edit: [],
    del: [],
    editGift: [],
    delHistory: [],
  },
  giftcode: {
    add: [],
    edit: [],
    del: [],
    editGift: [],
    delHistory: [],
  },
  wheel: {
    add:  [],
    edit:  [],
    del:  [],
  },
  dice: {
    update:  [],
  },
  egg: {
    update:  [],
  },
  game: {
    sendItem: [],
  }
})

const menu = [
  { label: 'Cài đặt', slot: 'config' },
  { label: 'Tài khoản', slot: 'user' },
  { label: 'Kênh nạp', slot: 'gate' },
  { label: 'Thanh toán', slot: 'payment' },
  { label: 'Chi tiêu', slot: 'spend' },
  { label: 'Cửa hàng', slot: 'shop' },
  { label: 'Sự kiện', slot: 'event' },
  { label: 'Giftcode', slot: 'giftcode' },
  { label: 'Vòng quay', slot: 'wheel' },
  { label: 'Xúc xắc', slot: 'dice' },
  { label: 'Đập trứng', slot: 'egg' },
  { label: 'Trò chơi', slot: 'game' },
]

const getPermission = async () => {
  const permission = await useAPI('config/manage/permission/get')
  state.value = Object.assign(state.value, permission)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true

    await useAPI('config/manage/permission/update', JSON.parse(JSON.stringify(state.value)))
    getPermission()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getPermission()
</script>