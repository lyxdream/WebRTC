import { ConfigOptions } from './../RecordRTC/types'
//错误报告
export function warningLog(config: { type?: string | undefined }) {
  const type = config?.type || 'video'
  const WARNING = 'recorder已经销毁，或者 ' + type + '“ recorder没有调用开始录制的方法”'
  console.warn(WARNING)
}

//获取获取流的时候传入的constraints参数
export function getConstraints(config: { type?: string | undefined }) {
  const type = config?.type || 'video'
  const isVideo = type === 'video'
  const options = {
    audio: !isVideo,
    video: isVideo
  }
  return options
}

//获取被客户端录制的 MIME 格式
export const getMimeType = (type?: string) => {
  type = type ? type : ConfigOptions.DEFAULT_MIME_TYPE
  // 判断其 MIME 格式能否被客户端录制
  return MediaRecorder.isTypeSupported(type) ? type : ConfigOptions.DEFAULT_MIME_TYPE
}
