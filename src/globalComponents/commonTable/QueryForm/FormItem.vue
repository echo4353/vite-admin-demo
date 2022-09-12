<template>
  <el-form-item :prop="item.model">
    <el-input v-if="item.type == 'input'" v-bind="$attrs"></el-input>
    <el-select v-else-if="item.type == 'select'" v-bind="$attrs">
      <el-option
        v-for="option in item.options"
        :key="option.code"
        :label="option.name"
        :value="option.code"
        v-bind="option"
      />
    </el-select>
    <el-select
      v-else-if="item.type == 'remote'"
      v-bind="$attrs"
      filterable
      remote
      reserve-keyword
    >
      <el-option
        v-for="option in item.options"
        :key="option.id"
        :label="option.name"
        :value="option.id"
        v-bind="option"
      />
    </el-select>
  </el-form-item>
</template>
<script setup>
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
const props = defineProps({
  item: Object
})
</script>
