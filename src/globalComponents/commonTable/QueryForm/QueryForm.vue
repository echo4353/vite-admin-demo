<template>
  <el-form ref="QueryForm" :inline="true" :model="QueryModel">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="QueryModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
    <el-form-item>
      <slot name="action"></slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue'
import FormItem from './FormItem.vue'
/**
 * form = [
 *  {
 *    type:"input",
 *    model:"userId",
 *    label:"用户ID",
 *    placeholder:"请输入用户ID"
 *  }
 * ]
 */
const props = defineProps({
  modelValue: Object,
  form: Array
})
const emits = defineEmits([
  'update:modelValue',
  'handleSubmit',
  'handleQuery',
  'handleReset'
])

const ctx = getCurrentInstance()
// const form = ref(props.form)
const QueryModel = reactive({ ...props.modelValue })

const handleReset = () => {
  ctx.refs.QueryForm.resetFields()
  emits('handleReset')
}
const handleQuery = () => {
  emits('update:modelValue', { ...QueryModel })
  emits('handleQuery', { ...QueryModel })
}
</script>
