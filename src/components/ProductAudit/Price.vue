<template>
  <div>
    <el-form
      :disabled="true"
      label-width="140px"
      :model="pricelocalForm"
      ref="formTop"
      class="top-form"
    >
      <el-form-item label="定价方式描述" prop="priceWayDescription">
        {{ pricelocalForm.priceWayDescription || '-' }}
      </el-form-item>
      <el-form-item label="定价说明" prop="priceDescription">
        {{ pricelocalForm.priceDescription || '-' }}
      </el-form-item>
      <el-form-item label="详细报价文档" prop="attachment">
        <el-link
          type="success"
          :href="pricelocalForm.attachment"
          target="_blank"
          >{{ pricelocalForm.attachment || '-' }}</el-link
        >
      </el-form-item>
    </el-form>

    <div class="cardWrap">
      <el-card
        v-for="item in groupList"
        :key="item.mealId"
        class="box-card"
        style="width: 350px; margin: 13px"
      >
        <template #header>
          <div
            class="card-header"
            style="display: flex; justify-content: space-between"
          >
            <p class="group-name">{{ item.name }}</p>
          </div>
        </template>
        <div class="price-wrap">
          <div class="price-middle">
            <p class="price-value">{{ item.price }}</p>
            <p class="price-desc">{{ item.priceDescription }}</p>
          </div>
          <div class="price-tc-desc">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { priceModInit } from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
import { priceInfoInitApi } from '@/api/productReview'
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

// 价格描述基本信息
const pricelocalForm = reactive({
  priceWayDescription: '',
  priceDescription: '',
  attachment: ''
})

const files = ref([])
// 价格套餐列表
const groupList = ref([])

const dynamicFormRef = ref(null)
const priceValidateForm = reactive({
  name: '',
  price: '',
  priceDescription: '',
  description: ''
})

const priceId = ref(null)

// 编辑初始化
const modInit = async () => {
  const data = await priceModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  priceId.value = data.id
  Object.assign(pricelocalForm, data)
  groupList.value = data.mealList
  files.value = [{ name: data.attachment, url: data.attachment }]
}
const priceInit = () => {
  modInit()
}
// 审核初始化
const viewInit = async () => {
  const data = await priceInfoInitApi({ id: queryProductId.value })
  Object.assign(pricelocalForm, data)
  groupList.value = data.mealList
  if (data.attachment) {
    files.value = [{ name: data.attachment, url: data.attachment }]
  }
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})

defineExpose({
  priceInit
})
</script>

<style lang="less" scoped>
.cardWrap {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.price-wrap {
  .price-middle {
    height: 86px;
    background-color: rgba(209, 219, 230, 0.16);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 16px;
    .price-value {
      line-height: 1;
      font-weight: 500;
      font-size: 21px;
      color: #ff9300;
      max-width: 100%;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price-desc {
      margin-top: 8px;
      color: #666;
      max-width: 100%;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .price-tc-desc {
    height: 130px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 20px;
  }
}
</style>
