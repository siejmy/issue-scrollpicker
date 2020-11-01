<template>
  <SuperTitle :text="config.superTitle" />
  <ScrollViewport :config="config" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ScrollViewport, SuperTitle } from '@/components'
import { Configuration } from './domain'

export default defineComponent({
  name: 'App',
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    ScrollViewport,
    SuperTitle,
  },
})
</script>

<style>
#app {
  width: 100%;
  height: 18rem;
}
</style>
