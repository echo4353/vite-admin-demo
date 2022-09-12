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
            <p class="group-logo">
              <img :src="item.logo" :alt="item.partnerName" />
            </p>
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { partnerModInit } from '@/api/productTab'
import { getSessionItem } from '@/utils/storage'
import { partnerInfoInitApi } from '@/api/productReview'
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
// 合作品牌
const partnerForm = reactive({
  logo: '',
  name: '',
  industryId: '',
  companyName: '',
  industrySizeId: ''
})
const industryList = ref([])
const industrySizeList = ref([])
const groupList = ref([])
// 编辑初始化
const modInit = async () => {
  const data = await partnerModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  industryList.value = data.industryList
  industrySizeList.value = data.industrySizeList
  groupList.value = data.partnerList
}
// 审核初始化
const viewInit = async () => {
  const data = await partnerInfoInitApi({ id: queryProductId.value })
  industryList.value = data.industryList
  industrySizeList.value = data.industrySizeList
  groupList.value = data.partnerList
}
const partnerInit = async () => {
  modInit()
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})
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
