<template>
  <UiFlex justify="center" class="p-4 gap-0.5 md:gap-2">
    <DataMinigameDiceItem :rolling="rolling" :number="dices[0]" />
    <DataMinigameDiceItem :rolling="rolling" :number="dices[1]" />
    <DataMinigameDiceItem :rolling="rolling" :number="dices[2]" />
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  rolling: Boolean,
  dices: { type: Array, default: () => [0,0,0]}
})
</script>