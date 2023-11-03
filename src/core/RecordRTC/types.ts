export enum ConfigOptions {
  DEFAULT_MIME_TYPE = 'video/webm; codecs=vp9', //默认的MIME格式
  VIDEO_SELECTOR_NAME = '#video'
}

export interface mediaOptionType {
  audio: Boolean
  video: Boolean
}

export interface RecordOptions {
  mediaOption?: mediaOptionType
  mimeType?: string
  videoSelectorName?: string
  downLoadFileName?: string
  // ondataavailable: function(blob) {},
}

