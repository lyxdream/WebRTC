<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import multiavatar from '@multiavatar/multiavatar/esm'
import { FILTER_LIST } from './../constants/photoPicture.js'

const formParams = reactive({
  data: {
    videoInput: '',
    directionType: ''
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

const imgData = ref('')
const imgList = ref<string[]>([])
// 切换前后摄像头
function switchCamera(val: number) {
  state.constraints.video = {
    // 强制切换前后摄像头
    facingMode: { exact: val === 1 ? 'user' : 'environment' }
    // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
    // facingMode: val === 1 ? 'user' : 'environment',
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
function handleDeviceChange(deviceId: string) {
  state.constraints.video = {
    deviceId: { exact: deviceId }
  }
  getLocalStream()
}

// 获取当前的设备ID
const getDevicesId = () => {
  const videoEl = document.getElementById('localVideo') as any
  const currentDeviceId = videoEl!.srcObject.getVideoTracks()[0].getSettings().deviceId
  // console.log('🚀🚀🚀 / currentDeviceId', currentDeviceId)
}

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
  videoEl.srcObject = stream
  videoEl.addEventListener('loadedmetadata', () => {})
}

// 拍照
function takePhoto() {
  const videoEl = document.getElementById('localVideo') as HTMLVideoElement
  const canvas = document.createElement('canvas')
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
  // imgList.value.push(canvas.toDataURL('image/png'))
  for (let i = 0; i < FILTER_LIST.length; i++) {
    // 添加滤镜
    ctx.filter = FILTER_LIST[i]
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    imgList.value.push(canvas.toDataURL('image/png'))
  }
}

const imgUrl = computed(() => {
  return (item: any) => {
    return imgList.value.length !== 0 ? item : createAvatar(item)
  }
})

//照片列表
const photoList = computed(() => {
  return imgList.value.length !== 0 ? imgList.value : 11
})

function handleError(error: Error) {
  Error('error: ', error)
}

function createAvatar(val: any) {
  const blob = new Blob([multiavatar(val + new Date().getTime())], {
    type: 'image/svg+xml;charset=utf-8'
  })
  const link = URL.createObjectURL(blob)
  return link
}
const TAB_TYPE = {
  MODE: 1,
  FILTER: 2
}
const tabType = ref(TAB_TYPE.MODE)
const selectFilter = () => {
  tabType.value = TAB_TYPE.FILTER
}
const againPhoto = () => {}
const selectMode = () => {
  tabType.value = TAB_TYPE.MODE
}

onMounted(() => {
  getDevices()
  getLocalStream({
    audio: false,
    video: true
    // video: { facingMode: { exact: 'environment' } },
    // video: { facingMode: { exact: 'user' } },
  })
})
</script>
<template>
  <div class="webrtc-container">
    <div class="devices-wrap__content">
      <video class="localVideo" id="localVideo" autoplay playsinline muted></video>
      <div class="devices-wrap__content__control">
        <div class="back__icon" @click="againPhoto"></div>
        <div class="photo__icon" @click="takePhoto"></div>
        <div class="filter__icon" @click="selectFilter"></div>
        <div class="mode__icon" @click="selectMode"></div>
      </div>
      <div class="select__wrap">
        <!-- 模式 -->
        <div class="mode-select__wrap" v-if="tabType === TAB_TYPE.MODE">
          <el-form :model="formParams.data" :inline="formParams.inline" label-width="120px">
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
          <div class="filter-select__wrap__item" v-for="item in photoList" :key="item">
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
    .localVideo {
      width: 326px;
      max-height: 250px;
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
    }
    .select__wrap {
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