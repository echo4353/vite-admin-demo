<template>
  <div>
    <el-drawer v-model="curVisible" :direction="'rtl'" title="操作记录">
      <div v-for="(item, index) in operateLogList" :key="index">
        {{ item.operateTime }}
        <span class="user-name">{{ item.operateName }}</span> {{ item.action }}
        <span v-if="item.reason">原因：{{ item.reason }}</span>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  operateLogList: {
    type: Array,
    default: function () {
      return []
    }
  }
})
const emits = defineEmits(['update:visible'])
const curVisible = computed({
  get: () => {
    return props.visible
  },
  set: (val) => {
    emits('update:visible', val)
  }
})
</script>

<style lang="less" scoped>
.user-name {
  color: red;
}
</style>
