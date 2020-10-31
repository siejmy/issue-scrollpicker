<template>
  <IssueCover v-for="(issue, index) in issues" :key="index" :issue="issue" />
</template>

<script lang="ts">
import { Issue } from '@/domain'
import { computed, defineComponent, PropType } from 'vue'
import IssueCover from './IssueCover.vue'

export default defineComponent({
  props: {
    issues: Object as PropType<Issue[]>,
  },
  components: {
    IssueCover,
  },
})
</script>

<style scoped></style>
