<template>
  <div class="logo-container">
    <a :href="linkUrl">
      <img :src="imageUrl" :alt="imageAlt" />
    </a>
  </div>
</template>

<script lang="ts">
import { Logo } from '@/domain'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    logo: Object as PropType<Logo>,
  },
  setup(props) {
    const linkUrl = computed(() => props.logo!.linkUrl)
    const imageUrl = computed(() => props.logo!.imageUrl)
    const imageAlt = computed(() => props.logo!.imageAlt)

    return {
      linkUrl,
      imageUrl,
      imageAlt,
    }
  },
})
</script>

<style scoped>
.logo-container {
  display: inline-block;
  height: inherit;
}

.logo-container a {
  height: inherit;
  display: inline-block;
}

.logo-container a img {
  max-height: 100%;
  max-width: 100%;
}
</style>
