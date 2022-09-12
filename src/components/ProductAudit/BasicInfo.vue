<template>
  <div>
    <el-form
      :disabled="true"
      ref="basicInfoFormRef"
      :model="baseInfoFrom"
      label-width="100px"
    >
      <el-form-item label="logo" prop="logo">
        <div class="demo-image__preview">
          <el-image
            style="width: 100px; height: 100px"
            :src="baseInfoFrom.logo"
            :preview-src-list="previewLogo"
            fit="cover"
          />
        </div>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        {{ baseInfoFrom.type === 1 ? '软件' : '服务' }}
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        {{ baseInfoFrom.productName }}
      </el-form-item>
      <el-form-item label="官网链接" prop="websiteUrl">
        {{ baseInfoFrom.websiteUrl }}
      </el-form-item>
      <el-form-item label="主分类" prop="mainClassifyId">
        <el-cascader
          v-model="baseInfoFrom.mainClassifyId"
          :options="mainClassifyOptions"
          :props="mainClassifyProps"
          :show-all-levels="false"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="关联分类" prop="classifyIds">
        <el-cascader
          clearable
          v-model="baseInfoFrom.classifyIds"
          :options="classifyOptions"
          :props="classifyProps"
          :show-all-levels="false"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="产品简介" prop="introduction">
        {{ baseInfoFrom.introduction }}
      </el-form-item>
      <el-form-item label="产品详细介绍" prop="detailIntroduction">
        <div v-html="baseInfoFrom.detailIntroduction" class="detailintro"></div>
      </el-form-item>
      <el-form-item label="产品图片" prop="images">
        <div
          class="demo-image__preview images"
          v-for="(imgs, index) in previewLogos"
          :key="index"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="imgs"
            :preview-src-list="previewLogos"
            fit="cover"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { baseInfomodInit } from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
import { baseInfoInitApi } from '@/api/productReview'
const props = defineProps({
  isAudit: {
    type: Boolean,
    required: false,
    default: false
  }
})
const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? ''

const typeList = ref([])
const previewLogo = ref([])
const previewLogos = ref([])
const classifyOptions = ref([])
const mainClassifyOptions = ref([])
const baseInfoFrom = reactive({
  type: '',
  productName: '',
  websiteUrl: '',
  introduction: '',
  detailIntroduction: '',
  logo: '',
  mainClassifyId: '',
  classifyIds: '',
  images: []
})
// 主分类配置
const mainClassifyProps = {
  expandTrigger: 'hover',
  emitPath: false
}
// 关联分类配置
const classifyProps = {
  expandTrigger: 'hover',
  multiple: true,
  emitPath: false
}

const initChangeVal = (res) => {
  typeList.value = res.typeList
  classifyOptions.value = JSON.parse(res.classifyJson)
  mainClassifyOptions.value = JSON.parse(res.classifyJson)
  Object.assign(baseInfoFrom, res)
  if (res.logo) {
    previewLogo.value = [res.logo]
  }
  if (res.images) {
    previewLogos.value = res.images
  }
}
// 编辑初始化
const modInit = async () => {
  const productId = getSessionItem('productId')
    ? getSessionItem('productId')
    : queryProductId.value
  const res = await baseInfomodInit({
    id: productId
  })
  initChangeVal(res)
}
// 审核初始化
const viewInit = async () => {
  const res = await baseInfoInitApi({ id: queryProductId.value })
  initChangeVal(res)
}

const baseInfoInit = () => {
  modInit()
}

onMounted(() => {
  if (props.isAudit) {
    viewInit()
  } else {
    modInit()
  }
})

defineExpose({
  baseInfoInit
})
</script>

<style lang="less" scoped>
.demo-image__preview {
  width: 104px;
  height: 104px;
  border: 1px solid #e5e5e5;
}
.images {
  margin-left: 15px;
}
.detailintro {
  white-space: pre-line;
}
</style>
