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


type UnionType = string | number;

type ExtractedType = Extract<UnionType, string>;