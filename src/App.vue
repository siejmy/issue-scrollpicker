<template>
  <ScrollViewport :config="config" />
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
    ScrollViewport,
  },
})
</script>

<style>
#app {
  width: 100%;
  height: 18rem;
}
</style>
