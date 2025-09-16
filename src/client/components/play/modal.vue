<template>
  <UiContent :title="title" :sub="sub" class="bg-card rounded-xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emit('close')"></UButton>
    </template>

    <slot></slot>
  </UiContent>
</template>

<script setup>
const props = defineProps(['title', 'sub'])
const emit = defineEmits(['close'])
</script>