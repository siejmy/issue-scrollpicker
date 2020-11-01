<template>
  <SuperTitle :text="config.superTitle" />
  <LayersViewport>
    <IssuesScroller
      :config="config"
      @selected="state.selectedIndex = $event"
      ref="issuesScrollerElemRef"
    />
    <EdgeFader />
    <ArrowButton
      type="prev"
      v-if="showPrevButton"
      class="ab-prev"
      @arrowclick="selectPrev()"
    />
    <ArrowButton
      type="next"
      v-if="showNextButton"
      class="ab-next"
      @arrowclick="selectNext()"
    />
  </LayersViewport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  watchEffect,
  ref,
} from 'vue'
import {
  IssuesScroller,
  SuperTitle,
  LayersViewport,
  EdgeFader,
  ArrowButton,
} from '@/components'
import { Configuration } from './domain'

export default defineComponent({
  name: 'App',
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    IssuesScroller,
    LayersViewport,
    SuperTitle,
    EdgeFader,
    ArrowButton,
  },
  setup(props) {
    const issuesScrollerElemRef = ref(null as any)
    const state = reactive({
      selectedIndex: 0,
    })
    const showPrevButton = computed(() => state.selectedIndex > 0)
    const showNextButton = computed(
      () => state.selectedIndex < props.config!.issues.length - 1,
    )

    function selectNext() {
      if (!issuesScrollerElemRef.value) {
        return
      }
      issuesScrollerElemRef.value.selectNext()
    }

    function selectPrev() {
      if (!issuesScrollerElemRef.value) {
        return
      }
      issuesScrollerElemRef.value.selectPrev()
    }

    return {
      state,
      showPrevButton,
      showNextButton,
      issuesScrollerElemRef,
      selectPrev,
      selectNext,
    }
  },
})
</script>

<style>
#app {
  width: 90%;
  height: 18rem;
  margin: 0 auto;
}

.ab-next {
  margin-right: -1rem;
}

.ab-prev {
  margin-left: -1rem;
}
</style>
