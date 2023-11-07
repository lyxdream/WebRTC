<template>
  <div class="record-wrap">
    <div class="record-wrap__video__wrap">
      <video ref="playerRef" id="video"></video>
    </div>
    <div class="record-btn-wrap">
      <el-button type="primary" @click="handleStart">开启录制</el-button>
      <el-button type="warning" @click="handlePause">暂停录制</el-button>
      <el-button type="success" @click="handleResume">继续录制</el-button>
      <el-button type="danger" @click="handleStop">结束录制</el-button>
      <el-button type="primary" @click="handleReplay">播放录制</el-button>
      <el-button type="primary" @click="handleReset">重置内容</el-button>
      <el-button type="primary" @click="handleDownload">下载内容</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RecordRTC } from '../core/RecordRTC'
import { ref, reactive } from 'vue'
const playerRef = ref()
const state = reactive({
  mediaRecorder: {} as RecordRTC,
  blobs: [] as Blob[],
  stream: {} as MediaStream
})
state.mediaRecorder = new RecordRTC({})
// 开始录制
const handleStart = async () => {
  state.mediaRecorder.start()
}
// 暂停录制
const handlePause = () => {
  state.mediaRecorder.pause()
}
// 继续录制
const handleResume = () => {
  state.mediaRecorder.resume()
}
// 停止录制
const handleStop = () => {
  state.mediaRecorder.stop()
}
// 播放录制
const handleReplay = () => {
  state.mediaRecorder.replay()
}
//重置
const handleReset = () => {
  state.mediaRecorder.reset()
}
//下载录制
const handleDownload = () => {
  state.mediaRecorder.save()
}
</script>
<style lang="scss" scoped>
.record-wrap {
  .record-wrap__video__wrap {
    width: 600px;
    height: 400px;
    border: 1px solid #409eff;
    video {
      width: 100%;
      height: 100%;
    }
  }
}
.record-btn-wrap {
  margin-top: 30px;
  display: flex;
}
</style>



