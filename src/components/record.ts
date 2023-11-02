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

const DEFAULT_MIME_TYPE = 'video/webm; codecs=vp9' //默认的MIME格式
const VIDEO_SELECTOR_NAME = '#video'
const DOWN_LOAD_FILE_NAME = `录屏_${Date.now()}`

const mediaOption = {
  audio: false,
  video: true
}

const getMimeType = (type: string) => {
  return MediaRecorder.isTypeSupported(type) ? type : 'video/webm'
}
const warningLog = () => {
  console.log('请先初始化')
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
    if (!this.mediaRecorder) {
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia()
      // 监听该媒体流中找到的第一个视轨的ended事件
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('用户中断了屏幕共享~~~')
        return
      })
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: getMimeType(this.config.mimeType || DEFAULT_MIME_TYPE)
      })
      // dataavailable当 MediaRecorder 将媒体数据传递到你的应用程序以供使用时，将触发该事件
      this.mediaRecorder.ondataavailable = this.ondataavailable.bind(this)
    }
  }
  // 开始录制
  async onStart() {
    try {
      await this.init()
      // 500是每隔500ms进行一个保存数据
      this.mediaRecorder?.start(500)
    } catch (e) {
      console.log(`屏幕共享失败->${e}`)
    }
  }
  // 暂停录制
  onPause(callback) {
    callback = callback || function () {}
    if (!this.mediaRecorder) {
      warningLog()
      return
    }
    this.mediaRecorder?.pause()
    setTimeout(() => {
      callback(this.mediaRecorder)
    }, 1000)
  }
  // 继续录制
  onResume(callback) {
    callback = callback || function () {}
    if (!this.mediaRecorder) {
      warningLog()
      return
    }
    state.mediaRecorder?.resume()
  }
  // 停止录制
  onStop(callback) {
    callback = callback || function () {}
    if (!this.mediaRecorder) {
      warningLog()
      return
    }
    state.mediaRecorder?.stop()
    setTimeout(() => {
      callback(this.mediaRecorder)
    }, 1000)
  }
  // 播放录制
  onReplay() {
    const selectorName = this.config.videoSelectorName || VIDEO_SELECTOR_NAME
    const video = document.querySelector(selectorName) as HTMLVideoElement
    if (this.config.blobs.length === 0) {
      console.log('没有录制文件')
      return
    }
    video.src = this.getVideoUrl()
    video.play()
  }
  //下载录制
  handleDownload() {
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
  //获取当前录制的流
  getBlob() {
    return this.config.blobs
  }
  //获取视频地址
  getVideoUrl() {
    const blob = new Blob(state.blobs, { type: this.config.mimeType || DEFAULT_MIME_TYPE })
    const url = URL.createObjectURL(blob)
    return url
  }
  ondataavailable(e: BlobEvent) {
    this.config.blobs.push(e.data)
  }
}

const state = {
  mediaRecorder: null as null | MediaRecorder,
  blobs: [] as Blob[]
}
const record = new RecordScreen(state.mediaRecorder, { blobs: state.blobs })
