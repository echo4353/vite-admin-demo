<template>
  <router-view />
</template>
<script setup>
import { useStore } from 'vuex'
import watermark from 'tiny-watermark'
const store = useStore()
watermark({
  content: store.getters.userName,
  zIndex: 2000,
  fillStyle: 'rgba(184, 184, 184, 0.2)'
})
</script>
<style lang="less"></style>
