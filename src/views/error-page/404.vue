<template>
  <div class="error-wrap">
    <el-button type="primary" size="large" round class="btn" @click="goHome"
      >返回首页</el-button
    >
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = new useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<style lang="less" scoped>
.error-wrap {
  width: 100%;
  height: 100vh;
  background: url('../../assets/404.png') no-repeat center;
  background-size: cover;
}
.btn {
  position: fixed;
  bottom: 43%;
  left: 47%;
}
</style>
