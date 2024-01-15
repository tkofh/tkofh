<template>
  <div>
    <canvas ref="canvas" @click="pause = !pause"/>
  </div>
</template>

<script lang="ts" setup>
import { createTicker } from 'tickloop'

const canvas = ref<HTMLCanvasElement>()
const pause = ref(false)
onMounted(() => {
  const { render } = createExperience(canvas.value!)

  const ticker = createTicker()
  ticker.add((time) => {
    if (pause.value) return
    render(time)
  })
})
</script>

<style>
canvas {
  width: 100dvi;
  height: 100dvb;
  display: block;
  background-color: black;
}
</style>
