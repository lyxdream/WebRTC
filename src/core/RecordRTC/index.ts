import { type IRecordOptions, ERecordingState, EMimeTypeList, TEventNameList } from './types'
import {
  DOWN_LOAD_FILE_NAME,
  FILE_SUFFIX,
  TIME_SLICE,
  ELEMENT_CLASS,
  DEFAULT_BITS_PER_SECOND,
  eventList
} from './constants'

/**
 * 1、未开始录制，暂停、继续、结束、播放、重置、下载都没法触发（给相关提示）
 * 2、结束录制后，暂停和继续录制功能将没法触发（提示已经结束录制），同时onstop监听事件也会触发
 * 3、重置内容之后，会结束录制，但是不会销毁当前实例，只有销毁事件才会销毁当前实例
 * 4、关闭自带的屏幕共享之后会触发onInterruptRecording和onstop事件
 * 5、开启录制的时候判断是否已经结束，已经结束录制再开始录制
 */
export class RecordRTC {
  config!: IRecordOptions
  recordRTC: MediaRecorder | undefined
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
      elementClass: ELEMENT_CLASS, //加载元素的盒子的选择器名称
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
    //如果已经结束录制或者未开始录制
    if (!this.recordRTC || this.getState == ERecordingState.STOPPED) {
      try {
        const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(
          this.getConstraints(this.config.type)
        )
        this.recordRTC = new MediaRecorder(mediaStream, this.config) //当前录制屏幕的媒体流
        this.stream = this.recordRTC.stream
        // dataavailable当 recordRTC 将媒体数据传递到你的应用程序以供使用时，将触发该事件
        eventList.forEach((item: TEventNameList) => {
          this.recordRTC![item] = this[item].bind(this) as any
        })
        // 监听该媒体流中找到的第一个视轨的ended事件
        this.onInterruptRecording(mediaStream)
        this.recordRTC?.start(this.config.timeslice) //开始录制
        this.setState = ERecordingState.RECORDING //设置当前录制状态
      } catch (e) {
        throw '屏幕共享失败.......' + e
      }
    } else {
      throw '当前有正在录制的视频.......'
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
    console.log(
      '%c 结束录制啦~~~~',
      'color: #ffffff; background: #409eff;border-radius: 10px; padding: 4px 10px;'
    )
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
    if (!this.blobs.length) {
      throw '没有录制文件'
    }
    this.blobs = []
    this.setState = ''
    this.stream = null
    const { type = 'video' } = this.config
    const element = document.querySelector(type) as HTMLElement & HTMLVideoElement
    if (type === 'video') {
      element.src = ''
    }
    this.setState = ERecordingState.INACTIVE
    this.stop()
    console.log(
      '%c 清空设置啦~~~~',
      'color: #ffffff; background: #409eff;border-radius: 10px; padding: 4px 10px;'
    )
  }
  //销毁事件
  destroy() {
    this.recordRTC = undefined
    this.reset()
    this.removeEle()
    this.setState = ERecordingState.DESTROYED
  }
  //获取视频地址
  getVideoUrl() {
    const blob = new Blob(this.blobs, {
      type: this.getMimeType(this.config.mimeType!)
    })
    console.log(blob, '==blob')
    const url = URL.createObjectURL(blob)
    return url
  }
  //监听开始事件
  onstart(ev: Event): any {
    const { onstart } = this.config
    if (typeof onstart === 'function') {
      this.config.onstart!(ev)
    }
  }
  //MediaRecorder 将媒体数据传递到你的应用程序以供使用时，将触发该事件
  ondataavailable(e: BlobEvent): any {
    this.blobs.push(e.data)
    const { ondataavailable } = this.config
    if (typeof ondataavailable === 'function') {
      this.config.ondataavailable!(this.blobs)
    }
  }
  //监听暂停事件
  onpause(ev: Event): any {
    const { onpause } = this.config
    if (typeof onpause === 'function') {
      this.config.onpause!(ev)
    }
  }
  //监听继续事件
  onresume(ev: Event): any {
    const { onresume } = this.config
    if (typeof onresume === 'function') {
      this.config.onresume!(ev)
    }
  }
  //监听结束事件
  onstop(ev: Event): any {
    const { onstop } = this.config
    this.stop()
    if (typeof onstop === 'function') {
      this.config.onstop!(ev)
    }
    console.log(
      '%c 结束录制啦 onstop~~~~',
      'color: #ffffff; background: #409eff;border-radius: 10px; padding: 4px 10px;'
    )
  }
  //监听当发生错误时，错误事件会被激发
  onerror(ev: Event): any {
    const { onerror } = this.config
    if (typeof onerror === 'function') {
      this.config.onerror!(ev)
    }
  }
  //中断录制
  onInterruptRecording(stream: MediaStream) {
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      this.config.onInterruptRecording!(stream)
      throw '用户中断了屏幕共享~~~'
    })
  }
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
    const elementClass = this.config.elementClass as string
    const wrap = document.querySelector(elementClass) as HTMLElement
    const element = document.createElement(type) as HTMLElement
    wrap.appendChild(element)
  }
  //移除元素
  private removeEle() {
    const { type = 'video' } = this.config
    const elementClass = this.config.elementClass as string
    const wrap = document.querySelector(elementClass) as HTMLElement
    const element = document.querySelector(type) as HTMLElement
    wrap.removeChild(element)
  }
}
