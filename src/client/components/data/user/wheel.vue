<template>
  <UButton color="gray" class="bg-anim-light relative pr-10" :size="size" >
    <UiNumber :num="authStore.profile.currency.wheel">
      <template #default="{ display }">
        {{ display > 9999999 ? miniMoney(display) : toMoney(display) }}
      </template>
    </UiNumber>
    <UiIcon name="i-lucide-lab-wheel" size="6" class="absolute right-2"/>
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