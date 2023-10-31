//滤镜列表
export const FILTER_LIST = [
  'blur(5px)', // 模糊
  'brightness(0.5)', // 亮度
  'contrast(200%)', // 对比度
  'grayscale(100%)', // 灰度
  'hue-rotate(90deg)', // 色相旋转
  'invert(100%)', // 反色
  'opacity(90%)', // 透明度
  'opacity(80%)', // 透明度
  'saturate(200%)', // 饱和度
  'saturate(20%)', // 饱和度
  'sepia(100%)', // 褐色
  'drop-shadow(4px 4px 8px blue)' // 阴影
]

// tab类型
export const TAB_TYPE = {
  MODE: 1, //模式
  FILTER: 2, //滤镜
  SAVE: 3, //保存
  PHOTOGRAPH: 4, //拍照
  BACK: 5 //返回
}

// 是否拍照中状态
export const PHOTO_STATUS = {
  NO: 0,
  YES: 1
}
