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
interface mediaRecorderType {
  onStart: () => Promise<string | void>
  onPause: () => Promise<any>
  onResume: () => Promise<any>
  onStop: () => Promise<any>
  onReplay: () => Promise<any>
  onReset: () => void
  onDownload: () => Promise<any>
}

import { RecordRTC } from '../core/RecordRTC'
import { ref, reactive } from 'vue'
const playerRef = ref()
const state = reactive({
  mediaRecorder: {} as mediaRecorderType,
  blobs: [] as Blob[],
  stream: {} as MediaStream
})

// 开始录制
const handleStart = async () => {
  const options = {
    audio: false,
    video: true
  }
  if (Object.keys(state.stream).length > 0) {
    console.log('正在录制中，是否放弃当前录制，重新录制~~~')
  } else {
    try {
      state.stream = await navigator.mediaDevices.getDisplayMedia(options)
      state.mediaRecorder = new RecordRTC(state.stream, {})
      state.mediaRecorder
        .onStart()
        .then(() => {})
        .catch((e) => {
          console.log(e)
        })
    } catch (e) {
      console.log('屏幕共享失败')
    }
  }
}
// 暂停录制
const handlePause = () => {
  state.mediaRecorder.onPause()
}
// 继续录制
const handleResume = () => {
  state.mediaRecorder.onResume()
}
// 停止录制
const handleStop = () => {
  state.mediaRecorder
    .onStop()
    .then((res) => {
      console.log(res, '==onStop')
    })
    .catch((err) => {
      console.log(err, '==err')
    })
}
// 播放录制
const handleReplay = () => {
  state.mediaRecorder.onReplay()
  // const video = document.querySelector('#video') as HTMLVideoElement
  // if (state.blobs.length === 0 || !playerRef.value) {
  //   console.log('没有录制文件')
  //   return
  // }
  // const blob = new Blob(state.blobs, { type: 'video/webm' })
  // const url = URL.createObjectURL(blob)
  // console.log(url, '==url')
  // video.src = url
  // video.play()
}
//重置
const handleReset = () => {
  // state.blobs = []
  // state.mediaRecorder = null
  // playerRef.value.src = null
  state.mediaRecorder.onReset()
}
//下载录制
const handleDownload = () => {
  state.mediaRecorder.onDownload()
  // if (!state.blobs.length) {
  //   console.log('没有录制文件')
  //   return
  // }
  // const blob = new Blob(state.blobs, { type: 'video/webm' })
  // const url = URL.createObjectURL(blob)
  // const a = document.createElement('a')
  // a.href = url
  // a.style.display = 'none'
  // a.download = `录屏_${Date.now()}.webm`
  // a.click()
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



