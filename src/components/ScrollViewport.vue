<template>
  <div class="scroll-viewport" ref="viewportElem">
    <div class="content" ref="contentElem">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  watchEffect,
} from 'vue'

export default defineComponent({
  setup() {
    const contentElem = ref(null as any)
    const viewportElem = ref(null as any)
    const state = reactive({
      x: 0,
    })

    watchEffect(() => {
      if (viewportElem.value) {
        viewportElem.value!.scrollLeft = state.x
      }
    })

    onMounted(() => {
      if (!viewportElem.value) {
        throw new Error('Cannot ger viewport ref')
      }

      // viewportElem.value!.onscroll = (e: any) => console.log(e)
      viewportElem.value!.onwheel = (e: any) => {
        const multiplier = getWheelMultiplierForDeltaMode(e.deltaMode)
        const maxScrollLeft =
          viewportElem.value!.scrollWidth - viewportElem.value!.clientWidth
        state.x += e.deltaY * multiplier
        if (state.x < 0) {
          state.x = 0
        }
        if (state.x > maxScrollLeft) {
          state.x = maxScrollLeft
        }
        e.preventDefault()
      }
    })

    return {
      state,
      contentElem,
      viewportElem,
    }
  },
})

function getWheelMultiplierForDeltaMode(deltaMode: number) {
  if (deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    return 1
  } else if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return 16
  } else if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return 200
  } else {
    console.warn('Unknown mouse wheel delta mode: ' + deltaMode)
    return 16
  }
}
</script>

<style scoped>
.scroll-viewport {
  height: inherit;
  overflow-x: hidden;
  position: relative;
  width: 100%;
}

.scroll-viewport .content {
  height: inherit;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
