<template>
  <UiContent title="Giftcode" sub="Nhận thưởng mã quà tặng" class="bg-card rounded-xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emit('close')"></UButton>
    </template>
    
    <UForm :state="state" @submit="submit" v-if="!!giftcode">
      <UFormGroup label="Máy chủ">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup label="Tên mã">
        <UInput :model-value="giftcode.code" readonly />
      </UFormGroup>

      <UFormGroup label="Giới hạn">
        <UInput :model-value="giftcode.limit == 0 ? 'Không giới hạn' : `${giftcode.limit} người`" readonly />
      </UFormGroup>

      <UFormGroup label="Sử dụng">
        <UInput :model-value="!!giftcode.justone ? 'Một lần duy nhất' : 'Một lần cho mỗi máy chủ'" readonly />
      </UFormGroup>

      <UFormGroup label="Phần thưởng">
        <div class="bg-gray ring-1 ring-gray-800 rounded-xl p-4">
          <DataItemList :items="giftcode.gift" class="justify-center"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton color="yellow" @click="submit" :loading="loading" v-if="!!isActive">Nhận</UButton>
        <UButton color="gray" :disabled="loading" @click="emit('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['giftcode', 'server'])
const emit = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: props.server || null,
  role: null,
  giftcode: props.giftcode ? props.giftcode._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('giftcode/public/receive', JSON.parse(JSON.stringify(state.value)))

    setTimeout(() => {
      loading.value = false
      emit('done')
    }, 1000);
  }
  catch (e) {
    loading.value = false
  }
}
</script>