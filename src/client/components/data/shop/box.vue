<template>
  <UCard v-if="item" class="bg-gray ring-1 cursor-pointer">
    <UiFlex type="col">
      <DataItemImage 
        :src="item.image || null"
        :type="item.type"
        :size="100"
        class="mb-0 mx-auto" 
      />

      <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mt-4 mb-0.5 max-w-[90%]">
        {{ item.item_amount > 1 ? `x${miniMoney(item.item_amount)}` : '' }} {{ item.name }}
      </UiText>

      <UiText 
        size="xs" 
        weight="semibold" 
        class="line-clamp-1 mb-4" 
        :color="(!!systemDiscount && systemDiscount.number > 0) ? 'red' : 'gray'"
      >
        {{ (!!systemDiscount && systemDiscount.number > 0) ? `Giảm giá ${systemDiscount.number}%` : typeFormat[item.type] }}
      </UiText>
      
      <UButton color="gray" class="px-4 md:px-6 max-w-full">
        {{ miniMoney(totalPrice) }}
        <UiIcon name="i-game-icons-two-coins" class="ml-1" size="5"/>
      </UButton>
    </UiFlex>
  </UCard>
</template>

<script setup>
const props = defineProps(['item', 'config'])
const { miniMoney } = useMoney()
const { dayjs, displayFull } = useDayJs()

const typeFormat = {
  'game_recharge': 'Gói Nạp',
  'game_item': 'Vật Phẩm',
  'wheel': 'Tiền Tệ'
}

const systemDiscount = computed(() => {
  if(!props.config) return null

  let number = 0
  let time = ''
  const discount = parseInt(props.config.discount.number || 0)
  const expired = props.config.discount.expired || null

  if(!expired) number = discount, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = discount, time = `đến ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

const totalPrice = computed(() => {
  if(!props.item) return 0
  if(!systemDiscount.value) return props.item.price

  const discount_system = systemDiscount.value.number
  const total = props.item.price - Math.floor(props.item.price * discount_system / 100)
  return total
})
</script>

<style lang="sass">
.BoxShopItem
  transition: all 0.25s ease
  overflow: hidden
  &:hover
    transform: translateY(-5px)
</style>