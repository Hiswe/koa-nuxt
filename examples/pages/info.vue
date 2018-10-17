<script>
export default {
  name: `page-info`,
}
</script>

<template>
  <div class="info">
    <form action="/will-throw" method="POST">
      <button type="submit">the will throw</button>
    </form>
    <form action="/flash-message" method="POST">
      <button type="submit">the show a flash message</button>
    </form>
  </div>
</template>

