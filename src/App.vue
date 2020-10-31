<template>
  <LogoContainer :logo="logo" />
  <IssuesHorizontal :issues="issues" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { LogoContainer, IssuesHorizontal } from '@/components'
import { Configuration } from './domain'

export default defineComponent({
  name: 'App',
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    LogoContainer,
    IssuesHorizontal,
  },
  setup(props) {
    const logo = computed(() => props.config!.logo)
    const issues = computed(() => props.config!.issues)
    console.log(issues)

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
  height: 12rem;
}
</style>
