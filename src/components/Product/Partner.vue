<template>
  <div>
    <el-divider content-position="left" v-if="!isReadOnly">
      <el-button type="primary" @click="addPartner">新增合作品牌</el-button>
    </el-divider>
    <div class="cardWrap">
      <el-card
        v-for="item in groupList"
        :key="item.id"
        class="box-card"
        style="width: 350px; margin: 13px"
      >
        <template #header>
          <div
            class="card-header"
            style="display: flex; justify-content: space-between"
          >
            <p class="group-logo">
              <img :src="item.logo" :alt="item.partnerName" />
            </p>
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
        <ul>
          <li class="text item">
            <div class="funWrap">
              <p class="funName">合作品牌</p>
              <p class="funIntro">{{ item.partnerName }}</p>
            </div>
          </li>
          <li class="text item">
            <div class="funWrap">
              <p class="funName">品牌所在行业</p>
              <p class="funIntro">{{ item.industryName }}</p>
            </div>
          </li>
          <li class="text item">
            <div class="funWrap">
              <p class="funName">品牌公司</p>
              <p class="funIntro">{{ item.companyName }}</p>
            </div>
          </li>
          <li class="text item">
            <div class="funWrap">
              <p class="funName">公司规模</p>
              <p class="funIntro">{{ item.industrySizeName }}</p>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
    <el-drawer v-model="drawer" :direction="direction" v-if="drawer">
      <template #header>
        <h4>合作品牌</h4>
      </template>
      <template #default>
        <el-form :model="partnerForm" ref="partnerFormRef" label-width="100px">
          <el-form-item
            label="合作品牌"
            prop="name"
            :rules="{
              required: true,
              message: '请输入合作品牌名称',
              trigger: 'blur'
            }"
          >
            <el-autocomplete
              v-model="partnerForm.name"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入合作品牌名称"
              :maxlength="50"
              @select="selectPartnerName"
              popper-class="pro-name-select"
            >
            </el-autocomplete>
          </el-form-item>
          <el-form-item
            label="所在行业"
            prop="industryId"
            :rules="{
              required: true,
              message: '请选择品牌所在行业',
              trigger: 'change'
            }"
          >
            <el-select
              placeholder="请选择品牌所在行业"
              v-model="partnerForm.industryId"
              style="width: 100%"
            >
              <el-option
                v-for="item in industryList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="品牌公司"
            prop="companyName"
            :rules="{
              required: true,
              message: '请输入品牌公司',
              trigger: 'blur'
            }"
          >
            <el-input
              v-model="partnerForm.companyName"
              placeholder="请输入品牌公司"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司规模"
            prop="industrySizeId"
            :rules="{
              required: true,
              message: '请选择合作品牌的公司规模',
              trigger: 'change'
            }"
          >
            <el-select
              placeholder="请选择合作品牌的公司规模"
              v-model="partnerForm.industrySizeId"
              style="width: 100%"
            >
              <el-option
                v-for="item in industrySizeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="logo"
            class="upload-form"
            prop="logo"
            :rules="{
              required: true,
              message: '请上传合作品牌的Logo',
              trigger: 'change'
            }"
          >
            <kr-upload
              tips="建议尺寸100*100 jpg/png/bmp/svg格式小于5M的图片"
              v-model="partnerForm.logo"
              :logos="defaultLogos"
              :krLimit="1"
            ></kr-upload>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick(partnerFormRef)"
            >确认</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  partnerAddInit,
  partnerAdd,
  partnerMod,
  partnerModInit,
  partnerDel
} from '@/api/productTab'
import { searchPartner } from '@/api/commonApi'
import { partnerInfoInitApi } from '@/api/productReview'
import { getSessionItem } from '@/utils/storage'
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
const route = useRoute()
const queryProductId = ref(null)
queryProductId.value = route.query?.id ?? null
// 合作品牌
const partnerForm = reactive({
  logo: '',
  name: '',
  industryId: '',
  companyName: '',
  industrySizeId: ''
})
const defaultLogos = ref([])
// 合作品牌列表
const groupList = ref([])

const partnerFormRef = ref(null)
const priceValidateForm = reactive({
  name: '',
  price: '',
  priceDescribe: '',
  describe: ''
})

const isAdd = ref(false)
const drawer = ref(false)
const direction = ref('rtl')
const addPartner = () => {
  console.log('xinzeng ')
  drawer.value = true
  partnerFormRef.value && partnerFormRef.value.resetFields()
  Object.keys(partnerForm).forEach((key) => (partnerForm[key] = ''))
  partnerForm.industrySizeId = ''
  defaultLogos.value = []
  isAdd.value = true
}
// 编辑
const modVal = ref(0)
const goEdit = (val) => {
  partnerFormRef.value && partnerFormRef.value.resetFields()
  Object.keys(partnerForm).forEach((key) => (partnerForm[key] = ''))
  Object.assign(partnerForm, val)
  modVal.value = val.id
  partnerForm.name = val.partnerName
  defaultLogos.value = [
    {
      name: val.logo,
      url: val.logo
    }
  ]
  drawer.value = true
}
// 删除功能组
const goDel = async (val) => {
  await partnerDel({
    id: val.id
  })
  modInit()
}
const cancelClick = () => {
  drawer.value = false
}
// 新增合作品牌
const selectPartnerName = (item) => {
  partnerForm.logo = item.partnerLogo
  defaultLogos.value = [
    {
      name: item.partnerLogo,
      url: item.partnerLogo
    }
  ]
  partnerForm.industryId =
    item.partnerIndustryId === 0 ? '' : item.partnerIndustryId
  partnerForm.companyName = item.partnerCompanyName
  partnerForm.industrySizeId = item.partnerIndustrySizeId
}
const querySearchAsync = async (query, cb) => {
  if (query && query.trim()) {
    const { partnerList } = await searchPartner({
      partnerName: query
    })
    let newList = partnerList.map((item) => {
      return {
        value: item.partnerName,
        link: item.partnerId,
        partnerCompanyName: item.partnerCompanyName,
        partnerIndustryId: item.partnerIndustryId,
        partnerIndustrySizeId: item.partnerIndustrySizeId,
        partnerLogo: item.partnerLogo
      }
    })
    cb(newList || [])
  }
}
// 保存
const confirmClick = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (isAdd.value || !props.isMod) {
        await partnerAdd({
          ...partnerForm,
          productId: getSessionItem('productId') || queryProductId.value
        })
        isAdd.value = false
        modInit()
      } else {
        await partnerMod({
          ...partnerForm,
          id: modVal.value,
          productId: getSessionItem('productId') || queryProductId.value
        })
        ElNotification({
          title: 'Success',
          message: '修改成功',
          type: 'success'
        })
        modInit()
      }
      drawer.value = false
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const industrySizeList = ref([])
const industryList = ref([])
// 新增初始化
const addInit = async () => {
  const res = await partnerAddInit({})
  industryList.value = res.industryList
  industrySizeList.value = res.industrySizeList
}
// 编辑初始化
const modInit = async () => {
  const data = await partnerModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  industryList.value = data.industryList
  industrySizeList.value = data.industrySizeList
  groupList.value = data.partnerList
}
// 审核查看初始化
const viewInit = async () => {
  const data = await partnerInfoInitApi({ id: queryProductId.value })
  industryList.value = data.industryList
  industrySizeList.value = data.industrySizeList
  groupList.value = data.partnerList
}
const partnerInit = async () => {
  if (props.isMod || getSessionItem('productId')) {
    modInit()
  } else {
    addInit()
  }
}
defineExpose({
  partnerInit
})
</script>

<style lang="less" scoped>
ul li {
  list-style: none;
}
.cardWrap {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}
.group-logo {
  width: 100px;
  height: 100px;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.funWrap {
  margin-bottom: 10px;
  .funName {
    color: #343333;
    margin-bottom: 5px;
  }
  .funIntro {
    color: #9f9f9f;
  }
}
</style>
