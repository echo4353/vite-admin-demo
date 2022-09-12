<template>
  <div>
    <el-upload
      ref="upload"
      :disabled="krDisabled"
      v-model:file-list="fileList"
      class="upload-demo"
      action="#"
      :http-request="uploadFile"
      :headers="headers"
      :accept="acceptType"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-change="onChange"
      :limit="krLimit"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">{{ uploadBtnLabel }}</el-button>
      <template #tip>
        <div class="el-upload__tip">
          {{ tips }}
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { uploadSignatureApi, uploadApi } from '@/api/commonApi'
import { genFileId } from 'element-plus'
import { computed } from '@vue/reactivity'

const props = defineProps({
  modelValue: { type: String, required: false },
  files: {
    type: Array,
    required: false,
    default: function () {
      return []
    }
  },
  tips: {
    type: String,
    required: false,
    default: ''
  },
  krDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  krLimit: { type: Number, required: false, default: 1 },
  uploadBtnLabel: {
    type: String,
    default: '上传文件',
    required: false
  },
  acceptType: {
    type: String,
    default: '.ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx',
    required: false
  }
})
const emits = defineEmits(['update:modelValue', 'update:files'])
const fileList = computed({
  get: () => {
    return props.files
  },
  set: (val) => {
    emits('update:files', val)
  }
})

const handleRemove = (uploadFile, uploadFiles) => {
  console.log('handleRemove删除')
  if (!uploadFiles.length) {
    emits('update:modelValue', '')
  }
}
const onSuccess = (response, uploadFile, uploadFiles) => {
  // emits('update:files', imgList)
}
const onChange = (uploadFile, uploadFiles) => {
  console.log('change', uploadFile, uploadFiles)
  if (!uploadFiles.length) {
    emits('update:modelValue', '')
  }
}
const upload = ref(null)
const handleExceed = (files, uploadFiles) => {
  console.log(files, '当超出限制时，执行的钩子函数')
  if (props.krLimit > 1) {
    return
  }

  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
  upload.value.submit()
}
const beforeRemove = () => {}
const handlePreview = () => {}
const beforeUpload = async (file) => {
  if (typeof props.beforeUploadLimit === 'function') {
    const value = await props.beforeUploadLimit(file)
    if (value === false) return Promise.reject(new Error('不符合上传条件'))
  }
}
// 重写上传程序
const headers = {
  'Content-Type': 'multipart/form-data'
}
const uploadFile = async (params) => {
  var { file } = params
  var formData = new FormData()
  formData.append('param.file', file)
  const { ossUrl, path } = await uploadApi(formData)
  emits('update:modelValue', ossUrl)
}
</script>
