<template>
  <div>
    <!-- 产品特色 -->
    <div class="card">
      <div class="qs-title">
        <span class="title-text">产品特色</span>
        <span class="pay-version-icon"></span>
      </div>
      <el-button
        v-if="!isReadOnly"
        class="space-right-btn"
        @click="onAdd('productFeature')"
      >
        <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
        添加特色描述
      </el-button>
      <ul class="features-list" v-if="data.featureList">
        <li v-for="(item, i) in data.featureList" :key="item.id + i">
          <div class="btn-box" v-if="!isReadOnly">
            <el-button
              class="del"
              size="large"
              shape="circle"
              @click="onFileDelete(item)"
            >
              <SvgIcon icon="el-icon-Delete" class="icon-delete" />
              <span class="tips-label">删除</span>
            </el-button>
            <el-button size="large" shape="circle" @click="onFeatureEdit(item)">
              <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
              <span class="tips-label">编辑</span>
            </el-button>
          </div>
          <img
            :src="item.image"
            class="features-img"
            fit="cover"
            v-if="!isReadOnly"
          />
          <div
            class="demo-image__preview"
            v-if="isReadOnly"
            style="text-align: center"
          >
            <el-image
              style="width: 100px; height: 100px"
              :src="item.image"
              :preview-src-list="[item.image]"
              fit="cover"
            />
          </div>
          <div class="title1">{{ item.title }}</div>
          <div class="title2">{{ item.description }}</div>
        </li>
      </ul>
    </div>
    <!-- 获奖信息 -->
    <div class="card">
      <div class="qs-title">
        <span class="pay-title">获奖信息</span>
        <span class="pay-version-icon"></span>
      </div>
      <el-button
        v-if="!isReadOnly"
        class="space-right-btn"
        @click="onAdd('awardInfo')"
      >
        <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
        添加获奖信息
      </el-button>
      <ul class="card-ul">
        <li v-for="(item, i) in data.awardInfoList" :key="i" class="award-line">
          <div class="award-title">{{ item.name }}</div>
          <div class="award-wrap" v-if="item.images">
            <div
              v-for="(img, index) in item.images"
              :key="index"
              style="margin-right: 20px"
            >
              <div
                class="demo-image__preview"
                style="text-align: center"
              >
                <el-image
                  class="award-cover"
                  style="width: 100px; height: 100px"
                  :src="img"
                  :preview-src-list="[item.images]"
                  fit="cover"
                />
              </div>
            </div>
          </div>
          <div class="btn-box" v-if="!isReadOnly">
            <el-button
              class="del"
              size="large"
              shape="circle"
              @click="onAwardDelete(item)"
            >
              <SvgIcon icon="el-icon-Delete" class="icon-delete" />
              <span class="tips-label">删除</span>
            </el-button>
            <el-button size="large" shape="circle" @click="onAwardEdit(item)">
              <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
              <span class="tips-label">编辑</span>
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 官方视频 -->
    <div class="card">
      <div class="qs-title">
        <span class="pay-title">官方视频</span>
        <span class="pay-version-icon"></span>
      </div>
      <el-button
        v-if="!isReadOnly"
        class="space-right-btn"
        @click="onAdd('officialVideo')"
      >
        <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
        添加视频
      </el-button>

      <ul class="video-list" v-if="data.officialVideoList">
        <li v-for="(item, i) in data.officialVideoList" :key="item.id + i">
          <div class="btn-box" v-if="!isReadOnly">
            <el-button
              class="del"
              size="large"
              shape="circle"
              @click="onFileDelete(item)"
            >
              <SvgIcon icon="el-icon-Delete" class="icon-delete" />
              <span class="tips-label">删除</span>
            </el-button>
            <el-button size="large" shape="circle" @click="onVideoEdit(item)">
              <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
              <span class="tips-label">编辑</span>
            </el-button>
          </div>
          <img :src="item.image" class="cover" fit="cover" />
          <div class="title-box">
            <span class="title">{{ item.title }}</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 资料下载 -->
    <div class="card">
      <div class="qs-title">
        <span class="pay-title">资料下载</span>
        <span class="pay-version-icon"></span>
      </div>
      <el-button
        v-if="!isReadOnly"
        class="space-right-btn"
        @click="onAdd('dataDownload')"
      >
        <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
        添加资料
      </el-button>
      <ul class="file-list" v-if="data.dataDownloadList">
        <li v-for="(item, i) in data.dataDownloadList" :key="item.id + i">
          <div class="btn-box" v-if="!isReadOnly">
            <el-button
              class="del"
              size="large"
              shape="circle"
              @click="onFileDelete(item)"
            >
              <SvgIcon icon="el-icon-Delete" class="icon-delete" />
              <span class="tips-label">删除</span>
            </el-button>
            <el-button size="large" shape="circle" @click="onFileEdit(item)">
              <SvgIcon icon="el-icon-EditPen" class="icon-edit" />
              <span class="tips-label">编辑</span>
            </el-button>
          </div>
          <img :src="item.image" class="cover" fit="cover" v-if="!isReadOnly" />
          <div
            class="demo-image__preview"
            v-if="isReadOnly"
            style="text-align: center"
          >
            <el-image
              style="width: 100px; height: 100px"
              :src="item.image"
              :preview-src-list="[item.image]"
              fit="cover"
            />
          </div>
          <div class="title-box">
            <span class="title">{{ item.title }}</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 产品特色描述 -->
    <el-drawer
      v-model="featureVisible"
      :direction="'rtl'"
      @close="onClose('productFeature')"
      :title="`${featureModId ? '编辑' : '添加'}产品特色描述`"
    >
      <el-form
        :model="featureForm"
        label-width="120px"
        ref="featureRef"
        :rules="{
          image: { required: true, message: '上传配图', trigger: 'change' },
          title: {
            required: true,
            message: '请输入描述标题',
            trigger: 'blur'
          },
          description: {
            required: true,
            message: '请输入产品特色描述',
            trigger: 'blur'
          }
        }"
      >
        <el-form-item label="配图" prop="image">
          <KrUpload
            v-if="featureVisible"
            v-model="featureForm.image"
            :logos="defaultFeatureCover"
            :krLimit="1"
            :krSize="10"
            tips="建议尺寸190*112 jpg/png/bmp/svg格式小于10M的图片"
          />
        </el-form-item>
        <el-form-item label="描述标题" prop="title">
          <el-input
            placeholder="请输入"
            v-model="featureForm.title"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input
            v-model="featureForm.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="onClose('productFeature')">取消</el-button>
          <el-button type="primary" @click="onConfirm('productFeature')"
            >确定</el-button
          >
        </div>
      </template>
    </el-drawer>
    <!-- 获奖信息 -->
    <el-drawer
      v-model="awardVisible"
      :direction="'rtl'"
      @close="onClose('awardInfo')"
      title="获奖信息"
    >
      <el-form label-width="120px" :model="awardForm" ref="awardInfoRef">
        <el-form-item
          label="获奖名称"
          prop="name"
          :rules="{
            required: true,
            message: '请输入获奖名称',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="awardForm.name"
            placeholder="请输入"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="获奖证书"
          prop="images"
          :rules="{
            required: true,
            message: '上传获奖证书',
            trigger: 'change'
          }"
        >
          <KrUpload
            v-if="awardVisible"
            v-model:images="awardForm.images"
            :logos="defaultAwardCovers"
            :krLimit="99"
            tips="宽437长613"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="onClose('awardInfo')">取消</el-button>
          <el-button type="primary" @click="onConfirm('awardInfo')"
            >确定</el-button
          >
        </div>
      </template>
    </el-drawer>
    <!-- 官方视频 -->
    <el-drawer
      v-model="videoVisible"
      :direction="'rtl'"
      @close="onClose('officialVideo')"
      :title="`${videoModId ? '编辑' : '添加'}官方视频`"
    >
      <el-form label-width="120px" :model="videoForm" ref="videoRef">
        <el-form-item
          label="添加视频"
          prop="attachment"
          :rules="{
            required: true,
            message: '请上传视频',
            trigger: 'blur'
          }"
        >
          <KrUploadVideo
            v-if="videoVisible"
            v-model="videoForm.attachment"
            :videos="defaultVideos"
          />
        </el-form-item>
        <el-form-item
          label="封面"
          prop="image"
          :rules="{
            required: true,
            message: '请上传封面',
            trigger: 'blur'
          }"
        >
          <KrUpload
            v-if="videoVisible"
            v-model="videoForm.image"
            :logos="defaultVideoCover"
            :krLimit="1"
            :krSize="10"
            tips="建议尺寸为486*318，小于10M，JPG/PNG/SVG格式"
          ></KrUpload>
        </el-form-item>

        <el-form-item
          label="视频标题"
          prop="title"
          :rules="{
            required: true,
            message: '请输入视频标题',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="videoForm.title"
            placeholder="请输入视频标题"
            maxlength="25"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="onClose('officialVideo')">取消</el-button>
          <el-button type="primary" @click="onConfirm('officialVideo')"
            >确定</el-button
          >
        </div>
      </template>
    </el-drawer>
    <!-- 资料上传 -->
    <el-drawer
      v-model="fileVisible"
      :direction="'rtl'"
      @close="onClose('dataDownload')"
      :title="`${fileModId ? '编辑' : '添加'}资料`"
    >
      <el-form label-width="120px" :model="fileForm" ref="fileRef">
        <el-form-item
          label="添加资料"
          prop="attachment"
          :rules="{
            required: true,
            message: '请上传资料',
            trigger: 'blur'
          }"
        >
          <KrUploadFile
            v-if="fileVisible"
            v-model="fileForm.attachment"
            :tips="'最大200M,支持ppt/pptx/pdf/doc/docx/xls/xlsx'"
          />
        </el-form-item>
        <el-form-item
          label="封面"
          prop="image"
          :rules="{
            required: true,
            message: '请上传封面',
            trigger: 'blur'
          }"
        >
          <KrUpload
            v-if="fileVisible"
            v-model="fileForm.image"
            :logos="defaultFileCover"
            :krLimit="1"
            :krSize="10"
            tips="建议尺寸为182*122，小于10M，JPG/PNG/SVG格式"
          ></KrUpload>
        </el-form-item>

        <el-form-item
          label="资料标题"
          prop="title"
          :rules="{
            required: true,
            message: '请输入资料标题',
            trigger: 'blur'
          }"
        >
          <el-input
            v-model="fileForm.title"
            placeholder="请输入资料标题"
            maxlength="25"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="onClose('dataDownload')">取消</el-button>
          <el-button type="primary" @click="onConfirm('dataDownload')"
            >确定</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  brandModInit,
  brandModAwardApi,
  brandModFeatureApi,
  brandAwardDelApi,
  brandModVideoApi,
  brandModDataApi,
  brandAddFeature,
  brandDelApi,
  brandAddAward,
  brandAddVideo,
  brandAddData
} from '@/api/productTab'
import { brandInfoInitApi } from '@/api/productReview'
import KrUploadVideo from '@/globalComponents/krUploadVideo'
import KrUploadFile from '@/globalComponents/krUploadFile'
import { useRoute } from 'vue-router'
import { getSessionItem } from '@/utils/storage'
const props = defineProps({
  isReadOnly: {
    type: Boolean,
    required: false
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

// 产品特色编辑
const featureRef = ref(null)
const featureVisible = ref(false)
const featureForm = reactive({
  image: '',
  title: '',
  description: ''
})
const featureModId = ref(null)
const defaultFeatureCover = ref([])
const onFeatureEdit = async (data) => {
  featureModId.value = data.id
  Object.assign(featureForm, data)
  defaultFeatureCover.value = [
    {
      name: data.image,
      url: data.image
    }
  ]
  featureVisible.value = true
}

// 获奖信息
const awardInfoRef = ref(null)
const awardForm = reactive({
  name: '',
  images: []
})
const awardVisible = ref(false)
const awardModId = ref(null)
const defaultAwardCovers = ref([])
const onAwardEdit = async (item) => {
  awardModId.value = item.id
  Object.assign(awardForm, item)
  defaultAwardCovers.value =
    item.images &&
    item.images.map((i) => {
      return {
        name: i,
        url: i
      }
    })
  awardVisible.value = true
}
const onAwardDelete = async (item) => {
  await brandAwardDelApi({
    id: item.id
  })
  modInit()
}

// 视频
const videoRef = ref(null)
const videoVisible = ref(false)
const videoForm = reactive({
  title: '',
  attachment: '',
  image: ''
})
const videoModId = ref(null)
const defaultVideoCover = ref([])
const defaultVideos = ref([])
const onVideoEdit = async (data) => {
  videoModId.value = data.id
  Object.assign(videoForm, data)
  defaultVideoCover.value = data.image
    ? [
        {
          name: data.image,
          url: data.image
        }
      ]
    : []
  defaultVideos.value = [{ name: data.attachment, url: data.attachment }]
  videoVisible.value = true
}

// 资料下载
const fileRef = ref(null)
const fileVisible = ref(false)
const fileForm = reactive({
  title: '',
  attachment: '',
  image: ''
})
const fileModId = ref(null)
const defaultFileCover = ref([])
const onFileEdit = async (data) => {
  fileModId.value = data.id
  Object.assign(fileForm, data)
  defaultFileCover.value = [
    {
      name: data.image,
      url: data.image
    }
  ]
  fileVisible.value = true
}

const onReset = (key) => {
  switch (key) {
    case 'productFeature':
      featureRef.value && featureRef.value.resetFields()
      Object.keys(featureForm).forEach((key) => (featureForm[key] = ''))
      break
    case 'awardInfo':
      awardInfoRef.value && awardInfoRef.value.resetFields()
      awardForm.name = ''
      awardForm.images = []
      break
    case 'officialVideo':
      videoRef.value && videoRef.value.resetFields()
      Object.keys(videoForm).forEach((key) => (videoForm[key] = ''))
      break
    case 'dataDownload':
      fileRef.value && fileRef.value.resetFields()
      Object.keys(fileForm).forEach((key) => (fileForm[key] = ''))
      break
  }
}
const onClose = (key) => {
  switch (key) {
    case 'productFeature':
      onReset('productFeature')
      featureVisible.value = false
      break
    case 'awardInfo':
      onReset('awardInfo')
      awardVisible.value = false
      break
    case 'officialVideo':
      onReset('officialVideo')
      videoVisible.value = false
      break
    case 'dataDownload':
      onReset('dataDownload')
      fileVisible.value = false
      break
  }
}
const onAdd = (key) => {
  switch (key) {
    case 'productFeature':
      if (data.featureList.length === 4) {
        ElMessage({
          type: 'warning',
          message: '最多上传4个'
        })
        return
      }
      defaultFeatureCover.value = []
      featureModId.value = undefined
      featureVisible.value = true
      break
    case 'awardInfo':
      awardModId.value = undefined
      awardVisible.value = true
      defaultAwardCovers.value = []
      break
    case 'officialVideo':
      if (data.officialVideoList.length === 6) {
        ElMessage({
          type: 'warning',
          message: '视频最多上传6个'
        })
        return
      }
      defaultVideoCover.value = []
      videoModId.value = undefined
      videoVisible.value = true
      break
    case 'dataDownload':
      if (data.dataDownloadList.length === 8) {
        ElMessage({
          type: 'warning',
          message: '最多上传8个'
        })
        return
      }
      defaultFileCover.value = []
      fileModId.value = undefined
      fileVisible.value = true
      break
  }
}
// 删除（产品特色、官方视频、资料下载共用）
const onFileDelete = async (item) => {
  await brandDelApi({
    id: item.id
  })
  modInit()
}

// 产品特色-新增/编辑
const saveFeature = () => {
  if (!featureModId.value) {
    brandAddFeature({
      productId: getSessionItem('productId') || queryProductId.value,
      ...featureForm
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('productFeature')
      modInit()
    })
  } else {
    brandModFeatureApi({
      productId: getSessionItem('productId') || queryProductId.value,
      ...featureForm,
      id: featureModId.value
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('productFeature')
      modInit()
    })
  }
}
const saveAward = () => {
  if (!awardModId.value) {
    brandAddAward({
      productId: getSessionItem('productId') || queryProductId.value,
      name: awardForm.name,
      images: awardForm.images
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('awardInfo')
      modInit()
    })
  } else {
    brandModAwardApi({
      productId: getSessionItem('productId') || queryProductId.value,
      name: awardForm.name,
      images: awardForm.images,
      id: awardModId.value
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('awardInfo')
      modInit()
    })
  }
}
const saveVideo = () => {
  if (!videoModId.value) {
    brandAddVideo({
      productId: getSessionItem('productId') || queryProductId.value,
      ...videoForm
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('officialVideo')
      modInit()
    })
  } else {
    brandModVideoApi({
      productId: getSessionItem('productId') || queryProductId.value,
      ...videoForm,
      id: videoModId.value
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('officialVideo')
      modInit()
    })
  }
}
const saveData = () => {
  if (!fileModId.value) {
    brandAddData({
      productId: getSessionItem('productId') || queryProductId.value,
      ...fileForm
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('dataDownload')
      modInit()
    })
  } else {
    brandModDataApi({
      productId: getSessionItem('productId') || queryProductId.value,
      ...fileForm,
      id: fileModId.value
    }).then((res) => {
      ElMessage({
        type: 'success',
        message: '保存成功'
      })
      onClose('dataDownload')
      modInit()
    })
  }
}

const onConfirm = (key) => {
  switch (key) {
    case 'productFeature':
      featureRef.value.validate((valid) => {
        if (!valid) {
          return false
        } else {
          saveFeature()
        }
      })
      break
    case 'awardInfo':
      awardInfoRef.value.validate((valid) => {
        if (!valid) {
          return false
        } else {
          saveAward()
        }
      })
      break
    case 'officialVideo':
      videoRef.value.validate((valid) => {
        if (!valid) {
          return false
        } else {
          saveVideo()
        }
      })
      break
    case 'dataDownload':
      fileRef.value.validate((valid) => {
        if (!valid) {
          return false
        } else {
          saveData()
        }
      })
      break
  }
}

const data = reactive({
  featureList: [],
  awardInfoList: [],
  officialVideoList: [],
  dataDownloadList: []
})
// 编辑初始化
const modInit = () => {
  brandModInit({
    productId: getSessionItem('productId') || queryProductId.value
  }).then((res) => {
    Object.assign(data, res)
  })
}
// 审核查看初始化
const viewInit = async () => {
  const res = await brandInfoInitApi({ id: queryProductId.value })
  if (res) {
    Object.assign(data, res)
  }
}
const brandZoneInit = () => {
  if (getSessionItem('productId') || props.isMod) {
    modInit()
  }
}
// onMounted(() => {
//   if (props.isReadOnly && queryProductId.value) {
//     viewInit()
//   }
// })
defineExpose({
  brandZoneInit
})
</script>
<style>
.el-upload-list__item-file-name {
  max-width: 120px;
}
</style>
<style lang="less" scoped>
ul li {
  list-style: none;
}
.card-ul {
}
.qs-title {
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .pay-title {
    margin-right: 4px;
  }
}

.video-list,
.file-list,
.features-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  // margin-bottom: -24px;
  padding: 0 10px;
  margin: 0;
  > li {
    background: #ffffff;
    border: 1px solid #e5e5e5;
    width: 214px;
    flex: 0 0 auto;
    height: 184px;
    position: relative;
    cursor: pointer;
    margin-right: 16px;
    margin-bottom: 24px;
    &:hover {
      .btn-box {
        display: flex;
      }
    }
    .btn-box {
      display: none;
      position: absolute;
      background: rgba(0, 0, 0, 0.3);
      align-items: center;
      justify-content: center;
      width: 100%;
      z-index: 1;
      height: 100%;
      top: 0;
      .tips-label {
        display: none;
        position: absolute;
        top: -20px;
        font-size: 12px;
        color: #fff;
        left: 50%;
        margin-left: 0;
        transform: translateX(-50%);
      }
    }

    .cover {
      width: 100%;
      height: 120px;
      border-bottom: 1px solid #e5e5e5;
    }
    .title-box {
      height: 64px;
      padding: 12px;
    }
    .title {
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      text-align: justify;
      line-height: 20px;
      @include overflow-ellipsis(2);
    }

    .features-img {
      display: block;
      width: 113px;
      height: 71px;
      margin: 0 auto;
    }
    .title1 {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      color: #333333;
      letter-spacing: 0;
      text-align: center;
      margin: 14px auto 6px;
      @include overflow-ellipsis(1);
      padding: 0 12px;
    }
    .title2 {
      font-size: 14px;
      line-height: 20px;
      color: #666666;
      letter-spacing: 1px;
      text-align: center;
      @include overflow-ellipsis(3);
      padding: 0 12px;
    }
  }
}
.features-list {
  > li {
    height: 198px;
    border: none;
    padding-top: 12px;
    .cover {
      width: 100%;
      height: 120px;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
.award-line {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #eee;
  .award {
    margin-right: 10px;
    margin-top: 4px;
    font-size: 20px;
  }
}
.space-right-btn {
  height: 32px;
  padding: 0 10px;
  color: #2549e7;
  line-height: 32px;
  border: none;
  position: absolute;
  box-shadow: none;
  right: 0;
  top: 0;
}
.card {
  position: relative;
  margin-bottom: 20px;
}
.award-cover {
  border: 1px solid #eee;
  Object-fit: cover;
  margin-top: 8px;
}
.award-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  margin-top: -8px;
}
.award-title {
  margin-bottom: 16px;
}
</style>