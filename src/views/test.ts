// function getMimeType(type: MIME_TYPE_LIST) {
//   return MediaRecorder.isTypeSupported(type) ? type : MIME_TYPE_LIST.video
// }

// enum MIME_TYPE_LIST {
//   videoWebm = 'video/webm',
//   audioWebm = 'audio/webm',
//   videoWebmVp8 = 'video/webm;codecs=vp8',
//   videoWebmVp9 = 'video/webm;codecs=vp9',
//   videoWebmDaala = 'video/webm;codecs=daala',
//   videoWebmH264 = 'video/webm;codecs=h264',
//   audioWebmOpus = 'audio/webm;codecs=opus',
//   videoMpeg = 'video/mpeg'
// }

// // getMimeType(MIME_TYPE_LIST.video)

// enum Gender{
//   GIRL,
//   BOY
// }
// console.log(`李雷是${Gender.BOY}`);
// console.log(`韩梅梅是${Gender.GIRL}`);

// enum Week{
//   MONDAY=1,
//   TUESDAY=2
// }
// console.log(`今天是星期${Week.MONDAY}`);

// type UnionType = string | number;

// type ExtractedType = Extract<UnionType, string>;

enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}

// Get an array of all enum values
const colors = Object.values(Color)

// Loop through the enum values
for (const color of colors) {
  console.log(color)
}

class Test {
  recordRTC: MediaRecorder | null | undefined
  constructor() {
    const eventList: b[] = ['onerror', 'ondataavailable']
    type b = 'onerror' | 'ondataavailable'
    eventList.forEach((item: b) => {
      this.recordRTC![item] = this[item].bind(this) as any
    })
  }

  onerror(ev: Event): any {}
  ondataavailable(ev: BlobEvent): any {}
}

const a = new Test()

// 不能将类型“((ev: Event) => any) | ((ev: BlobEvent) => any)”分配给类型“(((this: MediaRecorder, ev: Event) => any) & ((this: MediaRecorder, ev: BlobEvent) => any)) | null”。

type T = 'a' | 'b'
type S = 'a' & 'b'
