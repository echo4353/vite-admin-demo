<template>
  <el-card class="recommend-wrap">
    <el-form label-width="100px" :model="recommendForm" :disabled="true">
      <el-alert type="info" show-icon :closable="false">
        <p>添加推荐产品后，在您的产品页展示所添加的产品（最多可添加5个产品）</p>
      </el-alert>
      <el-form-item label="商家推荐" style="margin-top: 5px">
        <el-select
          v-if="recommendForm.recomProductIds.length > 0"
          size="large"
          v-model="recommendForm.recomProductIds"
          filterable
          remote
          multiple
          fit-input-width
          collapse-tags-tooltip
          placeholder="请选择"
          :remote-method="searchProduct"
          @change="recommendChange"
        >
          <el-option
            v-for="item in commendList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <div v-else>无</div>
      </el-form-item>
      <el-alert type="info" show-icon :closable="false">
        <p>打开后，展示同类产品推荐模块；关闭后，则不展示同类产品推荐模块</p>
      </el-alert>
      <el-form-item label="同类产品推荐">
        {{ recommendForm.hasSimpleRecom === 1 ? '是' : '否' }}
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { recomModInit } from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
import { recomInfoInitApi } from '@/api/productReview'
const props = defineProps({
  isAudit: {
    type: Boolean,
    required: false,
    default: false
  }
})
const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? null

const commendList = ref([])
const recommendForm = reactive({
  recomProductIds: [],
  hasSimpleRecom: 1
})
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
// 审核初始化
const viewInit = async () => {
  const data = await recomInfoInitApi({ id: queryProductId.value })
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
  modInit()
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})
defineExpose({
  recommendInit
})
</script>

<style lang="less" scoped>
.recommend-wrap :deep(.el-input__wrapper) {
  width: 300px;
}
</style>
