<template>
  <div class="issue-cover">
    <div :class="{ 'cover-shrinker': true, 'cover-active': isActive }">
      <img :src="coverImageUrl" :alt="title" @click="imageClicked" />
      <div
        :class="{ 'download-arrow-overlay': true, active: state.overlayActive }"
      >
        Kliknij przycisk
        <span class="downarrow">&darr;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Issue } from '@/domain'
import { computed, defineComponent, PropType, reactive, watchEffect } from 'vue'

export default defineComponent({
  props: {
    issue: Object as PropType<Issue>,
    isActive: Boolean,
  },
  setup(props) {
    const title = computed(() => props.issue!.title)
    const coverImageUrl = computed(() => props.issue!.coverImageUrl)
    const downloadUrl = computed(() => props.issue!.downloadUrl)
    const state = reactive({
      overlayActive: false,
    })

    watchEffect(() => {
      if (!props.isActive) {
        state.overlayActive = false
      }
    })

    function activeClicked() {
      console.log('Active clicked')
      state.overlayActive = true
    }

    function imageClicked() {
      if (props.isActive) {
        activeClicked()
      }
    }

    return {
      title,
      coverImageUrl,
      downloadUrl,
      imageClicked,
      state,
    }
  },
})
</script>

<style scoped>
.issue-cover {
  display: inline-block;
  height: inherit;
}

.cover-shrinker {
  height: inherit;
  transition: all 0.15s;
  transform: scale(0.8);
  position: relative;
}

.download-arrow-overlay {
  background: white;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.5rem;
  text-align: center;
}

.download-arrow-overlay .downarrow {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  line-height: 90%;
}

.download-arrow-overlay.active {
  opacity: 0.75;
}

.cover-shrinker.cover-active {
  transform: scale(1);
}

.issue-cover img {
  max-height: 100%;
  max-width: 100%;
}
</style>
