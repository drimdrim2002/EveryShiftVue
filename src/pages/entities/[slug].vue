<template>
  <h1>Entity - param={{ slug }}</h1>
</template>

<script setup lang="ts">
const { slug } = useRoute('/entities/[slug]').params
</script>

<style scoped></style>
