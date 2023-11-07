import { ConfigOptions, type RecordOptions, RecordingState } from './types'
import { DOWN_LOAD_FILE_NAME, FILE_TYPE, TIMESLICE } from './constants'
import { getConstraints, warningLog, getMimeType } from '../utils/recordRTC'

/**
 * 1、未开始录制，暂停、继续、结束、播放、重置、下载都没法触发（给相关提示）
 * 2、结束录制后，暂停和继续录制功能将没法触发（提示已经结束录制）
 */
export class RecordRTC {
  config!: RecordOptions
  recordRTC: MediaRecorder | undefined | null
  blobs: Blob[] | any
  state: string | undefined
  constructor(config: RecordOptions) {
    this.init(config)
  }
  //初始化
  init(config: RecordOptions) {
    this.config = {
      type: 'video', // audio, video, canvas, gif
      fileName: DOWN_LOAD_FILE_NAME, //下载的文件名称
      fileType: FILE_TYPE, //下载的文件类型
      timeslice: TIMESLICE, //记录到每个Blob中的毫秒数。如果不包括此参数，则整个媒体持续时间将记录到一个Blob中
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      dataavailable: (blobs: Blob[] | any) => {},
      ...config,
      mimeType: getMimeType(config.mimeType)
      // recorderType: MediaStreamRecorder, //后续扩展类型
    }
    this.blobs = [] //当前录制的流
    this.state = '' //当前录制状态
  }
  // 开始录制
  async start() {
    if (!this.recordRTC) {
      try {
        const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(
          getConstraints(this.config)
        )
        this.recordRTC = new MediaRecorder(mediaStream, this.config) //当前录制屏幕的媒体流
        // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
        this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
        // 监听该媒体流中找到的第一个视轨的ended事件
        this.interruptRecording(mediaStream)
        this.recordRTC?.start(this.config.timeslice) //开始录制
        this.setState(RecordingState.RECORDING) //设置当前录制状态
      } catch (e) {
        throw '屏幕共享失败.......' + e
      }
    } else {
      throw '当前正在录制中.......'
    }
  }
  // 暂停录制
  pause() {
    if (!this.recordRTC) {
      warningLog(this.config)
      return
    }
    if (this.state === RecordingState.STOPPED) {
      throw '已经结束录制~'
    }
    this.recordRTC?.pause()
    this.setState(RecordingState.PAUSED) //修改状态
  }
  // 继续录制
  resume() {
    if (!this.recordRTC) {
      warningLog(this.config)
      return
    }
    if (this.state === RecordingState.STOPPED) {
      throw '已经结束录制~'
    }
    this.recordRTC.resume()
    this.setState(RecordingState.RECORDING)
  }
  // 停止录制
  stop(callback?: (arg: MediaRecorder | null | undefined) => void) {
    callback = callback || function () {}
    if (!this.recordRTC) {
      warningLog(this.config)
      throw '没有需要停止的录制视频'
    }
    this.recordRTC.stop()
    setTimeout(() => {
      callback && callback(this.recordRTC)
    }, 1000)
    this.setState(RecordingState.STOPPED)
  }

  // 播放录制
  replay() {
    if (!this.recordRTC) {
      warningLog(this.config)
      return
    }
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    const selectorName = this.config.videoSelectorName || ConfigOptions.VIDEO_SELECTOR_NAME
    const video = document.querySelector(selectorName) as HTMLVideoElement
    const url = this.getVideoUrl()
    video.src = url
    video.play()
  }
  //保存录制
  save() {
    if (!this.recordRTC) {
      warningLog(this.config)
      return
    }
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    const { fileName, fileType } = this.config
    const url = this.getVideoUrl()
    const a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = `${fileName}.${fileType}`
    a.click()
  }
  //重置
  reset() {
    if (!this.recordRTC) {
      warningLog(this.config)
      return
    }
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
  //MediaRecorder 将媒体数据传递到你的应用程序以供使用时，将触发该事件
  ondataavailable(e: BlobEvent) {
    this.blobs.push(e.data)
    this.config.dataavailable!(this.blobs)
  }
  //中断录制
  interruptRecording(stream: MediaStream) {
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      throw '用户中断了屏幕共享~~~'
    })
  }
  //获取当前录制的流
  getBlob() {
    if (!this.recordRTC) {
      return
    }
    return this.blobs
  }
  //设置当前录制状态
  setState(state: string) {
    this.state = state
  }
  //获取当前录制状态
  getState() {
    if (!this.recordRTC) {
      return
    }
    return this.state
  }
}
