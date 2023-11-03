<template>
  <div>
      <!-- <video id="localVideo" autoplay playsinline muted></video> -->
      <video ref="playerRef"></video>
      <button @click="handleStart">开启录制</button>
      <button @click="handlePause">暂停录制</button>
      <button @click="handleResume">继续录制</button>
      <button @click="handleStop">结束录制</button>
      <button @click="handleReplay">播放录制</button>
      <button @click="handleReset">重置内容</button>
      <button @click="handleDownload">下载内容</button>
      <!-- <button @click="handleCanvasRecord">CanvasRecord</button> -->
      <!-- <canvas id="canvasId"></canvas> -->
  </div>

</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';

const playerRef = ref();

const state = reactive({
  mediaRecorder: null as null | MediaRecorder,
  blobs: [] as Blob[],
});


const types = [
  "video/webm",
  "audio/webm",
  "video/webm;codecs=vp8",
  "video/webm;codecs=daala",
  "video/webm;codecs=h264",
  "audio/webm;codecs=opus",
  "video/mpeg",
];

const DEFAULT_MIME_TYPE = 'video/webm; codecs=vp9'  //默认的MIME格式

const mimeType = (type:string)=>{
  return MediaRecorder.isTypeSupported(type)?type:'video/webm'
}

// 开始录制
const handleStart = async () => {
  try {
    const stream:MediaStream = await navigator.mediaDevices.getDisplayMedia();
    // 监听该媒体流中找到的第一个视轨的ended事件
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      console.log('用户中断了屏幕共享~~~');
    })
    state.mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType(DEFAULT_MIME_TYPE)
    });
    state.mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
      state.blobs.push(e.data);
    });
    // 500是每隔500ms进行一个保存数据
    state.mediaRecorder?.start(500);

  }catch(e){
    console.log(`屏幕共享失败->${e}`);
  }
};
// 暂停录制
const handlePause = () => { state.mediaRecorder?.pause() };
// 继续录制
const handleResume = () => { state.mediaRecorder?.resume() };
// 停止录制
const handleStop = () => { state.mediaRecorder?.stop() };
// 播放录制
const handleReplay = () => {
  if (state.blobs.length === 0 || !playerRef.value) {
    console.log('没有录制文件');
    return
  };
  const blob = new Blob(state.blobs, { type: 'video/webm' });
  playerRef.value.src = URL.createObjectURL(blob);
  playerRef.value.play();
};
//重置
const handleReset = () => {
  state.blobs = [];
  state.mediaRecorder = null;
  playerRef.value.src = null;
};
//下载录制
const handleDownload = () => {
  if (!state.blobs.length){
    console.log('没有录制文件');
    return;
  };
  const blob = new Blob(state.blobs, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  a.download = `录屏_${Date.now()}.webm`;
  a.click();
};


const handleStart1 = async ()=>{


// let imageCapture;

// navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
//   document.querySelector("video").srcObject = mediaStream;

//   const track = mediaStream.getVideoTracks()[0];
//   imageCapture = new ImageCapture(track);

//   return imageCapture.getPhotoCapabilities();
// });



// 获取本地音视频流
async function getLocalStream(constraints: MediaStreamConstraints) {
// 获取媒体流
const stream = await navigator.mediaDevices.getUserMedia(constraints)
// 将媒体流设置到 video 标签上播放
playLocalStream(stream)
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
const videoEl = document.getElementById('localVideo') as HTMLVideoElement
videoEl.srcObject = stream
}

getLocalStream({
audio: false,
video: true,
})

}
// canvas录制(特殊处理)
// const handleCanvasRecord = () => {
//   interface CanvasElement extends HTMLCanvasElement {
//     captureStream(frameRate?: number): MediaStream;
//   }
//   const myCanvas = <CanvasElement> document.querySelector('canvas');
//   const stream = myCanvas.captureStream(25); // 60 FPS recording
//   console.log(stream,'==stream')
//   // const recorder = new MediaRecorder(stream, {
//   //   mimeType: 'video/webm;codecs=vp9',
//   // });
//   // // canvas 录制回调
//   // recorder.ondataavailable = (e) => {
//   //   state.blobs.push(e.data);
//   // };
//   // recorder.start(10);
//   state.mediaRecorder = new MediaRecorder(stream, {
//     mimeType: 'video/webm',
//   })

//   state.mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
//     console.log(e.data,'==e.data')
//     state.blobs.push(e.data);
//   })
//   state.mediaRecorder?.start();
//   // stream.getTracks().forEach((track) => pc.addTrack(track, stream));
// }

// let allChunks=[];

// // canvas 录制回调
// recorder.ondataavailable=e=>{
//    allChunks.push(e.data);
// }
// recorder.start(10);
</script>