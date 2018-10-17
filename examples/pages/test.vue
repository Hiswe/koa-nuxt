<script>
import { mapMutations } from 'vuex'

import { ADD_NOTIFICATION } from '~/store'

export default {
  name: `page-test`,
  methods: {
    addNotification() {
      console.log(`addNotification`)
      this.$axios
        .post(`/flash-message`, {})
        .then(response => {
          const { data } = response
          this.notify(data)
        })
        .catch(error => {
          // console.log(error)
        })
    },
    ...mapMutations({ notify: ADD_NOTIFICATION }),
  },
}
</script>

<template>
  <div class="test">
    <form
      action="/flash-message"
      method="POST"
      @submit.prevent="addNotification"
    >
      <button class="kn-button" type="submit">show a flash message</button>
    </form>
    <form action="/will-throw" method="POST">
      <button class="kn-button" type="submit">throw a server error</button>
    </form>
  </div>
</template>

<style scoped>
.test {
  text-align: center;
}
.kn-button {
  background: var(--color-vue);
  color: white;
  border: 0;
  padding: 0.75rem 1rem;
  margin-top: 2rem;
  border-radius: 0.25rem;
}
</style>


