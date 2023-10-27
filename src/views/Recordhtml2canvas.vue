<template>
  <div @click="handleStart">开启录制</div>
  <div @click="handleStop">停止录制</div>
  <div @click="handleReplay" data-html2canvas-ignore>播放录制</div>
  <img  v-if="state.visible" :src="state.imgs[state.num ?? 0]" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import html2canvas from 'html2canvas';

const state = reactive({
  visible: false,
  imgs: [] as string[], 
  num: 0,
  recordInterval: null as any,
  replayInterval: null as any
});

const FPS = 30;
const interval = 1000 / FPS;
const handleStart = async () => {
  handleReset();
  state.recordInterval = setInterval(() => {
    if (state.imgs.length > 100) {
      handleStop();
      return;
    }
    html2canvas(document.body).then((canvas: any) => {
      const img = canvas.toDataURL();
      state.imgs.push(img);
    });
    console.log(state.imgs,'==state.imgs')
  }, interval);
};

const handleStop = () => {
  state.recordInterval && clearInterval(state.recordInterval);
};

const handleReplay = async () => {
  handleStop()
  state.visible = true
  state.num = 0;
  state.replayInterval = setInterval(() => {
    if (state.num >= state.imgs.length - 1) {
      clearInterval(state.replayInterval);
      return;
    }
    state.num++;
  }, interval);
};

const handleReset = () => {
  state.imgs = [];
  state.recordInterval = null;
  state.replayInterval = null;
  state.num = 0;
  state.visible = false
};
</script>
