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
  onReplay: () => void
  onReset: () => void
  onDownload: () => void
}

import { RecordScreen } from './record'
import { ref, reactive } from 'vue'
const playerRef = ref()
const state = reactive({
  mediaRecorder: null as null | MediaRecorder,
  blobs: [] as Blob[],
  recordScreen: {} as mediaRecorderType,
})

//初始化
const initRecorder = () => {
  state.recordScreen = new RecordScreen(state.mediaRecorder, {
    blobs: state.blobs
  })
}
// 开始录制
const handleStart = async () => {
  if (!state.recordScreen) {
    initRecorder()
    console.log(state.recordScreen, '==state.recordScreen')
    state.recordScreen
      .onStart()
      .then(() => {})
      .catch((e) => {
        console.log(e)
      })
  } else {
    console.log('正在录制中，是否放弃当前录制，重新录制~~~')
  }

  //   const options = {
  //     audio: false,
  //     video: true
  //   }
  //   const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia(options)
  //   // 监听该媒体流中找到的第一个视轨的ended事件
  //   stream.getVideoTracks()[0].addEventListener('ended', () => {
  //     console.log('用户中断了屏幕共享~~~')
  //   })
  //   state.mediaRecorder = new MediaRecorder(stream, {
  //     mimeType: mimeType(DEFAULT_MIME_TYPE)
  //   })
  //   state.mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
  //     state.blobs.push(e.data)
  //   })
  //   // 500是每隔500ms进行一个保存数据
  //   state.mediaRecorder?.start(500)
  // } catch (e) {
  //   console.log(`屏幕共享失败->${e}`)
  // }
}
// 暂停录制
const handlePause = () => {
  state.recordScreen.onPause()
  // state.mediaRecorder?.pause()
}
// 继续录制
const handleResume = () => {
  state.recordScreen.onResume()
  // state.mediaRecorder?.resume()
}
// 停止录制
const handleStop = () => {
  // state.mediaRecorder?.stop()
  state.recordScreen
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
  state.recordScreen.onReplay()
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
  state.recordScreen.onReset()
}
//下载录制
const handleDownload = () => {
  state.recordScreen.onDownload()
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



