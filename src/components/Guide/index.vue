<template>
  <div>
    <el-tooltip content="引导">
      <SvgIcon id="guide-start" icon="guide" @click="onClick" />
    </el-tooltip>
  </div>
</template>

<script setup>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { onMounted } from 'vue'
import steps from './steps'
import { setItem, getItem } from '@/utils/storage'
let driver = null
onMounted(() => {
  driver = new Driver({
    // 禁止点击蒙版关闭
    allowClose: false,
    closeBtnText: '关闭',
    nextBtnText: '下一个',
    prevBtnText: '上一个'
  })
  if (getItem('isFirstLogin') !== 1) {
    onClick()
    setItem('isFirstLogin', 1)
  }
})
const onClick = () => {
  driver.defineSteps(steps())
  driver.start()
}
</script>

<style scoped></style>
