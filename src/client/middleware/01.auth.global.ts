export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const token = useCookie('token-auth', runtimeConfig.public.cookieConfig)
  if(!token.value) return

  try{
    await authStore.setAuth()
  }
  catch(e){
    token.value = null
  }
})