export interface IRecordOptions {
  type?: string
  mimeType?: string
  selectorName?: string
  fileName?: string
  fileSuffix?: string
  timeslice?: number
  ondataavailable?: (blob: any) => void
}

export enum ERecordingState {
  RECORDING = 'recording', // 录制中
  INACTIVE = 'inactive', // 未录制
  STOPPED = 'stopped', //停止录制
  PAUSED = 'paused' //暂停录制
  // destroyed
}

// inactive: has not been started or it has been stopped.
//recording: Recording has been started and the UA is capturing data.
//paused：Recording has been started, then paused, and not yet stopped or resumed.
//文档：https://w3c.github.io/mediacapture-record/#dom-mediarecorder-state
// export enum ERecordingState {
//   'inactive',
//   'recording',
//   'paused'
// }
