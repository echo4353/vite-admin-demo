<template>
  <el-card class="recommend-wrap">
    <el-form
      label-width="100px"
      :model="recommendForm"
      :disabled="recommendFormDisabled || isSaved"
    >
      <el-alert type="info" show-icon :closable="false">
        <p>添加推荐产品后，在您的产品页展示所添加的产品（最多可添加5个产品）</p>
      </el-alert>
      <el-form-item label="商家推荐" style="margin-top: 5px">
        <el-select
          v-model="recommendForm.recomProductIds"
          multiple
          filterable
          remote
          :reserve-keyword="false"
          placeholder="请输入选择"
          :remote-method="searchProduct"
          @change="recommendChange"
          :loading="loading"
        >
          <el-option
            v-for="item in commendList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-alert type="info" show-icon :closable="false">
        <p>打开后，展示同类产品推荐模块；关闭后，则不展示同类产品推荐模块</p>
      </el-alert>
      <el-form-item label="同类产品推荐">
        <el-switch
          v-model="recommendForm.hasSimpleRecom"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="saveFlag && !isSaved"
          type="primary"
          @click="submitForm()"
          >保存</el-button
        >
        <el-button v-else type="success" disabled>已保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchProductApi } from '@/api/commonApi'
import { recomAdd, recomModInit, recomMod } from '@/api/productTab'
import { setSessionItem, getSessionItem } from '@/utils/storage'
import { ElNotification } from 'element-plus'
const props = defineProps({
  isMod: {
    type: Boolean,
    required: false,
    default: false
  }
})
const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? null
const isSaved = computed(() => {
  return getSessionItem('recommendInfoSave') || false
})
const commendList = ref([])
const loading = ref(false)
const recommendFormDisabled = ref(false)
const recommendForm = reactive({
  recomProductIds: [],
  hasSimpleRecom: 1
})
// 商家推荐产品
const searchProduct = async (query) => {
  loading.value = true
  let res = await searchProductApi({ productName: query })
  commendList.value = res.productList
  loading.value = false
}
const recommendChange = (val) => {
  if (val.length > 5) {
    ElNotification({
      title: 'Warning',
      message: '最多可添加5个',
      type: 'warning'
    })
    recommendForm.recomProductIds.splice(-1)
  }
}
// 保存
const submitForm = async () => {
  if (props.isMod && modId.value) {
    await recomMod({
      ...recommendForm,
      id: modId.value,
      productId: getSessionItem('productId') || queryProductId.value
    })
    ElNotification({
      title: 'Success',
      message: '修改成功',
      type: 'success'
    })
    modInit()
  } else {
    await recomAdd({
      ...recommendForm,
      productId: getSessionItem('productId') || queryProductId.value
    })
    if (!props.isMod) {
      recommendFormDisabled.value = true
      saveFlag.value = false
      setSessionItem('recommendInfoSave', true)
    }

    modInit()
  }
}
const saveFlag = ref(true)
const modId = ref(null)
// 编辑初始化
const modInit = async () => {
  const data = await recomModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  modId.value = data.id
  if (data.recomProduct) {
    let newList = data.recomProduct.map((item) => {
      return {
        name: item.productName,
        code: item.productId
      }
    })
    let ids = data.recomProduct.map((item) => {
      return item.productId
    })
    recommendForm.recomProductIds = ids || []
    commendList.value = newList || []
  }
  recommendForm.hasSimpleRecom = data.hasSimpleRecom
}

const recommendInit = async () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  }
}
defineExpose({
  recommendInit
})
</script>

<style lang="less" scoped>
.recommend-wrap :deep(.el-input__wrapper) {
  width: 300px;
}
</style>
