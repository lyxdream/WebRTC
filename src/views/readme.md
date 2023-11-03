


1. 背景：

在线教育类的产品中经常会遇到的一个场景就是实时显示学生的答题过程并且支持回溯，通常我们想到的做法就是通过记录坐标和重新绘制来达到产品的要求，再查看了相关资料后知道了Canvas元素的captureStream()API可以实时返回捕捉的画布，那我们就来了解一下这个API的使用吧。

2. 实现方案

MediaRecorder()
MediaRecorder() 构造函数会创建一个对指定的 MediaStream 进行录制的 MediaRecorder 对象
stream:MediaStream 将要录制的流。它可以是来自于使用 navigator.mediaDevices.getUserMedia() 创建的流或者来自于 <audio>, <video> 以及 <canvas>   DOM 元素, 电脑前置摄像头输入。

options:一个字典对象，它可以包含下列属性：
mimeType: 为新构建的 MediaRecorder 指定录制容器的 MIME 类型。在应用中通过调用 MediaRecorder.isTypeSupported() 来检查浏览器是否支持此种mimeType .

> 还有一点要注意的是我们这边录制视频的格式是webm， MP4格式的在目前最新chrome版本中暂不支持，可通过下面API查询支持情况
MediaRecorder.isTypeSupported('video/webm'); //true
MediaRecorder.isTypeSupported('video/mp4');//false


audioBitsPerSecond: 指定音频的比特率。
videoBitsPerSecond: 指定视频的比特率。
bitsPerSecond: 指定音频和视频的比特率。此属性可以用来指定上面两个属性。如果上面两个属性只有其中之一和此属性被指定，则此属性可以用于设定另外一个属性。


**MediaStream来源：**

1. <canvas>

找到canvas如下API，可用于从canvas中获取到我们需要的MediaStream

MediaStream = canvas.captureStream(frameRate);
关键API: HTMLCanvasElement.captureStream()
语法:
​​MediaStream = canvas.captureStream(frameRate);​​

CaptureStream方法基于WebRTC技术，它利用浏览器的媒体捕获能力，将音频或视频流捕获到一个可供应用程序访问的对象中。这个对象可以是一个MediaStream对象，也可以是一个MediaStreamTrack对象。

参数:
frameRate 帧捕获速率（FPS）
可选参数
未设置：画布更改时捕获新的一帧。
设置为0：捕获单个帧。
设置为25：每帧捕获速率25的双精度浮点值。
返回值：
MediaStream 对象

```js
//录制到的数据数据
letallChunks=[];
letcanvas=document.getElementById("canvasId");
letstream=canvas.captureStream(60); // 60 FPS recording
letrecorder=newMediaRecorder(stream, {
  mimeType: 'video/webm;codecs=vp9',
});
// canvas 录制回调
recorder.ondataavailable=e=>{
   allChunks.push(e.data);
}
recorder.start(10);
```

以上就走通了视频的录制过程：canvas —>MediaStream—>MediaRecord—>视频。整个录制的示例代码如下：




3、面试官：纯前端如何实现录屏并保存视频到本地？
https://juejin.cn/post/7280057907055869992?searchId=20231023150615B61C09D90770B98A9B45

2、分享一个canvas录屏的方案
https://zhuanlan.zhihu.com/p/71528138

3.Canvas实时回显和录制
https://blog.51cto.com/u_11711012/4934094





5、rrweb 实现原理介绍
https://juejin.cn/post/7223200148862746684


1、WebCodecs 
聊聊 WebCodecs 实现 GIF 视频转码
https://zhuanlan.zhihu.com/p/621796909




3、Cannot read property ‘getDisplayMedia‘ of undefined
https://blog.csdn.net/YX0711/article/details/128929704

4、学会如何实现视频虚拟背景\搭建一个 1v1 的 WebRTC 实时音视频通话\学会如何通过 WebRTC 实现拍照\学会如何分享屏幕，录制屏幕
https://juejin.cn/post/7151932832041058340

5、浅谈html2canvas实现浏览器截图的原理
https://blog.csdn.net/qq398577351/article/details/121975071

6、20行代码，实现屏幕录像
https://baijiahao.baidu.com/s?id=1749795359019071962&wfr=spider&for=pc

6、WebRTC 如何推送本地视频流
https://blog.csdn.net/yinshipin007/article/details/132368747

7、前端实现屏幕录制功能，并给后端发送视频流
https://blog.csdn.net/weixin_56455782/article/details/131203637

8、web录屏方案实现
https://www.jianshu.com/p/83beaf5be919

需要注意的是，WebRTC 只能在 HTTPS 协议或者 localhost 下使用，如果是 HTTP 协议，会报错。
我使用HTMLCanvasElement.captureStream()获取stream，并将其传递给MediaRecorder以将其写入.webm文件。

 是的，一般的 api 可以借助adapter来做一些简单的兼容，特殊的我们需要查看它的兼容情况使用


9、你不知道的 Blob
https://zhuanlan.zhihu.com/p/146577946


10、如何从零开始开发一套JS SDK？
https://www.zhihu.com/question/275752372/answer/3013892926


11、video标签遇到的问题
https://zhuanlan.zhihu.com/p/535917105?utm_id=0


https://juejin.cn/post/7151932832041058340
最后有一个需要注意的地方，也是我在实际项目中遇到的问题。截止到目前为止，在使用 MediaRecorder 录制视频的时候，如果你的系统是 Windows 或者 Chrome OS，那么录制的视频没什么问题，但是在 Mac 和 Linux 上，录制摄像头和分享屏幕时，选择网页的分享方式，所拿获得的媒体流是可以拿到视频轨道和音频轨道的，但是录制整个屏幕时，由于系统的限制，只能拿到视频的轨道。好在一般录屏都不会有带音频的需求，期待后面能够支持。



1、JS手写EventEmitter实现方式
https://blog.csdn.net/qq_37820580/article/details/114145812
https://www.npmjs.com/package/recordrtc
https://blog.csdn.net/weixin_42147968/article/details/127598726


https://blog.csdn.net/weixin_56455782/article/details/131203637
https://juejin.cn/post/7280057907055869992?searchId=20231023150615B61C09D90770B98A9B45
https://juejin.cn/post/7129763930779418654
https://juejin.cn/post/7280429214607769658
https://www.zhihu.com/question/275752372/answer/3013892926?utm_id=0
https://zhuanlan.zhihu.com/p/71528138
https://juejin.cn/post/7151932832041058340#heading-4