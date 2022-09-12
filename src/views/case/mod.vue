<template>
  <el-card>
    <el-form
      :model="caseForm"
      ref="caseFormRef"
      class="add-form"
      label-width="120px"
    >
      <el-form-item label="产品logo" prop="logo">
        <kr-upload
          v-model="caseForm.logo"
          :logos="defaultLogos"
          :krLimit="1"
        ></kr-upload>
      </el-form-item>
      <el-form-item label="关联产品" prop="productId">
        <el-select
          v-model="caseForm.productId"
          filterable
          single
          remote
          placeholder="输入选择"
          :remote-method="searchProductFunc"
        >
          <el-option
            v-for="item in tmpProductList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案例品牌" prop="brandName">
        <el-select
          v-model="caseForm.brandName"
          filterable
          single
          remote
          placeholder="输入选择"
          :remote-method="searchBrandFunc"
          @change="selectBrandChangeFunc"
        >
          <el-option
            v-for="item in tmpBrandList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="案例企业" prop="companyName">
        <el-input
          v-model="caseForm.companyName"
          placeholder="请输入"
          maxlength="64"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="企业规模" prop="industrySizeId">
        <el-select v-model="caseForm.industrySizeId" placeholder="请选择">
          <el-option
            v-for="item in resBean.industrySizeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="企业行业" prop="industryIdList">
        <el-select
          v-model="caseForm.industryIdList"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in resBean.industryList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="公司地址" prop="companyAddress">
        <el-input
          v-model="caseForm.companyAddress"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="案例标题" prop="title">
        <el-input v-model="caseForm.title" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="案例文章" prop="content">
        <KrEditor v-model="caseForm.content" />
      </el-form-item>

      <el-form-item class="dialog-footer">
        <el-button
          type="primary"
          @click="onModSubmit"
          v-permission="['caseMod']"
        >
          确 定
        </el-button>
        <el-button @click="onModClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { modInit, mod, searchProduct, searchBrand } from '@/api/case'
import { useStore } from 'vuex'
// 富文本编辑器组件
import KrEditor from '@/globalComponents/krEditor'
const route = useRoute()
const caseForm = reactive({
  logo: '',
  productId: '',
  brandId: '',
  industrySizeId: '',
  companyAddress: '',
  title: '',
  companyName: '',
  content: '',
  brandName: ''
})

const tmpProductList = ref([])
const tmpBrandList = ref([])

const resBean = ref({
  industryList: [],
  industrySizeList: []
})
const defaultLogos = ref([])

const searchBrandFunc = (query) => {
  searchBrand({
    partnerName: query
  }).then((res) => {
    tmpBrandList.value = res.partnerList.map((i) => {
      return { code: i.partnerId, name: i.partnerName, ...i }
    })
  })
}

const selectBrandChangeFunc = (id) => {
  const selectBrand = tmpBrandList.value.find((i) => {
    return i.code === id
  })
  caseForm.brandName = selectBrand.name
  caseForm.companyName = selectBrand.partnerCompanyName
  caseForm.industrySizeId = selectBrand.partnerIndustrySizeId
  caseForm.industryIdList = selectBrand.partnerIndustryId
}

const searchProductFunc = (query) => {
  searchProduct({
    productName: query
  }).then((res) => {
    tmpProductList.value = res.productList
  })
}
// 修改初始化
const modInitFunc = async () => {
  const { caseInfo, industryList, industrySizeList } = await modInit({
    caseId: route.query.id
  })

  resBean.value = { industryList, industrySizeList }
  if (caseInfo.logo) {
    defaultLogos.value = [
      {
        name: caseInfo.logo,
        url: caseInfo.logo
      }
    ]
  }
  Object.assign(caseForm, caseInfo)
  const resProduct = ref([
    {
      code: caseInfo.productId,
      name: caseInfo.productName
    }
  ])
  tmpProductList.value = resProduct.value
  // const resBrand = ref([
  //   {
  //     code: caseInfo.brandId,
  //     name: caseInfo.brandName
  //   }
  // ])
  // tmpBrandList.value = resBrand.value
  caseForm.brandName = caseInfo.brandName
}

const onModSubmit = async () => {
  const result = await mod({
    caseId: Number(route.query.id),
    ...caseForm
  })
  clear()
  router.push({ path: '/case/list' })
  ElNotification({
    title: 'Success',
    message: '修改成功',
    type: 'success'
  })
}
const router = useRouter()
const curTagsView = ref([])
const routePath = ref('')
const store = useStore()
const clear = () => {
  // 删除当前tag
  let arr = curTagsView.value.map((item) => {
    return item.path
  })
  let idx = arr.indexOf(routePath.value)
  store.commit('app/removeTagsView', {
    type: 'index',
    index: idx
  })
}
const onModClose = () => {
  clear()
  router.push({ path: '/case/list' })
}
const initFunc = () => {
  modInitFunc()
}

initFunc()
</script>
