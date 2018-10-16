<script>
export default {
  name: `error`,
  props: [`error`],
}
</script>

<template>
  <section class="error">
    <h1>{{error.statusCode}}</h1>
    <h2 v-if="error.statusCode === 404">not found</h2>
    <h2>{{error.message}}</h2>
    <router-link to="/">home</router-link>
  </section>
</template>

