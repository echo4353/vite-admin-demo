<template>
  <div class="navbar">
    <!-- 汉堡 -->
    <hamburg class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <guide class="right-menu-item hover-effect" />
      <screenfull class="right-menu-item hover-effect" />
      <p style="color: #666; user-select: none">{{ nowTime }}：</p>
      <p style="color: #97a8be; user-select: none">
        {{ store.getters.userName }}
      </p>
      <div
        id="guide-switch"
        class="switch"
        data-text="切换系统"
        style="--c: #1e90ff"
        @click="switchSystem"
      ></div>
      <el-tooltip content="退出登录">
        <div style="cursor: pointer" id="guide-logout" @click="logout">
          <el-icon :size="24"><SwitchButton /></el-icon>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import Hamburg from '@comps/Hamburg/index.vue'
import Breadcrumb from '@comps/Breadcrumb/index.vue'
import Screenfull from '@comps/Screenfull/index.vue'
import Guide from '@comps/Guide/index.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { api, url } from '@/utils/config.js'
import { setItem, removeAllItem, removeSessionAllItem } from '@/utils/storage'
const store = useStore()
const switchSystem = () => {
  removeAllItem()
  removeSessionAllItem()
  setItem('isFirstLogin', 1)
  setTimeout(() => {
    window.location.href = `${url.sso}/applist`
  }, 200)
}
const logout = () => {
  store.dispatch('user/logout')
}
const nowTime = computed(() => {
  let date = new Date()
  if (date.getHours() >= 6 && date.getHours() < 12) {
    return '上午好'
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return '下午好'
  } else {
    return '晚上好'
  }
})
</script>

<style lang="less" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.5s;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    padding-right: 16px;
    padding-top: 7px;
    :deep(.avatar-container) {
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .el-avatar {
          --el-avatar-bg-color: none;
          margin-right: 12px;
        }
      }
    }
    :deep(.right-menu-item) {
      display: inline-block;
      padding: 0 18px 0 0;
      font-size: 24px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
      }
    }
  }
}
.switch {
  position: relative;
  width: 80px;
  height: 35px;
  background: #fff;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  transition: 0.6s linear;
  cursor: pointer;
}
.switch::before {
  content: '';
  width: 120px;
  height: 11px;
  background: var(--c);
  position: absolute;
  animation: roll 4s linear infinite;
  filter: blur(5px);
  transition: 0.6s linear;
}
.switch::after {
  width: 77.5px;
  height: 32.5px;
  content: attr(data-text);
  position: absolute;
  color: var(--c);
  font-size: 14px;
  text-align: center;
  line-height: 32.5px;
  background: #fff;
  text-transform: uppercase;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: 0.6s linear;
}
@keyframes roll {
  100% {
    transform: rotate(360deg);
    filter: blur(5px) hue-rotate(360deg);
  }
}
.switch:hover {
  box-shadow: 0 0 5px var(--c), 0 0 10px var(--c), 0 0 20px var(--c);
  background: var(--c);
}
.switch:hover::before {
  height: 250px;
  width: 250px;
  animation-play-state: paused;
  filter: hue-rotate(0);
}
.switch:hover::after {
  background: var(--c);
  color: white;
}
</style>
