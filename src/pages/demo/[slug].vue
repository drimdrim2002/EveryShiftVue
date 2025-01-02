<template>
  <h1>Demo page - param=<{{ slug }}></h1>
</template>

<script setup lang="ts">
const route = useRoute()
const { slug } = route.params
</script>

<style scoped></style>
