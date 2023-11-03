import { ConfigOptions, type RecordOptions } from './types'
import { MEDIA_OPTION, DOWN_LOAD_FILE_NAME } from './constants'

const getMimeType = (type: string) => {
  return MediaRecorder.isTypeSupported(type) ? type : 'video/webm'
}
export class RecordRTC {
  config: RecordOptions
  recordRTC: MediaRecorder | undefined | null
  blobs: Blob[] | any
  constructor(mediaStream: MediaStream, config: RecordOptions) {
    if (!mediaStream) {
      throw 'mediaStream 是必传的'
    }
    const mimeType = config.mimeType || ConfigOptions.DEFAULT_MIME_TYPE
    this.config = config || {
      type: 'video',
      mediaOption: MEDIA_OPTION,
      mimeType: getMimeType(mimeType)
    }
    this.init(mediaStream, config)
  }
  //初始化
  async init(mediaStream: MediaStream, config: RecordOptions) {
    this.recordRTC = new MediaRecorder(mediaStream, config) //当前录制屏幕的媒体流
    this.blobs = []
    // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
    this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
    // 监听该媒体流中找到的第一个视轨的ended事件
    this.onEnd(mediaStream)
  }
  // 开始录制
  async onStart() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<string | void>(async (resolve) => {
      // 500是每隔500ms进行一个保存数据
      this.recordRTC?.start(500)
      resolve()
    })
  }
  // 暂停录制
  onPause() {
    return new Promise<void>((resolve, reject) => {
      if (!this.recordRTC) {
        reject()
        return
      }
      this.recordRTC?.pause()
      resolve()
    })
  }
  // 继续录制
  onResume() {
    return new Promise<void>((resolve, reject) => {
      if (!this.recordRTC) {
        reject()
        return
      }
      this.recordRTC?.resume()
      resolve()
    })
  }
  // 停止录制
  onStop() {
    return new Promise<void>((resolve, reject) => {
      if (!this.recordRTC) {
        reject()
        return
      }
      this.recordRTC?.stop()
      resolve()
    })
  }

  // 播放录制
  onReplay() {
    return new Promise<void>((resolve, reject) => {
      if (!this.blobs.length) {
        console.log('没有录制文件')
        reject()
        return
      }
      const selectorName = this.config.videoSelectorName || ConfigOptions.VIDEO_SELECTOR_NAME
      const video = document.querySelector(selectorName) as HTMLVideoElement
      const url = this.getVideoUrl()
      video.src = url
      video.play()
      resolve()
    })
  }
  //下载录制
  onDownload() {
    return new Promise<void>((resolve, reject) => {
      if (!this.blobs.length) {
        console.log('没有录制文件')
        reject()
        return
      }
      const url = this.getVideoUrl()
      const a = document.createElement('a')
      a.href = url
      a.style.display = 'none'
      a.download = `${DOWN_LOAD_FILE_NAME || this.config.downLoadFileName}.webm`
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
      resolve()
    })
  }
  //重置
  onReset() {
    const selectorName = this.config.videoSelectorName || ConfigOptions.VIDEO_SELECTOR_NAME
    this.blobs = []
    this.recordRTC = null
    const video = document.querySelector(selectorName) as HTMLVideoElement
    video.src = ''
  }
  //获取当前录制的流
  getBlob() {
    return this.blobs
  }
  //获取视频地址
  getVideoUrl() {
    const blob = new Blob(this.blobs, {
      type: this.config.mimeType || ConfigOptions.DEFAULT_MIME_TYPE
    })
    const url = URL.createObjectURL(blob)
    return url
  }
  ondataavailable(e: BlobEvent) {
    this.blobs.push(e.data)
    // config.ondataavailable(blob)
  }
  onEnd(stream: MediaStream) {
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      console.log('用户中断了屏幕共享~~~')
      return
    })
  }
}

// var body = document.body;
// body.addEventListener("click",async function(){
// var stream = await navigator.mediaDevices.getDisplayMedia({video: true});
// var mime = recordRTC.isTypeSupported("video/webm; codecs=vp9") ?"video/webm; codecs=vp9" :"video/webm";
// var recordRTC = new recordRTC(stream, {mimeType: mime});
// //录制
// var chunks = [];
// recordRTC.addEventListener('dataavailable', function(e) {
// chunks.push(e.data)
// })
// //停止
// recordRTC.addEventListener('stop', function(){
// var blob = new Blob(chunks, {type: chunks[0].type});
// var url = URL.createObjectURL(blob);
// var a = document.createElement('a');
// a.href = url;
// a.download = 'video.webm';
// a.click();
// })
// //手动启动
// recordRTC.start()
// });
// setState() {
//   if (!this.recordRTC) {
//     return
//   }
//   this.recordRTC.state = state
// }
// // 停止录制
// onStop(callback) {
//   callback = callback || function () {}
//   if (!this.recordRTC) {
//     warningLog()
//     return
//   }
//   state.recordRTC?.stop()
//   setTimeout(() => {
//     callback(this.recordRTC)
//   }, 1000)
// }
