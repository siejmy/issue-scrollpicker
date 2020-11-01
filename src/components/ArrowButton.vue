<template>
  <div
    :class="{
      'arrow-button': true,
      'ab-contentbox': true,
      'arrow-button-prev': type === 'prev',
      'arrow-button-next': type === 'next',
    }"
  >
    <div class="arr-icon-outercontainer ab-contentbox">
      <div class="arr-icon-innercontainer ab-contentbox" @click="$emit('arrowclick')">
        <span v-if="type === 'prev'" class="arr-icon-left ab-contentbox"></span>
        <span v-if="type === 'next'" class="arr-icon-right ab-contentbox"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent } from 'vue'

export default defineComponent({
  props: {
    type: String,
  },
})
</script>

<style scoped>
.ab-contentbox {
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
}
.arrow-button {
  display: flex;
  height: inherit;
  width: 3rem;
  position: absolute;
  top: 0;
  bottom: 0;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.arrow-button-prev {
  left: 0;
}

.arrow-button-next {
  right: 0;
}

.arr-icon-outercontainer {
  display: inline-block;
  vertical-align: middle;
}

.arr-icon-innercontainer {
  display: inline-block;
  border-radius: 50%;
}

.arr-icon-innercontainer:hover .arr-icon-left,
.arr-icon-innercontainer:hover .arr-icon-left::after {
  border-color: #3ace00;
}

.arr-icon-innercontainer:hover .arr-icon-right,
.arr-icon-innercontainer:hover .arr-icon-right::after {
  border-color: #3ace00;
}

/* Source:https://codepen.io/gin85cc/pen/jrOgRq */
.arr-icon-left {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid #999;
  border-radius: 50%;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  background: white;
}

.arr-icon-left:after {
  content: '';
  display: inline-block;
  margin-top: 0.525rem;
  margin-left: 0.3rem;
  width: 0.7rem;
  height: 0.7rem;
  border-top: 0.25rem solid #999;
  border-right: 0.25rem solid #999;
  -moz-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
}

.arr-icon-right {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid #999;
  border-radius: 50%;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  background: white;
}

.arr-icon-right:after {
  content: '';
  display: inline-block;
  margin-top: 0.525rem;
  margin-left: -0.3rem;
  width: 0.7rem;
  height: 0.7rem;
  border-top: 0.25rem solid #999;
  border-right: 0.25rem solid #999;
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
}
</style>
