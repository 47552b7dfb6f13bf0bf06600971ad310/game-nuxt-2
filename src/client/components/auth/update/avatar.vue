<template>
  <UCard>
    <template #header>
      <UiText size="base" weight="semibold">Đổi ảnh đại diện</UiText>
      <UiText size="sm" color="gray">Sử dụng ảnh vuông, dung lượng nhỏ hơn 10mb</UiText>
    </template>

    <UForm :state="state" @submit="submit">
      <UFormGroup name="avatar">
        <UiUploadImage v-model="state.avatar">
          <template #default="{ select, loading }">
            <UInput icon="i-bxs-image" placeholder="Bấm vào đây để tải ảnh" :model-value="state.avatar" :loading="loading" :disabled="updating" readonly @click="select"/>
          </template>
        </UiUploadImage>
      </UFormGroup>

      <UiFlex justify="between" class="mt-4">
        <UButton color="gray" @click="setDefault">Mặc đinh</UButton>
        <UButton type="submit" :loading="updating">Xác nhận</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['done'])

const updating = ref(false)

const state = ref({
  avatar: undefined
})

const setDefault = async () => {
  state.value.avatar = '/images/user/default.png'
  submit()
}

const submit = async () => {
  try {
    updating.value = true
    await useAPI('auth/public/update/avatar', JSON.parse(JSON.stringify(state.value)))
    await authStore.setAuth()

    updating.value = false
    emit('done')
  }
  catch (e) {
    updating.value = false
  }
}
</script>