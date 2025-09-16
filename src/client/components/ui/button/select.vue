<template>
  <UiFlex 
    justify="center" 
    class="
      bg-gray-1000 
      relative inline-flex cursor-pointer
      rounded-xl
      border border-gray-800
    "
    :class="{
      'bg-main-red': !!active
    }"
  >
    <UiFlex justify="center z-[1]">
      <slot></slot>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: false }
})
</script>