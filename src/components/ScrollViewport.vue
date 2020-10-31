<template>
  <div class="scroll-viewport" ref="viewportElem">
    <div class="content" ref="contentElem" draggable="true">
      <div ref="middleMarkElem" class="middle-mark-elem"></div>
      <div class="position-adjuster" ref="startPositionAdjusterElem">
        &nbsp;
      </div>
      <div class="true-content" ref="trueContentElem">
        <LogoContainer :logo="logo" />
        <IssueCover
          v-for="(issue, index) in issues"
          :key="index"
          :issue="issue"
          :ref="'issueCoverElem_' + index"
          :is-active="state.selectedIndex === index"
          :class="{ active: state.selectedIndex === index }"
        />
        <SeeMoreBlock :see-more="seeMore" ref="seeMoreBlockElem" />
      </div>
      <div class="position-adjuster" ref="endPositionAdjusterElem">&nbsp;</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {
  computed,
  defineComponent,
  isVNode,
  onMounted,
  PropType,
  reactive,
  ref,
  VNode,
  watchEffect,
  Ref,
} from 'vue'
import LogoContainer from './LogoContainer.vue'
import IssueCover from './IssueCover.vue'
import SeeMoreBlock from './SeeMoreBlock.vue'
import { Configuration, Issue } from '@/domain'
import { indexOfSmallest } from '@/util'

export default defineComponent({
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    LogoContainer,
    IssueCover,
    SeeMoreBlock,
  },
  setup(props, { slots }) {
    const logo = computed(() => props.config!.logo)
    const issues = computed(() => props.config!.issues)
    const seeMore = computed(() => props.config!.seeMore)
    const contentElem = ref(null as any)
    const coverElemsRefs = issues.value.map((_, index) => ref(null as any))
    const viewportElem = ref(null as any)
    const startPositionAdjusterElem = ref(null as any)
    const endPositionAdjusterElem = ref(null as any)
    const seeMoreBlockElem = ref(null as any)
    const middleMarkElem = ref(null as any)
    const trueContentElem = ref(null as any)
    const state = reactive({
      x: 0,
      dragging: false,
      selectedIndex: 0,
      viewPortWidth: 0,
      startPositionAdjust: 0,
      endPositionAdjust: 0,
      comparePoint: 0,
      comparePointAdjusted: 0,
      coverElems: issues.value.map(() => ({ startX: 0, endX: 0 })),
    })

    watchEffect(
      () => viewportElem.value && (viewportElem.value!.scrollLeft = state.x),
    )
    watchEffect(() => (state.comparePoint = state.x + state.viewPortWidth / 2))

    watchEffect(
      () =>
        (state.comparePointAdjusted =
          state.comparePoint - state.startPositionAdjust),
    )

    watchEffect(
      () =>
        viewportElem.value &&
        (viewportElem.value!.style.transform = state.dragging
          ? 'scale(1)'
          : 'scale(0.98)'),
    )

    watchEffect(() => {
      if (state.coverElems.length === 0) {
        return
      }
      const firstCoverMiddlePoint =
        (state.coverElems[0].startX + state.coverElems[0].endX) / 2
      state.startPositionAdjust =
        state.viewPortWidth / 2 - firstCoverMiddlePoint
    })

    watchEffect(() => {
      if (!trueContentElem.value) {
        return
      }
      if (state.coverElems.length === 0) {
        return
      }
      const lastElem = state.coverElems[state.coverElems.length - 1]
      const lastCoverMiddlePoint = (lastElem.startX + lastElem.endX) / 2
      const trueContentWidth = trueContentElem.value.clientWidth
      const lastElementToEndSpace = trueContentWidth - lastCoverMiddlePoint
      state.endPositionAdjust = state.viewPortWidth / 2 - lastElementToEndSpace
    })

    watchEffect(() => {
      const distances = state.coverElems.map(coverElem => {
        const middle = (coverElem.startX + coverElem.endX) / 2
        return Math.abs(state.comparePointAdjusted - middle)
      })
      state.selectedIndex = indexOfSmallest(distances)
    })

    watchEffect(() => {
      console.log(state.selectedIndex)
    })

    watchEffect(() => {
      if (startPositionAdjusterElem.value) {
        startPositionAdjusterElem.value!.style.width =
          state.startPositionAdjust + 'px'
      }
    })

    watchEffect(() => {
      if (endPositionAdjusterElem.value) {
        endPositionAdjusterElem.value!.style.width =
          state.endPositionAdjust + 'px'
      }
    })

    watchEffect(() => {
      if (middleMarkElem.value) {
        middleMarkElem.value.style.left = state.comparePoint + 'px'
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
    }

    function handleMouseWheel(e: MouseWheelEvent) {
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
        if (!startX || !width || width === 0) {
          return
        }
        coverElem.startX = startX
        coverElem.endX = startX + width
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

    function tickUpdatePositions() {
      updateCoverElemsPositions()
      updateViewportWidth()
      setTimeout(tickUpdatePositions, 5)
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
    })

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
      middleMarkElem,
      ...getCoverElemsRefs(coverElemsRefs),
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

interface CoverElem {
  startX: number
  endX: number
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

.content .true-content {
  display: inline-block;
  height: inherit;
  position: relative;
}

.position-adjuster {
  display: inline-block;
  vertical-align: top;
  height: inherit;
}
.middle-mark-elem {
  position: absolute;
  top: 0;
  left: 0;
  height: inherit;
  width: 1px;
  background: red;
}
</style>
