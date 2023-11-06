export enum ConfigOptions {
  DEFAULT_MIME_TYPE = 'video/webm; codecs=vp9', //默认的MIME格式
  VIDEO_SELECTOR_NAME = '#video'
}

export interface mediaOptionType {
  audio: Boolean
  video: Boolean
}

export interface RecordOptions {
  type?: string
  mediaOption?: mediaOptionType
  mimeType?: string
  videoSelectorName?: string
  fileName?: string
  // ondataavailable: function(blob) {},
}

// inactive: has not been started or it has been stopped.
//recording: Recording has been started and the UA is capturing data.
//paused：Recording has been started, then paused, and not yet stopped or resumed.
//文档：https://w3c.github.io/mediacapture-record/#dom-mediarecorder-state
// export enum RecordingState {
//   'inactive',
//   'recording',
//   'paused'
// }

export enum RecordingState {
  RECORDING = 'recording', // 录制中
  INACTIVE = 'inactive', // 未录制
  STOPPED = 'stopped', //停止录制
  PAUSED = 'paused' //暂停录制
  // destroyed
}

export const mimeType = [
  'video/webm',
  'audio/webm',
  'video/webm;codecs=vp8',
  'video/webm;codecs=daala',
  'video/webm;codecs=h264',
  'audio/webm;codecs=opus',
  'video/mpeg'
]
