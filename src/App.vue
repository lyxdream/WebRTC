<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>
<template>
  <div class="wrapper">
    <!-- <HelloWorld msg="You did it!" /> -->
    <RouterView />
    <div class="nav-list">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/WebRTC">about</RouterLink>
      <RouterLink to="/Record">Record</RouterLink>
      <RouterLink to="/RecordCanvas">RecordCanvas</RouterLink>
      <RouterLink to="/Recordhtml2canvas">Recordhtml2canvas</RouterLink>
      <RouterLink to="/photoPicture">photoPicture</RouterLink>
      
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
  .wrapper{
      display: flex;
      justify-content: center;
      flex-direction: column;
      .nav-list{
        RouterLink{
          margin-right: 10px;
        }
      }
  }
</style>