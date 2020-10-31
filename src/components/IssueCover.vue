<template>
  <div>
    <img :src="coverImageUrl" :alt="title" />
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
div {
  display: inline-block;
  height: inherit;
}

div img {
  max-height: 100%;
  max-width: 100%;
}
</style>
