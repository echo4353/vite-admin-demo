<template>
  <div>
    <el-upload
      ref="upload"
      v-model:file-list="fileListold"
      class="upload-demo"
      :action="isEnv ? '/uploadVideoApi' : ossHost"
      :data="ossData"
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
import { reactive, ref, computed, watch } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { uploadSignatureApi } from '@/api/commonApi'
import { genFileId } from 'element-plus'

const props = defineProps({
  modelValue: { type: String, required: false },
  videos: {
    type: Array,
    required: false,
    default: function () {
      return []
    }
  },
  tips: {
    type: String,
    required: false,
    default: '最大500M,支持mp4格式'
  },
  krLimit: { type: Number, required: false, default: 1 },
  uploadBtnLabel: {
    type: String,
    default: '上传视频',
    required: false
  },
  acceptType: {
    type: String,
    default: '.mp4',
    required: false
  }
})
const isEnv = import.meta.env.VITE_APP_PROXY_URL === 'dev'
const emits = defineEmits(['update:modelValue', 'update:videos'])
const fileListold = ref([])
const init = () => {
  setTimeout(() => {
    if (props.videos) {
      fileListold.value = props.videos
    }
  }, 1200)
}
init()
watch(
  () => props.videos,
  (count, prevCount) => {
    fileListold.value = props.videos
  }
  // {
  //   immediate: true
  // }
)
const handleRemove = (uploadFile, uploadFiles) => {
  // const imgNewList = ref([])
  // imgNewList.value = props.imagesList
  // if (props.krLimit > 1 && props.images) {
  //   let idx = imgNewList.value.indexOf(uploadFile.url)
  //   imgNewList.value.splice(idx, 1)
  //   emits('update:images', imgNewList.value)
  //   return false
  // } else {
  emits('update:modelValue', null)
  // }
}
const onSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response, 'onSuccess', uploadFiles[0], uploadFiles[0].value)
  uploadFiles[0].url = `${cdnHost.value}${ossData.value.key}`
  uploadFiles[0].name = `${cdnHost.value}${ossData.value.key}`
  // emits('update:videos', uploadFiles.value)
  emits(
    'update:modelValue',
    ossData.value.key ? cdnHost.value + ossData.value.key : ''
  )
}
// const onChange = (uploadFile, uploadFiles) => {
//   if (!uploadFiles.length) {
//     emits('update:modelValue', '')
//   } else {
//     emits(
//       'update:modelValue',
//       ossData.value.key ? cdnHost.value + ossData.value.key : ''
//     )
//   }
// }
const upload = ref(null)
const handleExceed = (files, uploadFiles) => {
  console.log(files, '当超出限制时，执行的钩子函数')
  // if (props.krLimit > 1) {
  //   return
  // }

  // upload.value.clearFiles()
  // const file = files[0]
  // file.uid = genFileId()
  // upload.value.handleStart(file)
  // upload.value.submit()
  if (props.krLimit > 1) {
    return
  } else if (files[0].size / 1024 / 1024 > 500) {
    ElNotification({
      title: 'Error',
      message: `视频大小超过500MB!`,
      type: 'error'
    })
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
const ext = ref('')
const beforeUpload = async (file) => {
  ext.value = file.name.slice(file.name.lastIndexOf('.') + 1)
  if (typeof props.beforeUploadLimit === 'function') {
    const value = await props.beforeUploadLimit(file)
    if (value === false) return Promise.reject(new Error('不符合上传条件'))
  }
  await getOssToken()
}
const ossData = ref({
  key: '',
  policy: '',
  OSSAccessKeyId: '',
  success_action_status: '200',
  signature: '',
  host: ''
})
const cdnHost = ref('')
const ossHost = ref('')
const getOssToken = async () => {
  return uploadSignatureApi({
    fileType: 'video'
  }).then((res) => {
    ossData.value = {
      key: res.dir + '_' + ext.value,
      policy: res.policy,
      OSSAccessKeyId: res.accessid,
      success_action_status: '200',
      signature: res.signature
    }
    ossHost.value = res.host
    cdnHost.value = res.cdnHost
    return Promise.resolve()
  })
}
</script>
