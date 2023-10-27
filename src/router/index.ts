import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Record from '../views/Record.vue'
import RecordCanvas from '../views/RecordCanvas.vue'
import WebRTC from '../views/WebRTC.vue'
import Recordhtml2canvas from '../views/Recordhtml2canvas.vue'
import photoPicture from '../views/photoPicture.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/WebRTC',
      name: 'WebRTC',
      component: () => import('../views/WebRTC.vue')
    },
    {
      path: '/Record',
      name: 'Record',
      component: () => import('../views/Record.vue')
    },
    {
      path: '/RecordCanvas',
      name: 'RecordCanvas',
      component: () => import('../views/RecordCanvas.vue')
    },
    {
      path: '/Recordhtml2canvas',
      name: 'Recordhtml2canvas',
      component: () => import('../views/Recordhtml2canvas.vue')
    },
    {
      path: '/photoPicture',
      name: 'photoPicture',
      component: () => import('../views/photoPicture.vue')
    }
  ]
})

export default router
