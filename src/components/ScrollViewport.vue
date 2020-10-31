<template>
  <div class="scroll-viewport" ref="viewportElem">
    <div ref="middleMarkElem" class="middle-mark-elem"></div>
    <div class="content" ref="contentElem" draggable="true">
      <LogoContainer :logo="logo" />
      <IssueCover
        v-for="(issue, index) in issues"
        :key="index"
        :issue="issue"
        :ref="'issueCoverElem_' + index"
      />
      <SeeMoreBlock :see-more="seeMore" ref="seeMoreBlockElem" />
      <div class="scroll-to-end-enabler" ref="scrollToEndEnablerElem">
        &nbsp;
      </div>
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
import { Configuration } from '@/domain'
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

    const coverElems: CoverElem[] = issues.value.map((issue, i) => ({
      ref: ref(null as any),
      refName: 'issueCoverElem_' + i,
      startX: 0,
      endX: 0,
    }))
    const coverElemsRefs = coverElems.reduce(
      (refsMap, elem) => ({
        ...refsMap,
        [elem.refName]: elem.ref,
      }),
      {} as Record<string, Ref<any>>,
    )

    const contentElem = ref(null as any)
    const viewportElem = ref(null as any)
    const scrollToEndEnablerElem = ref(null as any)
    const seeMoreBlockElem = ref(null as any)
    const middleMarkElem = ref(null as any)
    const state = reactive({
      x: 0,
      dragging: false,
      selectedIndex: 0,
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

    watchEffect(() => {
      if (!viewportElem.value) {
        return
      }
      const viewPortWidth = viewportElem.value!.clientWidth
      const comparePoint = state.x + viewPortWidth / 2
      const distances = coverElems.map(coverElem => {
        const middle = (coverElem.startX + coverElem.endX) / 2
        return Math.abs(comparePoint - middle)
      })
      state.selectedIndex = indexOfSmallest(distances)
      if (scrollToEndEnablerElem.value && seeMoreBlockElem.value) {
        const scrollToEndEnablerWidth =
          viewPortWidth / 2 - seeMoreBlockElem.value!.$el.clientWidth
        scrollToEndEnablerElem.value!.style.width =
          scrollToEndEnablerWidth + 'px'
      }
      if (middleMarkElem.value) {
        middleMarkElem.value.style.left = comparePoint + 'px'
      }
      console.log(state.selectedIndex)
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
      coverElems.forEach(coverElem => {
        const startX = coverElem.ref.value?.$el.offsetLeft
        const width = coverElem.ref.value?.$el.clientWidth
        if (!startX || !width || width === 0) {
          return
        }
        coverElem.startX = startX
        coverElem.endX = startX + width
      })
      setTimeout(updateCoverElemsPositions, 50)
    }

    onMounted(() => {
      updateCoverElemsPositions()
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
      scrollToEndEnablerElem,
      seeMoreBlockElem,
      logo,
      issues,
      seeMore,
      middleMarkElem,
      ...coverElemsRefs,
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
  ref: Ref<any>
  refName: string
  startX: number
  endX: number
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

.scroll-to-end-enabler {
  background: red;
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
