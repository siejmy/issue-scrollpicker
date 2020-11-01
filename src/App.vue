<template>
  <div class="scrollpicker-root">
    <SuperTitle :text="config.superTitle" class="scrollpicker-supertitle" />
    <LayersViewport class="scrollpicker-scroller">
      <IssuesScroller
        :config="config"
        @selected="state.selectedIndex = $event"
        @scrollstart="state.isScrolling = true"
        @scrollend="state.isScrolling = false"
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
    <DownloadButton
      :visible="!state.isScrolling"
      :url="downloadUrl"
      class="scrollpicker-downloadbutton"
    >
      {{ config.downloadButtonText }}
    </DownloadButton>
  </div>
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
  DownloadButton,
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
    DownloadButton,
  },
  setup(props) {
    const issuesScrollerElemRef = ref(null as any)
    const state = reactive({
      selectedIndex: 0,
      isScrolling: false,
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

    const downloadUrl = computed(
      () => props.config!.issues[state.selectedIndex].downloadUrl,
    )

    return {
      state,
      showPrevButton,
      showNextButton,
      issuesScrollerElemRef,
      selectPrev,
      selectNext,
      downloadUrl,
    }
  },
})
</script>

<style scoped>
.scrollpicker-supertitle {
  margin-bottom: 0.5rem;
}

.scrollpicker-downloadbutton {
  margin-top: 0.5rem;
}

.ab-next {
  margin-right: -1rem;
}

.ab-prev {
  margin-left: -1rem;
}
</style>
