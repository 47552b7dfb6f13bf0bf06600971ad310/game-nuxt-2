export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) return useTo().navigateToSSL('/')
    if(authStore.profile.type == undefined) return useTo().navigateToSSL('/')
    if(authStore.profile.type < 1) return useTo().navigateToSSL('/')

    await useAPI('ip/whitelist/check')
    return useTo().navigateToSSL('/manage')
  }
  catch (e:any) {
    //return false
  }
})