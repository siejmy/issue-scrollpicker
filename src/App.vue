<template>
  <ScrollViewport>
    <LogoContainer :logo="logo" />
    <IssueCover v-for="(issue, index) in issues" :key="index" :issue="issue" />
    <SeeMoreBlock :see-more="seeMore" />
  </ScrollViewport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import {
  LogoContainer,
  IssueCover,
  ScrollViewport,
  SeeMoreBlock,
} from '@/components'
import { Configuration } from './domain'

export default defineComponent({
  name: 'App',
  props: {
    config: Object as PropType<Configuration>,
  },
  components: {
    LogoContainer,
    IssueCover,
    ScrollViewport,
    SeeMoreBlock,
  },
  setup(props) {
    const logo = computed(() => props.config!.logo)
    const issues = computed(() => props.config!.issues)
    const seeMore = computed(() => props.config!.seeMore)

    return {
      logo,
      issues,
      seeMore,
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
