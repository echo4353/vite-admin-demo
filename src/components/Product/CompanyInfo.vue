<template>
  <div>
    <el-form
      ref="resetFormData"
      :disabled="baseCompanyFromDisabled || isSaved"
      :model="baseCompanyFrom"
      label-width="100px"
    >
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="baseCompanyFrom.companyName"
          maxlength="64"
          show-word-limit
          placeholder="请输入公司名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="融资轮次" prop="financingRound">
        <el-input
          v-model="baseCompanyFrom.financingRound"
          placeholder="请输入融资轮次"
        ></el-input>
      </el-form-item>
      <el-form-item label="咨询电话" prop="mobile">
        <el-input
          oninput="value=value.replace(/[^0-9 || \-.]/g,'')"
          v-model="baseCompanyFrom.mobile"
          placeholder="请输入咨询电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="成立日期" prop="establishTime">
        <el-date-picker
          type="date"
          v-model="baseCompanyFrom.establishTime"
          format="YYYY-MM-DD hh:mm:ss"
          value-format="YYYY-MM-DD hh:mm:ss"
          placeholder="请选择成立日期"
        />
      </el-form-item>
      <el-form-item label="公司地址" prop="name">
        <el-cascader
          v-model="baseCompanyFrom.cityId"
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
        <el-input
          maxlength="64"
          show-word-limit
          v-model="baseCompanyFrom.address"
          placeholder="请输入详细地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="公司规模" prop="industrySizeId">
        <el-select
          v-model="baseCompanyFrom.industrySizeId"
          placeholder="请选择"
        >
          <el-option
            v-for="item in industrySizeList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          v-if="saveFlag && !isSaved"
          >保存</el-button
        >
        <el-button v-else type="success" disabled>已保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { setSessionItem, getSessionItem } from '@/utils/storage'
import {
  companyAddInit,
  companyAdd,
  companyModInit,
  companyMod
} from '@/api/productTab'
import area from '@/utils/area.js'

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
  return getSessionItem('companyInfoSave') || false
})
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

const baseCompanyFromDisabled = ref(false)
const saveFlag = ref(true)
const baseCompanyFrom = reactive({
  companyName: '',
  financingRound: '',
  establishTime: '',
  mobile: '',
  cityId: '',
  address: '',
  industrySizeId: ''
})
const timerPickerOptions = {
  disabledDate: (time) => {
    return time.getTime() > new Date().getTime()
  }
}
// 保存
const submitForm = async (formEl) => {
  if (props.isMod && modId.value) {
    companyMod({
      ...baseCompanyFrom,
      id: modId.value,
      productId: getSessionItem('productId') || queryProductId.value
    }).then((res) => {
      ElNotification({
        title: 'Success',
        message: '修改成功',
        type: 'success'
      })
      modInit()
    })
  } else {
    companyAdd({
      ...baseCompanyFrom,
      productId: getSessionItem('productId') || queryProductId.value
    }).then((res) => {
      saveFlag.value = false
      baseCompanyFromDisabled.value = true
      setSessionItem('companyInfoSave', true)
      ElNotification({
        title: 'Success',
        message: '保存成功',
        type: 'success'
      })
      modInit()
    })
  }
}
// 公司规模
const industrySizeList = ref([])
const modId = ref('')
// 新增初始化
const addInit = async () => {
  const res = await companyAddInit({})
  industrySizeList.value = res.industrySizeList
}
// 编辑初始化
const modInit = async () => {
  const data = await companyModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  modId.value = data.id
  industrySizeList.value = data?.industrySizeList || []
  Object.assign(baseCompanyFrom, data)
  baseCompanyFrom.industrySizeId =
    data.industrySizeId === 0 ? '' : data.industrySizeId
  baseCompanyFrom.cityId = String(data?.cityId || '')
}

const companyInit = () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  } else {
    addInit()
  }
}

defineExpose({
  companyInit
})
</script>
