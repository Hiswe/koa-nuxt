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
    <noscript class="no-script">
      Javascript is disabled but no worries everything should be fine
    </noscript>
    <nuxt />
    <kn-notifications />
  </kn-main>
</template>

<style scoped>
.no-script {
  text-align: center;
}
</style>
