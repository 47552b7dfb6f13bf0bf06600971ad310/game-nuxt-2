<template>
  <UiFlex justify="center" class="SVN gap-2">
    <UiIcon name="i-icomoon-free-power" size="6" color="yellow" class="relative top-0.5" />
    <UiText color="yellow" size="2xl">Hũ</UiText>
    <UiText size="2xl">{{toMoney(displayNumber)}}</UiText>
  </UiFlex>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()
const props = defineProps(['jar'])

const displayNumber = ref(0)
const duration = 800
const anim = ref()

const totalJar = computed(() => {
  if(!props.jar) return 0
  return props.jar
})

const run = (from, to) => {
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    displayNumber.value = Math.floor(from + (to - from) * progress)

    if (progress < 1) {
      anim.value = requestAnimationFrame(animate)
    } else {
      displayNumber.value = to
      if(!!anim.value) cancelAnimationFrame(anim.value)
    }
  }

  anim.value = requestAnimationFrame(animate)
}

watch(() => totalJar.value, (val) => {
  run(displayNumber.value, val)
})

onMounted(() => {
  if(totalJar.value > 0) run(0, totalJar.value)
})
onBeforeUnmount(() => {
  if(!!anim.value) cancelAnimationFrame(anim.value)
})
</script>