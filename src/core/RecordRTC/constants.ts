import { type mediaOptionType } from './types'
export const DOWN_LOAD_FILE_NAME = `录屏_${Date.now()}` //下载文件的名称
export const MEDIA_OPTION: mediaOptionType = {
  //获取媒体流时传入的配置
  audio: false,
  video: true
}
export const FILE_TYPE = 'webm' //下载文件的后缀
export const TIMESLICE = 500 //记录到每个Blob中的毫秒数
