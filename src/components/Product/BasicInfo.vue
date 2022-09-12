<template>
  <div>
    <el-form
      :disabled="baseFormDisabled || isSaved"
      ref="basicInfoFormRef"
      :model="baseInfoFrom"
      :rules="rules"
      label-width="110px"
    >
      <el-form-item label="logo" prop="logo">
        <kr-upload
          v-model="baseInfoFrom.logo"
          :logos="defaultLogos"
          :krLimit="1"
          :krDisabled="baseFormDisabled || isSaved"
          tips="建议尺寸100*100 jpg/png/bmp/svg格式小于5M的图片"
        ></kr-upload>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="baseInfoFrom.type" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          :disabled="isMod"
          v-model="baseInfoFrom.productName"
          maxlength="50"
          show-word-limit
          placeholder="请输入产品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="官网链接" prop="websiteUrl">
        <el-input
          v-model="baseInfoFrom.websiteUrl"
          placeholder="请输入官网链接"
        ></el-input>
      </el-form-item>
      <el-form-item label="主分类" prop="mainClassifyId">
        <el-cascader
          :disabled="isMod"
          v-model="baseInfoFrom.mainClassifyId"
          :options="mainClassifyOptions"
          :props="mainClassifyProps"
          :show-all-levels="false"
        />
      </el-form-item>
      <el-form-item label="关联分类" prop="classifyIds">
        <el-cascader
          clearable
          v-model="baseInfoFrom.classifyIds"
          :options="classifyOptions"
          :props="classifyProps"
          :show-all-levels="false"
          @change="handleChangeClassify"
        />
        <span>(最多可选择两个)</span>
      </el-form-item>
      <el-form-item label="产品简介" prop="introduction">
        <el-input
          v-model="baseInfoFrom.introduction"
          maxlength="64"
          show-word-limit
          placeholder="请输入产品简介"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="产品详细介绍"
        prop="detailIntroduction"
        :rules="[
          { required: true, message: '请输入产品详细介绍', trigger: 'change' },
          { min: 200, message: '长度至少200个字符', trigger: 'blur' }
        ]"
      >
        <el-input
          type="textarea"
          maxlength="1000"
          rows="10"
          show-word-limit
          v-model="baseInfoFrom.detailIntroduction"
          placeholder="请输入产品详细介绍"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品图片" prop="images">
        <kr-upload
          v-model:images="baseInfoFrom.images"
          :logos="defaultimages"
          :krDisabled="baseFormDisabled || isSaved"
          :krLimit="20"
          :krSize="10"
          tips="建议尺寸2:1,小于10M,jpg/png/bmp/svg格式"
        ></kr-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          v-if="saveFlag && !isSaved"
          type="primary"
          @click="submitForm(basicInfoFormRef)"
          >保存</el-button
        >
        <el-button v-else type="success" disabled>已保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { useRoute } from 'vue-router'
import {
  baseInfoAddInit,
  baseInfoAdd,
  baseInfomodInit,
  baseInfomod
} from '@/api/productTab'
import { setSessionItem, getSessionItem } from '@/utils/storage'

const props = defineProps({
  isMod: {
    type: Boolean,
    required: false,
    default: false
  }
})

const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? ''
const baseFormDisabled = ref(false)

const isSaved = computed(() => {
  return getSessionItem('basicInfoSave') || false
})

const saveFlag = ref(true)
const typeList = ref([])
const defaultLogos = ref([])
const defaultimages = ref([])
const defaultVideos = ref([])
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
watch(
  () => baseInfoFrom.classifyIds,
  (newValue, oldValue) => {
    // if (newValue.length > 2) {
    // classifyOptions.value.forEach((item) => {
    //   item.disabled = true
    // })
    //   ElNotification({
    //     title: 'Warning',
    //     message: '最多可选择两个',
    //     type: 'warning'
    //   })
    // }
  }
  // } else {
  //   classifyOptions.value.forEach((item) => {
  //     item.disabled = false
  //   })
  // }
  // }
)
const rules = reactive({
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  websiteUrl: [{ required: true, message: '请输入官网链接', trigger: 'blur' }],
  mainClassifyId: [
    { required: true, message: '请选择主分类', trigger: 'change' }
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }]
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

const handleChangeClassify = (value) => {
  const list = Array.from(value)
  // console.log(list.length, 'list')
  if (list.length > 2) {
    // classifyOptions.value.forEach((item) => {
    //   item.disabled = list.length >= 2 && !list.includes(item.value)
    // })
    baseInfoFrom.classifyIds = list.slice(-2)
  }
}
// 新增初始化
const addInit = async () => {
  const res = await baseInfoAddInit({})
  typeList.value = res.typeList
  if (res.classifyJson) {
    classifyOptions.value = JSON.parse(res.classifyJson)
    mainClassifyOptions.value = JSON.parse(res.classifyJson)
  } else {
    classifyOptions.value = []
    mainClassifyOptions.value = []
  }
}
const basicInfoFormRef = ref(null)
const modId = ref(null)
// 保存
const emits = defineEmits(['update:modelValue'])
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(props.isMod, 'props.isMod')
      if (props.isMod) {
        await baseInfomod({
          ...baseInfoFrom,
          id: getSessionItem('productId') || queryProductId.value
        })
        ElNotification({
          title: 'Success',
          message: '修改成功',
          type: 'success'
        })
        modInit()
      } else {
        const res = await baseInfoAdd({
          ...baseInfoFrom
        })
        ElNotification({
          title: 'Success',
          message: '保存成功',
          type: 'success'
        })
        setSessionItem('productId', res.productId)
        setSessionItem('basicInfoSave', true)
        emits('update:modelValue', true)
        baseFormDisabled.value = true
        saveFlag.value = false
        modInit()
      }
    }
  })
}
const initChangeVal = (res) => {
  typeList.value = res.typeList
  if (res.classifyJson) {
    classifyOptions.value = JSON.parse(res.classifyJson)
    mainClassifyOptions.value = JSON.parse(res.classifyJson)
  } else {
    classifyOptions.value = []
    mainClassifyOptions.value = []
  }
  Object.assign(baseInfoFrom, res)
  if (res.logo) {
    defaultLogos.value = [
      {
        name: res.logo,
        url: res.logo
      }
    ]
  }
  if (res.images) {
    let imgs = res.images.map((item) => {
      return {
        name: item,
        url: item
      }
    })
    defaultimages.value = imgs
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

const baseInfoInit = () => {
  if (props.isMod || getSessionItem('productId')) {
    modInit()
  } else {
    addInit()
  }
}

onMounted(() => {
  baseInfoInit()
})

defineExpose({
  baseInfoInit
})
</script>

<style lang="less" scoped></style>
