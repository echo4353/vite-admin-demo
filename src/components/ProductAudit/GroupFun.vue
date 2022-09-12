<template>
  <div>
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
            <p class="group-name">{{ item.groupName }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { groupModInit } from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
import { groupInfoInitApi } from '@/api/productReview'
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
const groupList = ref([])
// 编辑初始化
const modInit = async () => {
  const data = await groupModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  groupList.value = data.groupList || []
}
// 审核初始化
const viewInit = async () => {
  const data = await groupInfoInitApi({ id: queryProductId.value })
  groupList.value = data.groupList || []
}
const groupFunInit = () => {
  modInit()
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})
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
