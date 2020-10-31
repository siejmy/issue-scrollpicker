<template>
  <div class="issue-cover">
    <div class="cover-shrinker">
      <img :src="coverImageUrl" :alt="title" />
    </div>
  </div>
</template>

<script lang="ts">
import { Issue } from '@/domain'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    issue: Object as PropType<Issue>,
  },
  setup(props) {
    const title = computed(() => props.issue!.title)
    const coverImageUrl = computed(() => props.issue!.coverImageUrl)
    const downloadUrl = computed(() => props.issue!.downloadUrl)

    return {
      title,
      coverImageUrl,
      downloadUrl,
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
  transform: scale(0.8);
}

.issue-cover img {
  max-height: 100%;
  max-width: 100%;
}
</style>
