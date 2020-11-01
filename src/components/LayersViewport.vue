<template>
  <div class="layers-viewport">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped>
.layers-viewport {
  display: block;
  width: 100%;
  position: relative;
}

.layers-viewport > * {
  display: block;
  position: absolute;
  top: 0;
}
</style>
