<template>
  <div class="edge-fader edge-fader-left">
    &nbsp;
  </div>
  <div class="edge-fader edge-fader-right">
    &nbsp;
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped>
.edge-fader {
  display: block;
  height: inherit;
  width: 3rem;
  position: absolute;
  top: 0;
  bottom: 0;
}

.edge-fader-left {
  left: 0;
  background: rgb(255, 255, 255, 0);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 15%,
    rgba(255, 255, 255, 0) 100%
  );
}

.edge-fader-right {
  right: 0;
  background: rgb(255, 255, 255, 0);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 85%,
    rgba(255, 255, 255, 1) 100%
  );
}
</style>
