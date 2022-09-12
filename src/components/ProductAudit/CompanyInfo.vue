<template>
  <div>
    <el-form
      ref="resetFormData"
      :disabled="true"
      :model="baseCompanyFrom"
      label-width="100px"
    >
      <el-form-item label="公司名称" prop="companyName">
        {{ baseCompanyFrom.companyName || '-' }}
      </el-form-item>
      <el-form-item label="融资轮次" prop="financingRound">
        {{ baseCompanyFrom.financingRound || '-' }}
      </el-form-item>
      <el-form-item label="咨询电话" prop="mobile">
        {{ baseCompanyFrom.mobile || '-' }}
      </el-form-item>
      <el-form-item label="成立日期" prop="establishTime">
        {{ baseCompanyFrom.establishTime || '-' }}
      </el-form-item>
      <el-form-item label="公司地址" prop="name">
        <el-cascader
          v-model="baseCompanyFrom.cityId"
          maxlength="64"
          show-word-limit
          class="fieldwidth"
          placeholder="请选择公司地址"
          :options="CityOptions"
          :props="cityOptionsProps"
          separator="-"
          filterable
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        {{ baseCompanyFrom.address || '-' }}
      </el-form-item>
      <el-form-item label="公司规模" prop="industrySizeId">
        {{ industrySizeName }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSessionItem } from '@/utils/storage'
import { companyModInit } from '@/api/productTab'
import area from '@/utils/area.js'
import { companyInfoInitApi } from '@/api/productReview'
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

const CityOptions = ref([])
// 分类options
const cityOptionsProps = {
  expandTrigger: 'hover',
  emitPath: false
}
const provinceList = area.province_list
const getCityOptions = (provinceObj) => {
  for (const prop in provinceObj) {
    let propObj = {
      label: provinceObj[prop],
      value: prop,
      key: prop,
      isLeaf: false,
      children: []
    }
    const startStr = propObj.value.slice(0, 2)
    const cityObj = area.city_list
    for (const city in cityObj) {
      if (startStr === 90) {
        if (city.slice(0, 1) === 9) {
          propObj.children.push({
            label: cityObj[city],
            value: city,
            key: city,
            leaf: true
          })
        }
      } else {
        if (startStr === city.slice(0, 2)) {
          propObj.children.push({
            label: cityObj[city],
            value: city,
            key: city,
            leaf: true
          })
        }
      }
    }
    CityOptions.value.push(propObj)
  }
}
getCityOptions(provinceList)

const industrySizeName = ref('')
const baseCompanyFrom = reactive({
  companyName: '',
  financingRound: '',
  establishTime: '',
  mobile: '',
  cityId: '',
  address: '',
  industrySizeId: ''
})
const industrySizeList = ref([])
// 编辑初始化
const modInit = async () => {
  const data = await companyModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  let list = data?.industrySizeList || []
  let industrySizeObj = list.find((item) => {
    return item.code === data.industrySizeId
  })
  industrySizeName.value = industrySizeObj.name || '-'
  Object.assign(baseCompanyFrom, data)
  baseCompanyFrom.cityId = String(data?.cityId || '')
}

const companyInit = () => {
  modInit()
}
// 审核查看初始化
const viewInit = async () => {
  const data = await companyInfoInitApi({ id: queryProductId.value })
  industrySizeList.value = data?.industrySizeList || []
  Object.assign(baseCompanyFrom, data)
  baseCompanyFrom.cityId = String(data?.cityId || '')
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})
defineExpose({
  companyInit
})
</script>
