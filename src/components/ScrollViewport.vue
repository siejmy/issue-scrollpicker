<template>
  <div class="scroll-viewport" ref="viewportElem">
    <div class="content" ref="contentElem" draggable="true">
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
      dragging: false,
    })

    watchEffect(
      () => viewportElem.value && (viewportElem.value!.scrollLeft = state.x),
    )

    watchEffect(
      () =>
        viewportElem.value &&
        (viewportElem.value!.style.transform = state.dragging
          ? 'scale(1)'
          : 'scale(0.98)'),
    )

    function scroll(deltaX: number, deltaY: number) {
      const maxScrollLeft =
        viewportElem.value!.scrollWidth - viewportElem.value!.clientWidth
      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX
      state.x += delta
      if (state.x < 0) {
        state.x = 0
      }
      if (state.x > maxScrollLeft) {
        state.x = maxScrollLeft
      }
    }

    function handleMouseWheel(e: MouseWheelEvent) {
      const multiplier = getWheelMultiplierForDeltaMode(e.deltaMode)
      scroll(e.deltaX * multiplier, e.deltaY * multiplier)

      e.preventDefault()
    }

    onMounted(() => {
      if (!viewportElem.value) {
        throw new Error('Cannot ger viewport ref')
      }

      viewportElem.value!.onwheel = handleMouseWheel

      if (!contentElem.value) {
        throw new Error('Cannot ger content ref')
      }

      contentElem.value!.ondragstart = (e: DragEvent) => {
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'none'
        }
        e.preventDefault()
      }
      contentElem.value!.onmousedown = (e: MouseEvent) => {
        if (e.button === 0) state.dragging = true
      }
      contentElem.value!.onmouseup = (e: MouseEvent) => {
        if (e.button === 0) state.dragging = false
      }
      viewportElem.value!.onmouseleave = (e: MouseEvent) =>
        (state.dragging = false)
      viewportElem.value!.onmousemove = (e: MouseEvent) => {
        if (!state.dragging) return
        scroll(-e.movementX, 0)
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
  transition: all 0.2s;
  transform: scale(0.99);
}

.scroll-viewport .content {
  height: inherit;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
