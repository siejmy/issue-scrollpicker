<template>
  <div class="see-more-block">
    <div class="shrinker">
      <a :href="url" v-html="text"></a>
    </div>
  </div>
</template>

<script lang="ts">
import { SeeMore } from '@/domain'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    seeMore: Object as PropType<SeeMore>,
  },
  setup(props) {
    const url = computed(() => props.seeMore!.url)
    const text = computed(() => props.seeMore!.text)

    return {
      url,
      text,
    }
  },
})
</script>

<style scoped>
.see-more-block {
  vertical-align: top;
  display: inline-block;
  height: inherit;
  width: 15rem;
}

.see-more-block .shrinker {
  height: inherit;
  display: inline-block;
  transform: translateZ(0) scale(0.8);
  backface-visibility: hidden;
  position: relative;
  vertical-align: middle;
}

.see-more-block a {
  box-sizing: border-box;
  height: inherit;
  display: flex;
  align-items: center;
  padding: 1.25rem;

  background: #777;
  color: white;

  font-size: 1.5em;
}

.see-more-block a:hover {
  text-decoration: none;
}

.see-more-block a strong {
  display: block;
}
</style>
