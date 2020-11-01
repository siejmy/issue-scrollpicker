<template>
  <div class="download-button-block">
    <a :href="visible ? url : '#'" :class="{ visible }">
      <slot />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    url: String,
    visible: Boolean,
  },
})
</script>

<style scoped>
.download-button-block {
  width: 100%;
  display: block;
  text-align: center;
}

.download-button-block a {
  text-decoration: none;
  display: inline-block;
  padding: 0.5rem;
  background: #999;
  width: fit-content;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
}

.download-button-block a.visible {
  opacity: 0.8;
}

.download-button-block a.visible:hover {
  opacity: 1;
}
</style>
