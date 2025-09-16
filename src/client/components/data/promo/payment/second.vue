<template>
  <UiFlex class="box-orange rounded-xl overflow-hidden gap-2 py-2 px-0 cursor-pointer" @click="navigateTo('/payment')">
    <UiFlex class="inline-flex h-[90%] w-[20%] ml-2">
      <UiImg src="/images/icon/promo-second.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs mb-1">Nạp Lần Hai</UiText>
      <UiText class="text-xl" weight="bold">
        <UiNumber :num="configStore.config.promo.payment.second">
          <template #default="{ display }">
            {{ display }}%
          </template>
        </UiNumber>
      </UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
</script>