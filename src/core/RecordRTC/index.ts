import { type IRecordOptions, ERecordingState, EMimeTypeList } from './types'
import {
  DOWN_LOAD_FILE_NAME,
  FILE_SUFFIX,
  TIME_SLICE,
  VIDEO_SELECTOR_NAME,
  DEFAULT_BITS_PER_SECOND
} from './constants'

// const eventList = ['error', 'pause', 'resume', 'start', 'stop', 'dataavailable']
const eventList = ['error']

enum EEventNameList {
  error,
  pause,
  resume,
  start,
  stop
}

/**
 * 1、未开始录制，暂停、继续、结束、播放、重置、下载都没法触发（给相关提示）
 * 2、结束录制后，暂停和继续录制功能将没法触发（提示已经结束录制）
 */
export class RecordRTC {
  config!: IRecordOptions
  recordRTC: MediaRecorder | null | undefined
  blobs: Blob[] | any
  state: string | undefined
  stream: MediaStream | null
  constructor(config: IRecordOptions) {
    this.blobs = [] //当前录制的流
    this.state = '' //当前录制状态
    this.stream = null
    this.init(config) //videoBitsPerSecond
  }
  //初始化
  private init(config: IRecordOptions) {
    this.MergeConfig(config, this.defaultConfig())
    this.createEle() //初始化视频元素
  }
  //获取默认配置项
  private defaultConfig() {
    return {
      type: 'video', // audio, video, canvas, gif
      selectorName: VIDEO_SELECTOR_NAME, //加载元素的盒子的选择器名称
      fileName: DOWN_LOAD_FILE_NAME, //下载的文件名称
      fileSuffix: FILE_SUFFIX, //下载的文件类型
      timeslice: TIME_SLICE, //记录到每个Blob中的毫秒数。如果不包括此参数，则整个媒体持续时间将记录到一个Blob中
      // recorderType: MediaStreamRecorder, //后续扩展类型
      mimeType: this.getMimeType(EMimeTypeList.VIDEO_WEBM_VP9),
      bitsPerSecond: DEFAULT_BITS_PER_SECOND, //音视视频的比特率
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ondataavailable: (blobs: Blob[]) => {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onInterruptRecording: (stream: MediaStream) => {} //监听该媒体流中找到的第一个视轨的ended事件
    }
  }
  //合并配置项
  private MergeConfig(config: IRecordOptions, defaultConfig: IRecordOptions) {
    this.config = {
      ...defaultConfig,
      ...config,
      ...(config.mimeType ? { mimeType: this.getMimeType(config.mimeType) } : {})
    }
  }
  // 开始录制
  async start() {
    if (!this.recordRTC) {
      try {
        const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(
          this.getConstraints(this.config.type)
        )
        this.recordRTC = new MediaRecorder(mediaStream, this.config) //当前录制屏幕的媒体流
        this.stream = this.recordRTC.stream
        // type FilterOutReadonly<T> = { -readonly [K in keyof T]: T[K] }
        type FilterOutReadonly<T> = {
          [K in keyof T as T[K] extends { readonly [P in keyof T[K]]: T[K][P] } ? never : K]: T[K]
        }
        eventList.forEach((item) => {
          type name = `onerror`
          type a = FilterOutReadonly<MediaRecorder>
          type UnionType = keyof a
          type ExtractedType = Extract<UnionType, name>
          const filterName = `on${item}` as ExtractedType
          this.recordRTC![filterName] = this[filterName].bind(this)
        })
        // this.recordRTC!['onerror'] = this['onerror'].bind(this)
        // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
        // this.recordRTC.ondataavailable = this.ondataavailable.bind(this)
        // 监听该媒体流中找到的第一个视轨的ended事件
        this.onInterruptRecording(mediaStream)
        this.recordRTC?.start(this.config.timeslice) //开始录制
        this.setState = ERecordingState.RECORDING //设置当前录制状态
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
      this.warningLog()
      return
    }
    if (this.state === ERecordingState.STOPPED) {
      throw '已经结束录制~'
    }
    this.recordRTC?.pause()
    this.setState = ERecordingState.PAUSED //修改状态
  }
  // 继续录制
  resume() {
    if (!this.recordRTC) {
      this.warningLog()
      return
    }
    if (this.state === ERecordingState.STOPPED) {
      throw '已经结束录制~'
    }
    this.recordRTC?.resume()
    this.setState = ERecordingState.RECORDING
  }
  // 停止录制
  stop(callback?: (arg: MediaRecorder | null | undefined) => void) {
    callback = callback || function () {}
    if (!this.recordRTC) {
      this.warningLog()
      return
    }
    if (!this.recordRTC) {
      throw '没有需要停止的录制视频'
    }
    this.recordRTC.stop()
    setTimeout(() => {
      callback && callback(this.recordRTC)
    }, 1000)
    this.setState = ERecordingState.STOPPED
  }

  // 播放录制
  replay() {
    if (!this.recordRTC) {
      this.warningLog()
      return
    }
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    const { type = 'video' } = this.config
    const element = document.querySelector(type) as HTMLVideoElement
    const url = this.getVideoUrl()
    element.src = url
    element.play()
  }
  //保存录制
  save() {
    if (!this.recordRTC) {
      this.warningLog()
      return
    }
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    const { fileName, fileSuffix } = this.config
    const url = this.getVideoUrl()
    const a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = `${fileName}.${fileSuffix}`
    a.click()
  }
  //重置
  reset() {
    if (!this.recordRTC) {
      this.warningLog()
      return
    }
    //如果正在录制中
    if (this.state === ERecordingState.RECORDING) {
      throw '请先停止当前录制~'
    }
    this.blobs = []
    this.recordRTC = null
    const { type = 'video' } = this.config
    const element = document.querySelector(type) as HTMLElement & HTMLVideoElement
    if (type === 'video') {
      element.src = ''
    }
    this.setState = ERecordingState.INACTIVE
  }
  //销毁事件
  destroy() {
    this.reset()
    this.removeEle()
    this.setState = ERecordingState.DESTROYED
  }
  //获取视频地址
  getVideoUrl() {
    const blob = new Blob(this.blobs, {
      type: this.getMimeType(this.config.mimeType!)
    })
    const url = URL.createObjectURL(blob)
    return url
  }

  //MediaRecorder 将媒体数据传递到你的应用程序以供使用时，将触发该事件
  ondataavailable(e: BlobEvent) {
    this.blobs.push(e.data)
    this.config.ondataavailable!(this.blobs)
  }
  onerror(ev: Event) {
    console.log(ev, '==e: BlobEvent')
  }
  onpause(ev: Event) {
    console.log(ev, '==e: Event')
  }
  onresume(ev: Event) {
    console.log(ev, '==e: Event')
  }
  onstart(ev: Event) {
    console.log(ev, '==e: Event')
  }
  onstop(ev: Event) {
    console.log(ev, '==e: Event')
  }
  //中断录制
  onInterruptRecording(stream: MediaStream) {
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      this.config.onInterruptRecording!(stream)
      throw '用户中断了屏幕共享~~~'
    })
  }
  onEvents() {}
  //获取当前录制的流
  get getBlob() {
    if (!this.recordRTC) {
      return
    }
    return this.blobs
  }
  //设置当前录制状态
  set setState(state: string) {
    this.state = state
  }
  //获取当前录制状态
  get getState() {
    if (!this.recordRTC) {
      return
    }
    return this.state
  }
  //获取获取流的时候传入的constraints参数
  private getConstraints(type: string = 'video') {
    const isVideo = type === 'video'
    const options = {
      audio: !isVideo,
      video: isVideo
    }
    return options
  }
  private warningLog() {
    const { type = 'video' } = this.config
    const WARNING = 'recorder已经销毁，或者 ' + type + '“ recorder没有调用开始录制的方法”'
    console.warn(WARNING)
  }
  //获取被客户端录制的 MIME 格式
  private getMimeType(type: string) {
    return MediaRecorder.isTypeSupported(type) ? type : EMimeTypeList.VIDEO_WEBM_VP9
  }
  //创建元素
  private createEle() {
    const { type = 'video' } = this.config
    const selectorName = this.config.selectorName as string
    const wrap = document.querySelector(selectorName) as HTMLElement
    const element = document.createElement(type) as HTMLElement
    wrap.appendChild(element)
  }
  //移除元素
  private removeEle() {
    const { type = 'video' } = this.config
    const selectorName = this.config.selectorName as string
    const wrap = document.querySelector(selectorName) as HTMLElement
    const element = document.querySelector(type) as HTMLElement
    wrap.removeChild(element)
  }
}
