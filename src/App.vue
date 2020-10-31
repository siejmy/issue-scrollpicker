<template>
  <ScrollViewport>
    <LogoContainer :logo="logo" />
    <IssuesHorizontal :issues="issues" />
  </ScrollViewport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { LogoContainer, IssuesHorizontal, ScrollViewport } from '@/components'
import { Configuration } from './domain'

export default defineComponent({
  name: 'App',
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    LogoContainer,
    IssuesHorizontal,
    ScrollViewport,
  },
  setup(props) {
    const logo = computed(() => props.config!.logo)
    const issues = computed(() => props.config!.issues)

    return {
      logo,
      issues,
    }
  },
})
</script>

<style>
#app {
  width: 100%;
  height: 15rem;
}
</style>
