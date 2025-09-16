<template>
  <UiContent 
    title="Admin Functions" 
    sub="Chức năng của quản trị viên cấp cao" 
    class="max-w-3xl mx-auto"
  >
    <UCard>
      <div class="mb-4">
        <UiText weight="semibold" size="sm">API trò chơi khác</UiText>
        <UiFlex class="gap-1 mt-1.5">
          <UInput class="grow" v-model="state.more_game" />
          <UButton size="md" color="yellow" @click="action('api-more-game')">Lưu</UButton>
        </UiFlex>
      </div>

      <div class="mb-4 mt-1.5">
        <UiText weight="semibold" size="sm">Mật khẩu ủy quyền</UiText>
        <UiFlex class="gap-1 mt-1.5">
          <UInput class="grow" v-model="state.gm_password" type="password" />
          <UButton size="md" color="yellow" @click="action('change-gm-password')">Lưu</UButton>
        </UiFlex>
      </div>

      <UiFlex justify="between">
        <UButton color="rose" @click="modal.reopen = true">Reopen</UButton>
        <UButton color="gray" @click="modal.reset = true">Đặt Lại Cấu Hình</UButton>
      </UiFlex>
    </UCard>

    <UModal v-model="modal.reset" preventClose>
      <UiContent title="Reset" class="bg-card rounded-xl p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="orange" variant="soft">
          <template #description>
            Bạn chắc chắn muốn đặt lại cấu hình trang ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="action('reset-config')" :loading="updating" color="orange">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.reset = false" :disabled="!!updating" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <UModal v-model="modal.reopen" preventClose>
      <UiContent title="Reopen" class="bg-card rounded-xl p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="rose" variant="soft">
          <template #description>
            Bạn chắc chắn muốn mở lại trò chơi ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="action('reopen')" :loading="updating" color="rose">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.reopen = false" :disabled="!!updating" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)
const state = ref({
  change: null,

  gm_password: '',
  more_game: ''
})

const modal = ref({
  reset: false,
  reopen: false
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const action = async (type) => {
  try {
    if(!!updating.value) return error('Có 1 tiến trình đang xử lý, vui lòng đợi')
    
    updating.value = true
    await useAPI('config/manage/action', {
      type: type,
      gm_password: state.value.gm_password,
      more_game: state.value.more_game,
    })

    updating.value = false
    modal.value.reset = false
    modal.value.reopen = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>