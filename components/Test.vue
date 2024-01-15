<template>
  <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">

  </svg>
</template>

<script lang="ts" setup>
import { Experience } from '~/lib/experience/Experience'
const experience = new Experience({
  grid: {
    x: 5,
    y: 5,
  },
  seed: 1,
})
console.log(experience)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
svg {
  display: block;
  width: 100dvi;
  height: 100dvb;
}
</style>
