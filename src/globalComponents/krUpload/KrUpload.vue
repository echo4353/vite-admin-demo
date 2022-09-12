<template>
  <el-upload
    ref="upload"
    :disabled="krDisabled"
    v-model:file-list="fileListold"
    list-type="picture-card"
    action="#"
    :http-request="uploadFile"
    :headers="headers"
    :before-upload="beforeAvatarUpload"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="onSuccess"
    accept=".png,.jpg,.jpeg,.svg,.gif,.bmp"
    :limit="krLimit"
    :on-exceed="handleExceed"
  >
    <div class="middle-upload">
      <el-icon><Plus /></el-icon>
      <div class="tips" v-html="tips"></div>
    </div>
  </el-upload>

  <div class="imgPreview">
    <el-dialog v-model="dialogVisible" width="70%">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { genFileId, ElNotification } from 'element-plus'
import { uploadApi } from '@/api/commonApi'
import { Plus } from '@element-plus/icons-vue'
const props = defineProps({
  modelValue: { type: String, required: false },
  images: { type: Array, required: false },
  logos: {
    type: Array,
    required: false
  },
  krDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  tips: {
    type: String,
    required: false,
    default: '建议尺寸100*100 jpg/png/bmp/svg格式小于5M的图片'
  },
  krLimit: { type: Number, required: false, default: 1 },
  krSize: { type: Number, required: false, default: 5 }
})
const emits = defineEmits([
  'update:modelValue',
  'update:images',
  'update:logos'
])
const headers = {
  'Content-Type': 'multipart/form-data'
}
const fileListold = ref([])
const imagesList = ref([])
const init = () => {
  setTimeout(() => {
    if (props.logos) {
      fileListold.value = props.logos
    }
    if (props.images) {
      fileListold.value = props.logos
      imagesList.value = props.images
    }
  }, 1200)
}
init()
watch(
  () => props.logos,
  (count, prevCount) => {
    fileListold.value = props.logos
  }
  // {
  //   immediate: true
  // }
)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
  const imgNewList = ref([])
  imgNewList.value = props.imagesList
  if (props.krLimit > 1 && props.images) {
    let idx = imgNewList.value.indexOf(uploadFile.url)
    imgNewList.value.splice(idx, 1)
    emits('update:images', imgNewList.value)
    return false
  } else {
    emits('update:modelValue', null)
  }
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
const onSuccess = (response, uploadFile, uploadFiles) => {
  console.log(response, 'onSuccess', uploadFiles)
}
const beforeAvatarUpload = (rawFile) => {
  // if (rawFile.size / 1024 / 1024 > 5) {
  //   ElNotification({
  //     title: 'Error',
  //     message: '图片大小超过5MB!',
  //     type: 'error'
  //   })
  //   return false
  // }
  // return true
}
// 重写上传程序

const uploadFile = async (params) => {
  var { file } = params
  var formData = new FormData()
  formData.append('param.file', file)
  const { ossUrl, path } = await uploadApi(formData)
  if (props.krLimit > 1) {
    imagesList.value.push(ossUrl)
    emits('update:images', imagesList.value)
  } else {
    emits('update:modelValue', ossUrl)
  }
}
const upload = ref(null)
const handleExceed = (files, uploadFiles) => {
  console.log(files, '当超出限制时，执行的钩子函数')
  if (props.krLimit > 1) {
    return
  } else if (files[0].size / 1024 / 1024 > props.krSize) {
    ElNotification({
      title: 'Error',
      message: `图片大小超过${props.krSize}MB!`,
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
</script>

<style lang="less" scoped>
.imgPreview :deep(.el-dialog__body) {
  overflow: hidden !important;
  img {
    width: 100%;
  }
}
.middle-upload {
  display: block;
  text-align: center;
  .tips {
    color: #666;
    bottom: 0;
    line-height: 15px !important;
  }
}
</style>
