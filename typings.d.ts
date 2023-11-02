import { Component } from 'vue'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 是可选的
    isAdmin?: boolean
    // 每个路由都必须声明
    requiresAuth: boolean
  }
}

interface DynamicComponentProps {
  is: string | Component
}

export interface RecordScreenOptions {
  mediaRecorder: MediaRecorder | null //当前录屏的媒体流
  blobs: Blob[] //保存当前的媒体流
  mimeType: string //MIME类型
}
