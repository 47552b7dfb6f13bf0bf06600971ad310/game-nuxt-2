export default defineNuxtRouteMiddleware(async () => {
  const home = await useAPI('config/public/homepage')
  if(home != '/') return useTo().navigateToSSL(home)
})