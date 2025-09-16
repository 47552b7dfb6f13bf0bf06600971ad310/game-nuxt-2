export default defineNuxtRouteMiddleware(async () => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw true
    if(authStore.profile.type as number < 1) throw true

    const playUrl = useCookie('play-manage-url', runtimeConfig.public.cookieConfig)
    if(!playUrl.value) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})