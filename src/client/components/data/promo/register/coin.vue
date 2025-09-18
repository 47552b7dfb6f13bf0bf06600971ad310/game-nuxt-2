<template>
  <UiFlex class="box-red rounded-xl overflow-hidden gap-2 py-2 px-0 cursor-pointer relative" @click="action">
    <UiFlex class="inline-flex h-[90%] w-[20%] ml-2">
      <UiImg src="/images/icon/promo-reg.png" w="1" h="1" img-w="200" img-h="200" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs mb-1">Xu Miễn Phí</UiText>
      <UiText class="text-xl" weight="bold">
        <UiNumber :num="configStore.config.promo.register.coin">
          <template #default="{ display }">
            {{ useMoney().toMoney(display) }}
          </template>
        </UiNumber>
      </UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()

const action = () => {
  if(!!authStore.isLogin) return useNotify().error('Phần thưởng được trao khi tạo tài khoản')
  authStore.setModal(true)
}
</script>