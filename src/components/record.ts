interface mediaOptionType {
  audio: Boolean
  video: Boolean
}

interface RecordOptions {
  blobs: Blob[]
  mediaOption?: mediaOptionType
  mimeType?: string
  videoSelectorName?: string
  downLoadFileName?: string
}

interface PromInfoType {
  data: number
}

const DEFAULT_MIME_TYPE = 'video/webm; codecs=vp9' //默认的MIME格式
const VIDEO_SELECTOR_NAME = '#video'
const DOWN_LOAD_FILE_NAME = `录屏_${Date.now()}`
const MEDIA_OPTION = {
  audio: false,
  video: true
}

const getMimeType = (type: string) => {
  return MediaRecorder.isTypeSupported(type) ? type : 'video/webm'
}
const warningLog = (msg: any, callback: (arg0: any) => void) => {
  console.log('请先初始化')
  callback(msg)
}

export class RecordScreen<T extends RecordOptions> {
  mediaRecorder: MediaRecorder | null
  config: T

  constructor(mediaRecorder: null | MediaRecorder, config: T) {
    this.mediaRecorder = mediaRecorder //当前录制屏幕的媒体流
    this.config = config
  }
  //初始化
  async init() {
    const mediaOption = this.config.mediaOption || MEDIA_OPTION
    const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia(mediaOption)
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: getMimeType(this.config.mimeType || DEFAULT_MIME_TYPE)
    })
    // dataavailable当 MediaRecorder 将媒体数据传递到你的应用程序以供使用时，将触发该事件
    this.mediaRecorder.ondataavailable = this.ondataavailable.bind(this)
    // 监听该媒体流中找到的第一个视轨的ended事件
    this.onEnd(stream)
    // 500是每隔500ms进行一个保存数据

    console.log(this.mediaRecorder, '=== this.mediaRecorder ')
  }
  // 开始录制
  async onStart() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<string | void>(async (resolve, reject) => {
      try {
        console.log(this.mediaRecorder, '==this.mediaRecorder')
        if (!this.mediaRecorder) {
          await this.init()
          resolve()
        } else {
          console.log('正在录制中，是否放弃当前录制，重新录制~~~')
          // reject('正在录制中，是否放弃当前录制，重新录制~~~')
        }
        this.mediaRecorder?.start(500)
      } catch (e) {
        reject(`屏幕共享失败->${e}`)
      }
    })
  }
  // 暂停录制
  onPause() {
    return new Promise<void>((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject()
        return
      }
      this.mediaRecorder?.pause()
      resolve()
    })
  }
  // 继续录制
  onResume() {
    return new Promise<void>((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject()
        return
      }
      this.mediaRecorder?.resume()
      resolve()
    })
  }
  // 停止录制
  onStop() {
    return new Promise<void>((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject()
        return
      }
      this.mediaRecorder?.stop()
      resolve()
    })
  }
  // // 停止录制
  // onStop(callback) {
  //   callback = callback || function () {}
  //   if (!this.mediaRecorder) {
  //     warningLog()
  //     return
  //   }
  //   state.mediaRecorder?.stop()
  //   setTimeout(() => {
  //     callback(this.mediaRecorder)
  //   }, 1000)
  // }
  // 播放录制
  onReplay() {
    const selectorName = this.config.videoSelectorName || VIDEO_SELECTOR_NAME
    const video = document.querySelector(selectorName) as HTMLVideoElement
    if (this.config.blobs.length === 0) {
      console.log('没有录制文件')
      return
    }
    const url = this.getVideoUrl()
    video.src = url
    video.play()
  }
  //下载录制
  onDownload() {
    if (!this.config.blobs.length) {
      console.log('没有录制文件')
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
  }
  //重置
  onReset() {
    const selectorName = this.config.videoSelectorName || VIDEO_SELECTOR_NAME
    this.config.blobs = []
    this.mediaRecorder = null
    const video = document.querySelector(selectorName) as HTMLVideoElement
    video.src = ''
  }
  //获取当前录制的流
  getBlob() {
    return this.config.blobs
  }
  //获取视频地址
  getVideoUrl() {
    const blob = new Blob(this.config.blobs, { type: this.config.mimeType || DEFAULT_MIME_TYPE })
    const url = URL.createObjectURL(blob)
    return url
  }
  ondataavailable(e: BlobEvent) {
    this.config.blobs.push(e.data)
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
// var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") ?"video/webm; codecs=vp9" :"video/webm";
// var mediaRecorder = new MediaRecorder(stream, {mimeType: mime});
// //录制
// var chunks = [];
// mediaRecorder.addEventListener('dataavailable', function(e) {
// chunks.push(e.data)
// })
// //停止
// mediaRecorder.addEventListener('stop', function(){
// var blob = new Blob(chunks, {type: chunks[0].type});
// var url = URL.createObjectURL(blob);
// var a = document.createElement('a');
// a.href = url;
// a.download = 'video.webm';
// a.click();
// })
// //手动启动
// mediaRecorder.start()
// });
