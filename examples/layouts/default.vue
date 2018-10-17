<script>
import KnNotifications from '~/components/notifications.vue'

export default {
  name: `layout-default`,
  components: {
    KnNotifications,
  },
}
</script>

<template>
  <kn-main>
    <kn-navigation />
    <noscript>
      <p class="no-script-message">Javascript is disabled but no worries everything should be fine</p>
    </noscript>
    <nuxt />
    <kn-notifications />
  </kn-main>
</template>

<style scoped>
.no-script-message {
  text-align: center;
  /* max-width: 1024px; */
  margin: 0 0 1rem;
  padding: 1rem;
  background: var(--color-vue-light);
}
</style>
