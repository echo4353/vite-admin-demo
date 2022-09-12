<template>
  <div>
    <el-card>
      <div class="content-box">
        <div v-if="infoType === 0" class="img-wrap">
          <img :src="resdecorateForm.image" :alt="resdecorateForm.image" />
        </div>
        <div v-if="infoType === 1 && resdecorateForm.attachment">
          <video
            playsinline
            webkit-playsinline
            width="100%"
            height="308px"
            class="video"
            controls
          >
            <source :src="resdecorateForm.attachment" type="video/mp4" />
            您的浏览器不支持 video 标签。
          </video>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSessionItem } from '@/utils/storage'
import { decorateModInit } from '@/api/productTab'
import { decorateInfoInitApi } from '@/api/productReview'
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

// 产品页装修
const defaultLogos = ref([])
const modFlag = ref(true)
const infoType = ref(0)
const decorateForm = reactive({
  type: 0,
  image: '',
  attachment: ''
})
const resdecorateForm = reactive({
  image: '',
  attachment: ''
})
const defaultVideos = ref([])

// 编辑初始化
const modInit = async () => {
  const data = await decorateModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  modId.value = data.id
  infoType.value = data.type
  resdecorateForm.image = data.image
  resdecorateForm.attachment = data.attachment
  defaultVideos.value = [{ name: data.attachment, url: data.attachment }]
  if (data.image) {
    defaultLogos.value = [
      {
        name: data.image,
        url: data.image
      }
    ]
  }
}
// 审核初始化
const viewInit = async () => {
  const data = await decorateInfoInitApi({ id: queryProductId.value })
  infoType.value = data.type
  resdecorateForm.image = data.image || ''
  resdecorateForm.attachment = data.attachment
}
const decorateInit = () => {
  modInit()
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})
defineExpose({
  decorateInit
})
</script>

<style lang="less" scoped>
ul li {
  list-style: none;
}
.content-box {
  width: 100%;
  height: 400px;
  .img-wrap {
    margin-top: 10px;
  }
  img {
    height: 308px;
    width: 100%;
    object-fit: cover;
  }
}
.video {
  width: 100%;
  height: 308px;
  object-fit: cover;
}
</style>
