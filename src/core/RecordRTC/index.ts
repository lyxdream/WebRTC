import { ConfigOptions, type RecordOptions, RecordingState } from './types'
import { MEDIA_OPTION, DOWN_LOAD_FILE_NAME } from './constants'

const getMimeType = (type: string) => {
  return MediaRecorder.isTypeSupported(type) ? type : 'video/webm'
}

export class RecordRTC {
  config: RecordOptions
  recordRTC: MediaRecorder | undefined | null
  blobs: Blob[] | any
  state: string
  constructor(config: RecordOptions) {
    const mimeType = config.mimeType || ConfigOptions.DEFAULT_MIME_TYPE
    this.config = {
      type: 'video',
      mediaOption: MEDIA_OPTION,
      mimeType: getMimeType(mimeType),
      fileName: DOWN_LOAD_FILE_NAME,
      ...config
      // recorderType: MediaStreamRecorder,
    }
    this.blobs = []
    this.state = '' //当前状态
    // this.init(mediaStream, config)
  }
  //初始化
  private async init(mediaStream: MediaStream, config: RecordOptions) {
    if (!mediaStream) {
      throw 'mediaStream 是必传的'
    }
    this.recordRTC = new MediaRecorder(mediaStream, config) //当前录制屏幕的媒体流
    // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
    this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
    // 监听该媒体流中找到的第一个视轨的ended事件
    this.onEnd(mediaStream)
    this.setState(RecordingState.RECORDING)
  }
  // 开始录制
  async startRecording() {
    const options = {
      audio: false,
      video: true
    }
    try {
      const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(options)
      this.recordRTC = new MediaRecorder(mediaStream, this.config) //当前录制屏幕的媒体流
      // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
      this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
      // 监听该媒体流中找到的第一个视轨的ended事件
      this.onEnd(mediaStream)
      this.setState(RecordingState.RECORDING)
      this.recordRTC?.start(500)
    } catch (e) {
      console.log('屏幕共享失败')
    }
    // this.recordRTC = new MediaRecorder(mediaStream, config) //当前录制屏幕的媒体流
    // // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
    // this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
    // // 监听该媒体流中找到的第一个视轨的ended事件
    // this.onEnd(mediaStream)
    // this.setState(RecordingState.RECORDING)
  }
  // 暂停录制
  pauseRecording() {
    if (!this.recordRTC) {
      return
    }
    this.recordRTC?.pause()
    this.setState(RecordingState.PAUSED) //修改状态
  }
  // 继续录制
  resumeRecording() {
    if (!this.recordRTC) {
      return
    }
    this.recordRTC?.resume()
    this.setState(RecordingState.RECORDING)
  }
  // 停止录制
  stopRecording(callback?: (arg: MediaRecorder | null | undefined) => void) {
    callback = callback || function () {}
    if (!this.recordRTC) {
      throw '没有需要停止的录制视频'
      return
    }
    this.recordRTC?.stop()
    setTimeout(() => {
      callback && callback(this.recordRTC)
    }, 1000)
    this.setState(RecordingState.STOPPED)
  }

  // 播放录制
  replayRecording() {
    console.log(this.recordRTC?.state, '==mediaRecorder.state')
    if (!this.blobs.length) {
      throw '没有录制文件'
      return
    }
    const selectorName = this.config.videoSelectorName || ConfigOptions.VIDEO_SELECTOR_NAME
    const video = document.querySelector(selectorName) as HTMLVideoElement
    const url = this.getVideoUrl()
    video.src = url
    video.play()
  }
  //下载录制
  save() {
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    const url = this.getVideoUrl()
    const a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = `${this.config.fileName}.webm`
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }
  //重置
  reset() {
    //如果正在录制中
    if (this.state === RecordingState.RECORDING) {
      throw '请先停止当前录制~'
    }
    this.blobs = []
    this.recordRTC = null
    const selectorName = this.config.videoSelectorName || ConfigOptions.VIDEO_SELECTOR_NAME
    const video = document.querySelector(selectorName) as HTMLVideoElement
    video.src = ''
    this.setState(RecordingState.INACTIVE)
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
      throw '用户中断了屏幕共享~~~'
    })
  }
  //获取当前录制的流
  getBlob() {
    // if (!mediaRecorder) {
    //   return
    // }
    return this.blobs
  }
  setState(state: string) {
    if (!this) {
      return
    }
    this.state = state
  }
  getState() {
    if (!this) {
      return
    }
    return this.state
  }

  warningLog() {
    const WARNING =
      'It seems that recorder is destroyed or "startRecording" is not invoked for ' +
      this.config.type +
      ' recorder.'
    console.warn(WARNING)
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

//inactive    继续录制
//recording ==mediaRecorder.state
//index.ts:55 paused ==mediaRecorder.state
