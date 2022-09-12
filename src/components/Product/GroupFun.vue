<template>
  <div>
    <el-divider content-position="left">
      <el-button type="primary" @click="addGroup">新增功能组</el-button>
    </el-divider>
    <div class="cardWrap">
      <el-card
        v-for="item in groupListCard"
        :key="item.id"
        class="box-card"
        style="width: 350px; margin: 13px"
      >
        <template #header>
          <div
            class="card-header"
            style="display: flex; justify-content: space-between"
          >
            <p class="group-name">{{ item.groupName }}</p>

            <div v-if="isMod" style="width: 100%">
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
          <li v-for="fun in item.functionList" :key="fun.id" class="text item">
            <div class="funWrap">
              <p class="funName">{{ fun.functionName }}</p>
              <p class="funIntro">{{ fun.functionIntro }}</p>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
    <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h4>产品功能</h4>
      </template>
      <template #default>
        <el-form ref="dynamicFormRef" :model="dynamicValidateForm">
          <el-form-item
            label="功能组名称"
            prop="groupName"
            :rules="[
              {
                required: true,
                message: '请输入功能组名称',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="dynamicValidateForm.groupName"
              placeholder="请输入功能组名称"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-divider border-style="dashed" />
          <el-card
            v-for="(domain, index) in dynamicValidateForm.functionList"
            :key="domain.key"
            style="margin-top: 10px"
          >
            <el-form-item
              label="功能名称"
              :prop="'functionList.' + index + '.functionName'"
              :rules="{
                required: true,
                message: '请输入功能名称',
                trigger: 'blur'
              }"
            >
              <el-input
                v-model="domain.functionName"
                placeholder="请输入功能名称"
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="功能描述"
              :prop="'functionList.' + index + '.functionIntro'"
              :rules="{
                required: true,
                message: '请输入功能描述',
                trigger: 'blur'
              }"
            >
              <el-input
                type="textarea"
                v-model="domain.functionIntro"
                placeholder="请输入功能描述"
                maxlength="100"
                :rows="5"
                show-word-limit
              />
            </el-form-item>

            <el-button
              type="danger"
              class="mt-2"
              icon="Delete"
              @click.prevent="removeDomain(domain)"
              v-if="index !== 0"
              >删除</el-button
            >
          </el-card>
        </el-form>
        <el-button
          type="primary"
          round
          icon="Plus"
          style="margin-top: 10px"
          @click="addFun"
          >新增功能</el-button
        >
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick(dynamicFormRef)"
            >确认</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import {
  groupAdd,
  groupModInit,
  groupModGroup,
  groupDelGroup
} from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
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
// 功能组列表
const groupListCard = ref([])
// 功能组
const dynamicFormRef = ref(null)
const dynamicValidateForm = reactive({
  functionList: [
    {
      key: Date.now(),
      functionName: '',
      functionIntro: ''
    }
  ],
  groupName: ''
})
const saveFlag = ref(true)
// 新增功能
const addFun = () => {
  dynamicValidateForm.functionList.push({
    key: Date.now(),
    functionName: '',
    functionIntro: ''
  })
}
// 删除功能
const removeDomain = (item) => {
  const index = dynamicValidateForm.functionList.indexOf(item)
  if (index !== -1) {
    dynamicValidateForm.functionList.splice(index, 1)
  }
}

const drawer = ref(false)
const isAdd = ref(false)
const direction = ref('rtl')
// 新增功能组
const addGroup = () => {
  drawer.value = true
  isAdd.value = true
  dynamicValidateForm.groupName = ''
  dynamicValidateForm.functionList = [
    {
      key: Date.now(),
      functionName: '',
      functionIntro: ''
    }
  ]
}
// 编辑
const modVal = ref(0)
const goEdit = (val) => {
  Object.assign(dynamicValidateForm, JSON.parse(JSON.stringify(val)))
  modVal.value = val.id
  drawer.value = true
}
// 删除功能组
const goDel = async (val) => {
  await groupDelGroup({
    id: val.id
  })
  modInit()
}
const cancelClick = () => {
  drawer.value = false
}
const confirmClick = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (isAdd.value || !props.isMod) {
        await groupAdd({
          ...dynamicValidateForm,
          productId: getSessionItem('productId') || queryProductId.value
        })
        isAdd.value = false
        drawer.value = false
        ElNotification({
          title: 'Success',
          message: '保存成功',
          type: 'success'
        })
        modInit()
      } else {
        await groupModGroup({
          id: modVal.value,
          productId: getSessionItem('productId') || queryProductId.value,
          ...dynamicValidateForm
        })
        drawer.value = false
        ElNotification({
          title: 'Success',
          message: '修改成功',
          type: 'success'
        })
        modInit()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 编辑初始化
const modInit = async () => {
  const data = await groupModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  groupListCard.value = data.groupList
}

const groupFunInit = () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  }
}

defineExpose({
  groupFunInit
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
.group-name {
  color: #000;
  white-space: pre-wrap;
  width: 130px;
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
