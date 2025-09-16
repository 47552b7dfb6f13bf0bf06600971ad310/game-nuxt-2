<template>
  <USelectMenu
    v-model="itemSelect"
    :searchable="searchItem"
    :multiple="props.multiple"
    size="lg"
    by="_id"
    class="grow"
  >
    <template #label>
      {{ !!select ? select.item_name : 'Tìm kiếm vật phẩm' }}
    </template>

    <template #option="{ option: item }">
      {{ item.item_name }}
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  itemData: Object,
  types: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'update:itemData'])

const itemSelect = ref(props.modelValue || '')

const select = ref()

watch(itemSelect, val => {
  select.value = val
  if(!val) return 

  emit('update:modelValue', val._id)
  emit('update:itemData', val)
})

const searchItem = async (key) => {
  const items = await useAPI('item/public/search', {
    key: key,
    types: JSON.parse(JSON.stringify(props.types))
  })

  return items.map(i => ({ 
    _id: i._id, 
    item_id: i.item_id,
    item_name: i.item_name,
    item_image: i.item_image,
    type: i.type
  })).filter(Boolean)
}
</script>