export interface IRecordOptions {
  type?: string
  elementClass?: string
  fileName?: string
  fileSuffix?: string
  timeslice?: number
  mimeType?: string
  bitsPerSecond?: number
  onstart?: (ev: Event) => any
  ondataavailable?: (blobs: Blob[]) => any
  onpause?: (ev: Event) => any
  onresume?: (ev: Event) => any
  onstop?: (ev: Event) => any
  onerror?: (ev: Event) => any
  onInterruptRecording?: (stream: MediaStream) => void
}

export enum ERecordingState {
  RECORDING = 'recording', // 录制中
  INACTIVE = 'inactive', // 未录制
  STOPPED = 'stopped', //停止录制
  PAUSED = 'paused', //暂停录制
  DESTROYED = 'destroyed' //销毁事件
}

export enum EMimeTypeList {
  VIDEO_WEBM = 'video/webm',
  AUDIO_WEBM = 'audio/webm',
  VIDEO_WEBM_VP8 = 'video/webm;codecs=vp8',
  VIDEO_WEBM_VP9 = 'video/webm;codecs=vp9',
  VIDEO_WEBM_DAALA = 'video/webm;codecs=daala',
  VIDEO_WEBM_H264 = 'video/webm;codecs=h264',
  AUDIO_WEBM_OPUS = 'audio/webm;codecs=opus',
  VIDEO_MPEG = 'video/mpeg'
}

//绑定的事件类型
export type TEventNameList =
  | 'onerror'
  | 'onpause'
  | 'onresume'
  | 'onstart'
  | 'onstop'
  | 'ondataavailable'

// inactive: has not been started or it has been stopped.
//recording: Recording has been started and the UA is capturing data.
//paused：Recording has been started, then paused, and not yet stopped or resumed.
//文档：https://w3c.github.io/mediacapture-record/#dom-mediarecorder-state
// export enum ERecordingState {
//   'inactive',
//   'recording',
//   'paused'
// }
