import { defineStore } from 'pinia'
import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const modal = ref(false)
  const isLogin = ref(false)
  const isAdmin = ref(false)
  const isSMod = ref(false)
  const isDev = ref(false)
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  function setModal (data : boolean) {
    modal.value = data
  }

  async function setAuth () {
    const auth = await useAPI('auth/public/get', undefined, {
      key: `auth/public/get-${Date.now()}`,
    })
    isAdmin.value = auth.type == 3
    isDev.value = auth.type == 2
    isSMod.value = auth.type == 1
    isLogin.value = true
    profile.value = auth
  }

  async function removeAuth () {
    await useAPI('auth/public/sign/out')
    isLogin.value = false
    isAdmin.value = false
    isSMod.value = false
    isDev.value = false
    profile.value = undefined
  }

  return { 
    modal, 
    isLogin, 
    profile, 
    isAdmin, 
    isSMod,
    isDev,
    setModal, 
    setAuth, 
    removeAuth 
  }
})