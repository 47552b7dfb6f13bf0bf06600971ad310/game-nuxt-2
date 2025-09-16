<template>
  <div class="LayoutPublic relative max-w-[700px] mx-auto">
    <LayoutPublicHeader />
    <LayoutPublicMenuTop />
    <main class="px-4 pb-4">
      <slot></slot>
    </main>
  </div>
</template>

<style lang="sass">
.LayoutPublic
  .fade-enter-active, .fade-leave-active
    transition: all 0.5s ease
  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>