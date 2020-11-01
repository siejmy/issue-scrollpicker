<template>
  <SuperTitle :text="config.superTitle" />
  <LayersViewport>
    <IssuesScroller :config="config" />
    <EdgeFader />
  </LayersViewport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import {
  IssuesScroller,
  SuperTitle,
  LayersViewport,
  EdgeFader,
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
  },
})
</script>

<style>
#app {
  width: 90%;
  height: 18rem;
  margin: 0 auto;
}
</style>
