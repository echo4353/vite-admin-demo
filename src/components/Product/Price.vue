<template>
  <div>
    <el-form
      :disabled="priceFormDisabled || isSaved"
      label-width="140px"
      :model="pricelocalForm"
      ref="formTop"
      class="top-form"
    >
      <el-form-item label="定价方式描述" prop="priceWayDescription">
        <el-input
          type="textarea"
          class="fieldwidth"
          placeholder="在这里输入价格整体的介绍或说明，例：您可以像用水用电一样使用多少支付多少（支付对公转帐充值），按年度签订服务协议。"
          v-model="pricelocalForm.priceWayDescription"
          maxlength="200"
          show-word-limit
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="定价说明" prop="priceDescription">
        <el-input
          type="textarea"
          class="fieldwidth"
          placeholder="在这里输入价格的特别说明，例：*以上价格包含创建PaaS云实例的基础资源价格，您可以根据业务规模的需要扩容IaaS配置。"
          v-model="pricelocalForm.priceDescription"
          maxlength="200"
          show-word-limit
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传详细报价文档" prop="attachment">
        <KrUploadFile
          :krDisabled="priceFormDisabled || isSaved"
          v-model="pricelocalForm.attachment"
          :files="files"
          :tips="'最大200M,支持ppt/pptx/pdf/doc/docx/xls/xlsx'"
        />
      </el-form-item>
      <el-form-item v-if="!isReadOnly">
        <div>
          <el-button
            size="small"
            type="primary"
            @click="submitForm"
            v-if="saveFlag && !isSaved"
            >保存</el-button
          >
          <el-button v-else size="small" type="success" disabled
            >已保存</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <el-divider content-position="right" v-if="!isReadOnly">
      <el-button type="primary" @click="addPrice">新增套餐</el-button>
    </el-divider>
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
            <div v-if="isMod">
              <el-button type="primary" icon="Edit" @click="goEdit(item)"
                >编辑</el-button
              >
              <el-button type="danger" icon="Edit" @click="goDel(item)"
                >删除</el-button
              >
            </div>
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
    <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h4>价格套餐</h4>
      </template>
      <template #default>
        <el-form
          ref="dynamicFormRef"
          :model="priceValidateForm"
          label-width="100px"
        >
          <el-form-item
            label="套餐名称"
            prop="name"
            :rules="{
              required: true,
              message: '请输入套餐名称',
              trigger: 'blur'
            }"
          >
            <el-input
              v-model="priceValidateForm.name"
              placeholder="输入价格版本的名称，例：基础班、标准版"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="价格"
            prop="price"
            :rules="{
              required: true,
              message: '请输入价格',
              trigger: 'blur'
            }"
          >
            <el-input
              v-model="priceValidateForm.price"
              placeholder="输入版本对应价格即可，单位默认人民币，例：￥0"
              maxlength="10"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="价格描述"
            prop="priceDescription"
            :rules="[
              { required: true, message: '请输入价格描述', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="priceValidateForm.priceDescription"
              placeholder="输入价格及收取频率、单位，例：/年/账号"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="套餐描述" prop="description">
            <el-input
              v-model="priceValidateForm.description"
              placeholder="输入版本特点或使用对象，例：集成钉钉，轻松搭建或适合50-100万用户规模的组织"
              maxlength="500"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4 }"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="priceMealAddBtn(dynamicFormRef)"
            >确认</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  priceAdd,
  priceModInit,
  priceMod,
  priceMealAdd,
  priceMealMod,
  priceMealDel
} from '@/api/productTab'
import { setSessionItem, getSessionItem } from '@/utils/storage'
import KrUploadFile from '@/globalComponents/krUploadFile'
import { ElNotification } from 'element-plus'
const props = defineProps({
  isReadOnly: {
    type: Boolean,
    required: false,
    default: false
  },
  isMod: {
    type: Boolean,
    required: false,
    default: false
  }
})
const priceFormDisabled = ref(false)
const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? null

const isSaved = computed(() => {
  return getSessionItem('priceInfoSave') || false
})
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

const drawer = ref(false)
const direction = ref('rtl')
const isAdd = ref(false)
const addPrice = () => {
  Object.keys(priceValidateForm).forEach((key) => (priceValidateForm[key] = ''))
  drawer.value = true
  isAdd.value = true
}
// 编辑
const modVal = ref(0)
const goEdit = (val) => {
  Object.keys(priceValidateForm).forEach((key) => (priceValidateForm[key] = ''))
  Object.assign(priceValidateForm, val)
  modVal.value = val.mealId
  drawer.value = true
}
// 删除功能组
const goDel = async (val) => {
  await priceMealDel({
    mealId: val.mealId
  })
  ElNotification({
    title: 'Success',
    message: '删除成功',
    type: 'success'
  })
  modInit()
}
const cancelClick = () => {
  drawer.value = false
}

const saveFlag = ref(true)
const priceId = ref(null)
// 保存
const submitForm = async () => {
  console.log(priceId.value, 'priceId.value')
  if (
    (!queryProductId.value &&
      (saveFlag.value || isAdd.value || !props.isMod)) ||
    !priceId.value
  ) {
    await priceAdd({
      ...pricelocalForm,
      productId: getSessionItem('productId') || queryProductId.value
    })
    if (!props.isMod) {
      priceFormDisabled.value = true
      saveFlag.value = false
      setSessionItem('priceInfoSave', true)
    }
    isAdd.value = false
    ElNotification({
      title: 'Success',
      message: '保存成功',
      type: 'success'
    })
    modInit()
  } else {
    await priceMod({
      mealId: priceId.value,
      ...pricelocalForm,
      productId: getSessionItem('productId') || queryProductId.value
    })
    // priceFormDisabled.value = true
    // saveFlag.value = false
    // setSessionItem('priceInfoSave', true)
    ElNotification({
      title: 'Success',
      message: '修改成功',
      type: 'success'
    })
    modInit()
  }
}
// 编辑初始化
const modInit = async () => {
  const data = await priceModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  priceId.value = data.id
  Object.assign(pricelocalForm, data)
  groupList.value = data.mealList
  if (data.attachment) {
    files.value = [{ name: data.attachment, url: data.attachment }]
  }
}
// 新增/编辑价格套餐
const priceMealAddBtn = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (isAdd.value || !props.isMod) {
        await priceMealAdd({
          ...priceValidateForm,
          productId: getSessionItem('productId') || queryProductId.value
        })
        isAdd.value = false
        drawer.value = false
        modInit()
      } else {
        await priceMealMod({
          mealId: modVal.value,
          ...priceValidateForm,
          productId: getSessionItem('productId') || queryProductId.value
        })
        ElNotification({
          title: 'Success',
          message: '修改成功',
          type: 'success'
        })
        modInit()
        drawer.value = false
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const priceInit = () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  }
}
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
.group-name {
  color: #000;
  max-width: 130px;
  word-break: break-all;
}
</style>
