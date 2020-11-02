<template>
  <div class="scroll-viewport" ref="viewportElem">
    <div class="scroll-content" ref="contentElem" draggable="true">
      <div class="position-adjuster" ref="startPositionAdjusterElem">
        &nbsp;
      </div>
      <div class="true-content" ref="trueContentElem">
        <LogoContainer class="logo-container" :logo="logo" />
        <IssueCover
          v-for="(issue, index) in issues"
          :key="index"
          :issue="issue"
          :ref="'issueCoverElem_' + index"
          :is-active="state.selectedIndex === index"
          :class="{ active: state.selectedIndex === index }"
          @click="issueClicked(index)"
        />
        <SeeMoreBlock :see-more="seeMore" ref="seeMoreBlockElem" />
      </div>
      <div class="position-adjuster" ref="endPositionAdjusterElem">&nbsp;</div>
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
  Ref,
} from 'vue'
import LogoContainer from './LogoContainer.vue'
import IssueCover from './IssueCover.vue'
import SeeMoreBlock from './SeeMoreBlock.vue'
import { Configuration } from '@/domain'
import { indexOfSmallest, Debouncer } from '@/util'

export default defineComponent({
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    LogoContainer,
    IssueCover,
    SeeMoreBlock,
  },
  setup(props, { emit }) {
    const logo = computed(() => props.config!.logo)
    const issues = computed(() => props.config!.issues)
    const seeMore = computed(() => props.config!.seeMore)
    const contentElem = ref(null as any)
    const coverElemsRefs = issues.value.map((_, index) => ref(null as any))
    const viewportElem = ref(null as any)
    const startPositionAdjusterElem = ref(null as any)
    const endPositionAdjusterElem = ref(null as any)
    const seeMoreBlockElem = ref(null as any)
    const trueContentElem = ref(null as any)
    const state = reactive({
      x: 0,
      actualX: 0,
      dragging: false,
      scrolling: false,
      selectedIndex: 0,
      viewPortWidth: 0,
      touchStartX: 0,
      coverElems: issues.value.map(() => ({ startX: 0, endX: 0, middleX: 0 })),
    })

    function physicalScrollTo(x: number) {
      viewportElem.value && (viewportElem.value!.scrollLeft = x)
    }

    const scrollDebouncer = new Debouncer(() => {
      scrollToIndex(state.selectedIndex)
      state.scrolling = false
    })

    const comparePointAdjusted = computed(
      () => state.x + state.viewPortWidth / 2 - startPositionAdjust.value,
    )
    const startPositionAdjust = computed(() => {
      if (state.coverElems.length === 0) {
        return 0
      }
      const firstCoverMiddlePoint = state.coverElems[0].middleX
      return state.viewPortWidth / 2 - firstCoverMiddlePoint
    })

    watchEffect(
      () =>
        viewportElem.value &&
        (viewportElem.value!.style.transform = state.dragging
          ? 'scale(1)'
          : 'scale(0.98)'),
    )

    watchEffect(() =>
      state.scrolling ? emit('scrollstart') : emit('scrollend'),
    )

    const endPositionAdjust = computed(() => {
      if (!trueContentElem.value) {
        return 0
      }
      if (state.coverElems.length === 0) {
        return 0
      }
      const lastElem = state.coverElems[state.coverElems.length - 1]
      const lastCoverMiddlePoint = lastElem.middleX
      const trueContentWidth = trueContentElem.value.clientWidth
      const lastElementToEndSpace = trueContentWidth - lastCoverMiddlePoint
      return state.viewPortWidth / 2 - lastElementToEndSpace
    })

    watchEffect(() => {
      const distances = state.coverElems.map((coverElem) => {
        const middle = coverElem.middleX
        return Math.abs(comparePointAdjusted.value - middle)
      })
      state.selectedIndex = indexOfSmallest(distances)
    })

    watchEffect(() => {
      scrollToIndex(state.selectedIndex)
      emit('selected', state.selectedIndex)
    })

    watchEffect(() => {
      if (startPositionAdjusterElem.value) {
        startPositionAdjusterElem.value!.style.width =
          startPositionAdjust.value + 'px'
      }
    })

    watchEffect(() => {
      if (endPositionAdjusterElem.value) {
        endPositionAdjusterElem.value!.style.width =
          endPositionAdjust.value + 'px'
      }
    })

    function scroll(deltaX: number, deltaY: number) {
      const maxScrollLeft =
        viewportElem.value!.scrollWidth - viewportElem.value!.clientWidth
      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX
      let posX = state.x + delta
      if (posX < 0) {
        posX = 0
      }
      if (posX > maxScrollLeft) {
        posX = maxScrollLeft
      }
      if (state.x != posX) {
        state.x = posX
      }
      scrollDebouncer.trigger(200)
      state.scrolling = true
    }

    function handleMouseWheel(e: WheelEvent) {
      const multiplier = getWheelMultiplierForDeltaMode(e.deltaMode)
      scroll(e.deltaX * multiplier, -e.deltaY * multiplier)

      e.preventDefault()
    }

    function updateCoverElemsPositions() {
      state.coverElems.forEach((coverElem, index) => {
        const elem = coverElemsRefs[index].value?.$el
        if (!elem) {
          console.warn('Empty cover elem ref value')
          return
        }
        const startX = elem.offsetLeft
        const width = elem.clientWidth
        if (typeof startX !== "number" || !width || width === 0) {
          return
        }
        coverElem.startX = startX
        coverElem.endX = startX + width
        coverElem.middleX = startX + (width / 2)
      })
    }

    function updateViewportWidth() {
      if (!viewportElem.value) {
        return
      }
      const viewPortWidth = viewportElem.value!.clientWidth
      if (state.viewPortWidth != viewPortWidth) {
        state.viewPortWidth = viewPortWidth
      }
    }

    function scrollTick() {
      const diff = state.x - state.actualX
      const actualX = state.actualX + (diff ^ 2) / 5
      if (Math.round(state.actualX) != Math.round(actualX)) {
        state.actualX = actualX
        physicalScrollTo(actualX)
      }
    }

    function tickUpdatePositions() {
      updateCoverElemsPositions()
      updateViewportWidth()
      scrollTick()
      setTimeout(tickUpdatePositions, 15)
    }

    onMounted(() => {
      tickUpdatePositions()
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
      viewportElem.value!.addEventListener('touchstart', (e: TouchEvent) => {
        state.touchStartX = e.touches[0].pageX;
      }, false)
      viewportElem.value!.addEventListener('touchmove', (e: TouchEvent) => {
        const deltaX =e .touches[0].pageX - state.touchStartX
        scroll(deltaX, 0)
      }, false)
    })

    function scrollToIndex(index: number) {
      const to = state.coverElems[index].middleX - state.coverElems[0].middleX
      state.x = to
      state.scrolling = true
      scrollDebouncer.trigger(200)
    }

    function issueClicked(index: number) {
      if (index == state.selectedIndex) {
        return
      }
      scrollToIndex(index)
    }

    function selectNext() {
      if (state.selectedIndex >= props.config!.issues.length - 1) {
        return
      }
      scrollToIndex(state.selectedIndex + 1)
    }

    function selectPrev() {
      if (state.selectedIndex === 0) {
        return
      }
      scrollToIndex(state.selectedIndex - 1)
    }

    return {
      state,
      contentElem,
      viewportElem,
      startPositionAdjusterElem,
      endPositionAdjusterElem,
      trueContentElem,
      seeMoreBlockElem,
      logo,
      issues,
      seeMore,
      ...getCoverElemsRefs(coverElemsRefs),
      issueClicked,
      selectNext,
      selectPrev,
    }
  },
})

function getWheelMultiplierForDeltaMode(deltaMode: number) {
  if (deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
    return 0.5
  } else if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return 8
  } else if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return 200
  } else {
    console.warn('Unknown mouse wheel delta mode: ' + deltaMode)
    return 8
  }
}

interface CoverElem {
  startX: number
  endX: number
  middleX: number
}

function getCoverElemsRefs(refs: Ref<any>[]) {
  return refs.reduce(
    (refsMap, ref, index) => ({
      ...refsMap,
      ['issueCoverElem_' + index]: ref,
    }),
    {} as Record<string, Ref<any>>,
  )
}
</script>

<style scoped>
.scroll-viewport {
  overflow-x: hidden;
  width: 100%;
  height: fit-content;
  transition: all 0.2s;
  transform: translateZ(0) scale(0.98);
  backface-visibility: hidden;
  padding-bottom: 1rem;
}

.scroll-viewport .scroll-content {
  width: max-content;
}

.scroll-content .true-content {
  display: inline-block;
  height: inherit;
  position: relative;
}

.position-adjuster {
  display: inline-block;
  vertical-align: top;
  height: inherit;
}
</style>
