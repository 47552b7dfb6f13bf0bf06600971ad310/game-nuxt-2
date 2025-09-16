<template>
  <UButton color="gray" class="relative pr-10" :size="size" >
    <UiNumber :num="authStore.profile.currency.diamond">
      <template #default="{ display }">
        {{ display > 9999999 ? miniMoney(display) : toMoney(display) }}
      </template>
    </UiNumber>
    <UiIcon name="i-ic-sharp-diamond" size="6" class="absolute right-2"/>
  </UButton>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()
const props = defineProps({
  size: {
    type: String,
    default: 'lg'
  }
})
const authStore = useAuthStore()
</script>