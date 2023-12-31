import { TEventNameList } from './types'
export const DOWN_LOAD_FILE_NAME = `录屏_${Date.now()}` //下载文件的名称
export const FILE_SUFFIX = 'webm' //下载文件的后缀
export const TIME_SLICE = 500 //记录到每个Blob中的毫秒数
export const ELEMENT_CLASS = '.video-wrap'
export const DEFAULT_BITS_PER_SECOND = 2500000  //控制清晰度的
export const eventList: TEventNameList[] = [
  'onerror',
  'onpause',
  'onresume',
  'onstart',
  'onstop',
  'ondataavailable'
]
