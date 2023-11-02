<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import multiavatar from '@multiavatar/multiavatar/esm'
import { FILTER_LIST, TAB_TYPE, PHOTO_STATUS } from '../constants/photoPicture.js'

const formParams = reactive({
  data: {
    videoInput: '',
    directionType: 1
  }, // 表单数据对象
  formList: {
    videoInput: {
      type: 'select',
      label: '切换设备',
      placeholder: '请选择',
      options: [] as MediaDeviceInfo[],
      optionValueKey: 'deviceId',
      optionLabelKey: 'label',
      onChange: (deviceId: string) => {
        handleDeviceChange(deviceId)
      }
    },
    directionType: {
      type: 'select',
      label: '切换方向',
      placeholder: '请选择',
      options: [
        { label: '前置摄像头', value: 1 },
        { label: '后置摄像头', value: 2 }
      ],
      optionValueKey: 'value',
      optionLabelKey: 'label',
      onChange: switchCamera
    }
  },
  labelColor: '#fff',
  inline: false
})

const state = reactive({
  devicesId: '',
  constraints: {
    audio: false,
    video: true
  } as MediaStreamConstraints
})

const imgList = ref<string[]>([])
//拍照之后得原图
const originalImg = ref('')
//当前tab的类型
const tabType = ref(TAB_TYPE.MODE)
//拍照的状态
const photoStatus = ref(PHOTO_STATUS.YES)

// 添加滤镜之后的图片
const imgUrl = computed(() => {
  return (item: any) => {
    return imgList.value.length !== 0 ? item : createAvatar(item)
  }
})

//滤镜照片列表
const photoList = computed(() => {
  return imgList.value.length !== 0 ? imgList.value : 11
})

//拍照中
const isTakePhoto = computed(() => {
  return photoStatus.value == PHOTO_STATUS.YES
})

// 获取所有音视频设备
async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  formParams.formList.videoInput.options = devices.filter((device) => device.kind === 'videoinput')
}

// 获取本地音视频流
async function getLocalStream(options: MediaStreamConstraints = state.constraints) {
  const stream = await navigator.mediaDevices.getUserMedia(options)
  playLocalStream(stream)
}

// 播放本地视频流
function playLocalStream(stream: MediaStream) {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  // 旧的浏览器可能没有 srcObject
  if ('srcObject' in videoEl) {
    videoEl.srcObject = stream
  } else {
    // 防止在新的浏览器里使用它，应为它已经不再支持了
    videoEl.src = window.URL.createObjectURL(stream)
  }
  // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。
  videoEl.addEventListener('loadedmetadata', () => {
    getDevicesId()
  })
}

//创建头像
function createAvatar(val: any) {
  const blob = new Blob([multiavatar(val + new Date().getTime())], {
    type: 'image/svg+xml;charset=utf-8'
  })
  const link = URL.createObjectURL(blob)
  return link
}

//选择滤镜
const selectFilter = () => {
  tabType.value = TAB_TYPE.FILTER
}

//修改滤镜
const changeFilter = (item: string) => {
  originalImg.value = item
}

// 重新拍照
const againPhoto = () => {
  photoStatus.value = PHOTO_STATUS.YES
  tabType.value = TAB_TYPE.MODE
  imgList.value = []
}
//选择模式
const selectMode = () => {
  tabType.value = TAB_TYPE.MODE
  const { directionType } = formParams.data
  formParams.data.directionType = directionType === 1 ? 2 : 1
  switchCamera(formParams.data.directionType)
}

// 切换前后摄像头
function switchCamera(val: number) {
  state.constraints.video = {
    // 强制切换前后摄像头     // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
    facingMode: { exact: val === 1 ? 'user' : 'environment' }
  }
  navigator.mediaDevices
    .getUserMedia(state.constraints)
    .then((stream) => {
      console.log('切换成功')
      playLocalStream(stream)
    })
    .catch((err) => {
      console.log('你的设备不支持切换前后摄像头')
    })
}

// 切换设备
const handleDeviceChange = (deviceId: string) => {
  state.constraints.video = {
    deviceId: { exact: deviceId }
  }
  getLocalStream()
}

// 拍照
const takePhoto = () => {
  photoStatus.value = PHOTO_STATUS.NO
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
  originalImg.value = canvas.toDataURL('image/png')
  for (let i = 0; i < FILTER_LIST.length; i++) {
    // 添加滤镜
    ctx.filter = FILTER_LIST[i]
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    imgList.value.push(canvas.toDataURL('image/png'))
  }
  tabType.value = TAB_TYPE.FILTER //切换到滤镜
}

//保存图片
const savePhoto = () => {
  handleDownload() //下载
  tabType.value = TAB_TYPE.MODE
}

//下载
const handleDownload = () => {
  const url = originalImg.value
  const a = document.createElement('a')
  a.href = url
  a.style.display = 'none'
  a.download = `照片_${Date.now()}.png`
  a.click()
}

// 获取当前的设备ID
const getDevicesId = () => {
  const videoEl = document.getElementById('localVideo') as any
  const currentDeviceId = videoEl!.srcObject.getVideoTracks()[0].getSettings().deviceId
  formParams.data.videoInput = currentDeviceId
  console.log('🚀🚀🚀 / currentDeviceId', currentDeviceId)
}

onMounted(() => {
  getDevices()
  getLocalStream({
    audio: false,
    // 强制使用前摄像头
    video: { facingMode: { exact: 'user' } }
  })
})
</script>
<template>
  <div class="webrtc-container">
    <div class="devices-wrap__content">
      <div class="localVideo__box">
        <video
          class="localVideo"
          v-show="isTakePhoto"
          id="localVideo"
          autoplay
          playsinline
          muted
        ></video>
        <div class="model__icon" v-show="isTakePhoto" @click="selectMode"></div>
        <img class="original-img" v-show="!isTakePhoto" :src="originalImg" alt="" />
      </div>
      <div class="devices-wrap__content__control">
        <div class="photo__icon" v-show="isTakePhoto" @click="takePhoto"></div>
        <div class="back__icon" v-show="!isTakePhoto" @click="againPhoto"></div>
        <div class="save__photo" v-show="!isTakePhoto" @click="savePhoto"></div>
        <div class="filter__icon" v-show="!isTakePhoto" @click="selectFilter"></div>
      </div>
      <div class="select__wrap">
        <!-- 模式 -->
        <div class="mode-select__wrap" v-if="tabType === TAB_TYPE.MODE">
          <el-form :model="formParams.data" :inline="formParams.inline" label-width="80px">
            <el-form-item
              v-for="(itemForm, key) in formParams.formList"
              :key="key"
              :prop="key.toString()"
              :label="itemForm.label"
            >
              <el-select
                v-if="itemForm.type === 'select'"
                v-model="formParams.data[key]"
                placeholder="请选择"
                @change="itemForm.onChange"
                clearable
              >
                <el-option
                  v-for="(option, index) in itemForm.options"
                  :key="index"
                  :label="option[itemForm.optionLabelKey || 'label']"
                  :value="option[itemForm.optionValueKey || 'value']"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <!-- 滤镜 -->
        <div class="filter-select__wrap" v-if="tabType === TAB_TYPE.FILTER">
          <div
            class="filter-select__wrap__item"
            v-for="item in photoList"
            :key="item"
            @click="changeFilter(item)"
          >
            <img :src="imgUrl(item)" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.webrtc-container {
  width: 375px;
  height: 700px;
  background-color: #000;
  border: 5px solid #ddd;
  border-radius: 50px;
  padding: 60px 20px;
  box-sizing: border-box;
  .devices-wrap__content {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .localVideo__box {
      width: 326px;
      height: 250px;
      box-sizing: border-box;
      position: relative;
      .model__icon {
        width: 30px;
        height: 30px;
        background: url('./../assets/photoPicture/mode_icon.png') no-repeat center;
        background-size: 100% auto;
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
    }
    .localVideo {
      width: 326px;
      height: 250px;
    }
    .original-img {
      width: 326px;
      height: 250px;
    }
    .devices-wrap__content__control {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0;
      .back__icon {
        width: 32px;
        height: 32px;
        background: url('./../assets/photoPicture/back_icon.png') no-repeat center;
        background-size: 100% auto;
        margin-right: 20px;
      }
      .photo__icon {
        width: 64px;
        height: 64px;
        background: url('./../assets/photoPicture/photo_icon.png') no-repeat center;
        background-size: 100% auto;
        margin-right: 20px;
      }
      .filter__icon {
        width: 40px;
        height: 40px;
        background: url('./../assets/photoPicture/filter_icon.png') no-repeat center;
        background-size: 100% auto;
      }
      .save__photo {
        width: 64px;
        height: 64px;
        background: url('./../assets/photoPicture/save_icon.png') no-repeat center;
        background-size: 100% auto;
        margin-right: 20px;
      }
    }
    .select__wrap {
      padding-top: 20px;
      height: 230px;
      overflow-y: auto;
      border-top: 2px solid #fd973f;
    }
    .filter-select__wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      padding: 20px;
      &__item {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        margin-bottom: 15px;
        &:nth-child(3n) {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>