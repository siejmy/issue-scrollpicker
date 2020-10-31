<template>
  <div class="logo-container">
    <div class="logo-shrinker">
      <a :href="linkUrl">
        <img :src="imageUrl" :alt="imageAlt" />
      </a>
    </div>
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
  margin-right: 3rem;
}

.logo-container .logo-shrinker {
  height: inherit;
  transform: scale(0.8);
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
