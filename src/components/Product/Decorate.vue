<template>
  <div>
    <el-divider content-position="left">
      <div v-if="modFlag && !isSaved">
        <el-button type="primary" @click="addDecorate" v-if="!isMod"
          >新增</el-button
        >
        <el-button type="primary" @click="modDecorate" v-else>编辑</el-button>
      </div>
      <div v-else>
        <el-button type="success" disabled>已保存</el-button>
      </div>
    </el-divider>
    <el-card>
      <div class="content-box">
        <div v-if="infoType === 0">
          <div v-if="infoType === 0 && resdecorateForm.image" class="img-wrap">
            <img :src="resdecorateForm.image" :alt="resdecorateForm.image" />
          </div>
          <div v-else>暂无数据</div>
        </div>
        <div v-if="infoType === 1">
          <div v-if="infoType === 1">
            <video
              v-if="videoFlag"
              playsinline
              webkit-playsinline
              width="100%"
              height="300px"
              class="video"
              controls
              :poster="posterImage"
            >
              <source :src="resdecorateForm.attachment" type="video/mp4" />
              您的浏览器不支持 video 标签。
            </video>
          </div>
          <div v-else>暂无数据</div>
        </div>
      </div>
    </el-card>
    <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h4>产品页装修</h4>
      </template>
      <template #default>
        <el-form
          :model="decorateForm"
          ref="decorateFormRef"
          label-width="100px"
        >
          <el-form-item label="海报类型">
            <el-radio-group v-model="decorateForm.type" @change="radioChange">
              <el-radio :label="0">图片海报</el-radio>
              <el-radio :label="1">视频海报</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            prop="image"
            :rules="{
              required: true,
              message: '请上传海报图片',
              trigger: 'change'
            }"
            label="图片"
            v-if="decorateForm.type === 0"
          >
            <kr-upload
              v-model="decorateForm.image"
              :logos="defaultLogos"
              :krLimit="1"
              :krSize="10"
              tips="建议尺寸为1140*309，小于10M，JPG/PNG/SVG格式"
            ></kr-upload>
          </el-form-item>
          <el-form-item
            prop="attachment"
            :rules="{
              required: true,
              message: '请上传海报视频',
              trigger: 'change'
            }"
            label="视频"
            v-if="decorateForm.type === 1"
          >
            <KrUploadVideo
              v-model="decorateForm.attachment"
              :videos="defaultVideos"
            />
          </el-form-item>
          <el-form-item
            prop="image2"
            :rules="{
              required: true,
              message: '请上传视频封面',
              trigger: 'change'
            }"
            label="视频封面"
            v-if="decorateForm.type === 1"
          >
            <kr-upload
              v-model="decorateForm.image2"
              :logos="defaultVideoLogos"
              :krLimit="1"
              :krSize="10"
              tips="建议尺寸为1140*309，小于10M，JPG/PNG/SVG格式"
            ></kr-upload>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick(decorateFormRef)"
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
import { setSessionItem, getSessionItem } from '@/utils/storage'
import KrUploadVideo from '@/globalComponents/krUploadVideo'
import { decorateAdd, decorateModInit, decorateMod } from '@/api/productTab'
const props = defineProps({
  isMod: {
    type: Boolean,
    required: false,
    default: false
  }
})
const videoFlag = ref(true)
const posterImage = ref(null)
const route = useRoute()
const queryProductId = ref(null)
const decorateFormRef = ref(null)
queryProductId.value = route.query?.id ?? null
const isSaved = computed(() => {
  return getSessionItem('decorateInfoSave') || false
})
// 产品页装修
const defaultLogos = ref([])
const modFlag = ref(true)
const infoType = ref(0)
const decorateForm = reactive({
  type: 0,
  image: '',
  image2: '',
  attachment: ''
})
const resdecorateForm = reactive({
  image: '',
  attachment: ''
})
const defaultVideos = ref([])
const defaultVideoLogos = ref([])
const drawer = ref(false)
const direction = ref('rtl')
const addDecorate = () => {
  drawer.value = true
}
// 编辑
const modDecorate = (val) => {
  drawer.value = true
  decorateForm.type = infoType.value
  if (infoType.value === 0) {
    decorateForm.image = resdecorateForm.image
  } else if (infoType.value === 1) {
    decorateForm.image2 = resdecorateForm.image2
    decorateForm.attachment = resdecorateForm.attachment
    defaultVideos.value = [
      { name: resdecorateForm.attachment, url: resdecorateForm.attachment }
    ]
    defaultVideoLogos.value = [
      {
        name: resdecorateForm.image2,
        url: resdecorateForm.image2
      }
    ]
  }
}

const cancelClick = () => {
  drawer.value = false
}
const radioChange = (val) => {
  decorateForm.image = ''
  decorateForm.image2 = ''
  decorateForm.attachment = ''
}
const modId = ref(null)
// 保存
const confirmClick = async (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (decorateForm.type === 1) {
        decorateForm.image = decorateForm.image2
      }
      let params = {
        ...decorateForm
      }
      params.image2 = null
      if (props.isMod && modId.value) {
        await decorateMod({
          id: modId.value,
          productId: getSessionItem('productId') || queryProductId.value,
          ...params
        })
        drawer.value = false
        modInit()
      } else {
        await decorateAdd({
          productId: getSessionItem('productId') || queryProductId.value,
          ...params
        })
        if (!props.isMod) {
          setSessionItem('decorateInfoSave', true)
          modFlag.value = false
        }
        drawer.value = false

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
  videoFlag.value = false
  const data = await decorateModInit({
    productId: getSessionItem('productId') || queryProductId.value
  })
  modId.value = data.id
  infoType.value = data.type

  if (data.type === 0 && data.image) {
    decorateForm.type = 0
    resdecorateForm.image = data.image
    defaultLogos.value = [
      {
        name: data.image,
        url: data.image
      }
    ]
  }
  if (data.type === 1 && data.image) {
    videoFlag.value = true
    posterImage.value = data.image
    resdecorateForm.image2 = data.image
    resdecorateForm.attachment = data.attachment
  }
}
const decorateInit = () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  }
}
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
    height: 300px;
    width: 100%;
    object-fit: cover;
  }
}
.video {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
