<template>
  <div class="super-title-block">
    <span v-html="text"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: String,
  },
})
</script>

<style scoped>
.super-title-block {
  width: 100%;
  display: block;
  text-align: center;
}
</style>
