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
    <nuxt />
    <kn-notifications />
  </kn-main>
</template>

