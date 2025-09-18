<template>
  <NuxtLayout>
    <UiEffectBg v-if="!isMobileOrTablet" />
    <NuxtLoadingIndicator :height="2" />
    <UNotifications />
    <NuxtPage />
    
    <SocketNoticeReload />
    <SocketNoticeSystem />
    <SocketInit />
  </NuxtLayout>
</template>

<script setup>
const { isMobileOrTablet } = useDevice()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const mode = useColorMode()
const appConfig = useAppConfig()

// Meta Seo
useSeoMeta({
  title: () => configStore.config.name,
  ogTitle: () => configStore.config.name,
  description: () => configStore.config.description,
  ogDescription: () => configStore.config.description,
  ogImage: () => new URL(configStore.config.og_image || '/images/null.webp', runtimeConfig.public.clientURL), 
  ogImageAlt: () => configStore.config.name,
  ogType: 'website'
})

useHead({
  meta: [ 
    { name: 'facebook-domain-verification', content: configStore.config.facebook.client_verify },
    { name: 'google-site-verification', content: configStore.config.google.client_verify },
    { name: 'zalo-platform-site-verification', content: configStore.config.zalo.client_verify },
  ],
  script: [
    { children: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${configStore.config.facebook.client_ads}');
      fbq('track', 'PageView');
    `},
    { children: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', '${configStore.config.google.client_ads}');
    `}
  ],
})

onMounted(() => {
  const modeCookie = useCookie('theme-mode', runtimeConfig.public.cookieConfig)
  const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
  const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)
  mode.preference = 'dark'
  modeCookie.value = 'dark'
  appConfig.ui.primary = 'red'
  primaryCookie.value = 'red'
  appConfig.ui.gray = 'neutral'
  grayCookie.value = 'neutral'
})
</script>