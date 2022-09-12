<template>
  <div>
    <!-- 产品特色 -->
    <div class="card">
      <div class="qs-title">
        <span class="title-text">产品特色</span>
        <span class="pay-version-icon"></span>
      </div>
      <ul class="features-list" v-if="data.featureList.length > 0">
        <li
          v-for="(item, i) in data.featureList"
          :key="item.id + i"
          style="text-align: center"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="item.image"
            :preview-src-list="[item.image]"
            fit="cover"
          />
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
      <ul class="card-ul">
        <li v-for="(item, i) in data.awardInfoList" :key="i" class="award-line">
          <div class="award-title">{{ item.awardName }}</div>
          <div class="award-wrap">
            <div v-for="(img, index) in item.images" :key="index" style="margin-right: 20px">
              <div class="demo-image__preview">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="img"
                  :preview-src-list="[...item.images]"
                  fit="cover"
                />
              </div>
            </div>
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

      <ul class="video-list" v-if="data.officialVideoList">
        <li v-for="(item, i) in data.officialVideoList" :key="item.id + i">
          <video
            playsinline
            webkit-playsinline
            width="100%"
            height="300px"
            class="video"
            controls
            :poster="item.image"
          >
            <source :src="item.attachment" type="video/mp4" />
            您的浏览器不支持 video 标签。
          </video>
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
      <ul class="file-list2" v-if="data.dataDownloadList">
        <li v-for="(item, i) in data.dataDownloadList" :key="item.id + i">
          <div>
            <el-image
              style="width: 182px; height: 122px"
              :src="item.image"
              :preview-src-list="[item.image]"
              fit="cover"
            />
          </div>
          <div class="title-box">
            <span class="title">{{ item.title }}</span>
          </div>
          <el-link type="success" :href="item.attachment" target="_blank"
            >附件地址：{{ item.attachment || '-' }}</el-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { brandModInit } from '@/api/productTab'
import { useRoute } from 'vue-router'
import { getSessionItem } from '@/utils/storage'
import { brandInfoInitApi } from '@/api/productReview'
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
// 审核初始化
const viewInit = async () => {
  const res = await brandInfoInitApi({ id: queryProductId.value })
  if (res) {
    Object.assign(data, res)
  }
}

const brandZoneInit = () => {
  modInit()
}
onMounted(() => {
  if (props.isAudit) {
    viewInit()
  }
})

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
.qs-title {
  height: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .pay-title {
    margin-right: 4px;
  }
}
.card-ul {
  // display: flex;
  // flex-wrap: wrap;
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
  padding: 0 8px;
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
  width: 214px;
  height: 120px;
}
.award-wrap {
  display: flex;
  flex-wrap: wrap;
}
.award-title {
  margin-bottom: 16px;
}
.demo-image__preview {
  width: 104px;
  height: 104px;
  border: 1px solid #e5e5e5;
}
.video {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
</style>
