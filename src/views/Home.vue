
<template>
  <div class="wrapper">
    <!-- <HelloWorld msg="You did it!" /> -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="item in linkList" :key="item.name" :label="item.name" :name="item.name">
      </el-tab-pane>
    </el-tabs>
    <component :is="currentComp"></component>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, shallowRef, defineAsyncComponent } from 'vue'
import type { TabsPaneContext } from 'element-plus'
// import HelloWorld from './components/HelloWorld.vue'
import PhotoPicture from './../components/PhotoPicture.vue'
const linkList = reactive([
  {
    name: 'PhotoPicture'
  },
  {
    name: 'Record'
  },
  {
    name: 'RecordCanvas'
  },
  {
    name: 'Recordhtml2canvas'
  },
  {
    name: 'WebRTC'
  }
])
const activeName = ref(linkList[0].name)
const currentComp = shallowRef(PhotoPicture) //组件名称
const handleClick = (tab: TabsPaneContext) => {
  activeName.value = tab.props.name as string
  getCurrentComp() //获取组件名称
}
const getCurrentComp = () => {
  currentComp.value = defineAsyncComponent(() => import(`./../components/${activeName.value}.vue`))
}
</script>
<style lang="scss" scoped>
.wrapper {
}
</style>