
<template>
  <div class="wrapper">
    <!-- <HelloWorld msg="You did it!" /> -->
    <el-tabs v-model="routerName" class="demo-tabs" @tab-click="handleClick">
      <!-- <template #label>
        <span class="custom-tabs-label">
          <span>Route</span>
        </span>
      </template> -->
      <el-tab-pane v-for="item in linkList" :key="item.name" :label="item.name" :name="item.name">
        <!-- {{ item.name }}1111 -->
        <RouterView />
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="nav-list">
      <div @click="toLink(item.name)">
        {{ item.name }}
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import type { TabsPaneContext } from 'element-plus'
// import HelloWorld from './components/HelloWorld.vue'
const linkList = reactive([
  {
    name: 'Home'
  },
  {
    name: 'WebRTC'
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
    name: 'PhotoPicture'
  }
])
const routerName = ref(linkList[0].name)

const router = useRouter()
const toLink = (link: string) => {
  router.push({
    name: link
  })
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  .nav-list {
    RouterLink {
      margin-right: 10px;
    }
  }
}
</style>