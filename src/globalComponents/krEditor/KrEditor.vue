<template>
  <div>
    <editor v-model="contentValue" :init="editorInit" />
  </div>
</template>
<script setup>
// import tinymce from 'tinymce/js/tinymce/tinymce.min.js'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
// import 'tinymce/skins/content/default/content.css'
import 'tinymce/models/dom' // 引入dom模块。从 Tinymce6，开始必须有此模块导入
import 'tinymce/themes/silver' //默认主题
import 'tinymce/icons/default' //引入编辑器图标icon，不引入则不显示对应图标
// import 'tinymce/langs/zh-Hans'
import 'tinymce/plugins/image' //插入编辑图片
import 'tinymce/plugins/link' //超链接
import 'tinymce/plugins/code' //编辑源码
import 'tinymce/plugins/table' //表格
import 'tinymce/plugins/lists' //列表插件
// import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount' //字数统计
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/anchor'
// import 'tinymce/plugins/paste'
// import 'tinymce/plugins/toc' // 目录
import 'tinymce/plugins/fullscreen' // 全屏
// import 'tinymce/plugins/fullpage' // 全页
import 'tinymce/plugins/autoresize' // 文本编辑框大小
import 'tinymce/plugins/quickbars' //
// import 'tinymce/plugins/imagetools'

import 'tinymce/plugins/advlist' //高级列表
import 'tinymce/plugins/autolink' //自动链接
import 'tinymce/plugins/autosave' //自动存稿
import 'tinymce/plugins/charmap' //特殊字符
import 'tinymce/plugins/codesample' //代码示例
import 'tinymce/plugins/directionality' //文字方向
import 'tinymce/plugins/emoticons' //表情
import 'tinymce/plugins/help' //帮助
import 'tinymce/plugins/importcss' //引入css
import 'tinymce/plugins/insertdatetime' //插入日期时间
import 'tinymce/plugins/media' //插入编辑媒体
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/pagebreak' //插入分页符
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/save' //保存
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/template' //内容模板
import 'tinymce/plugins/visualblocks' //显示元素范围
import 'tinymce/plugins/visualchars' //显示不可见字符
import { reactive, watch, ref, computed, onMounted, onUnmounted } from 'vue'
const props = defineProps({
  // 富文本回显
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  config: {}
})
const emits = defineEmits(['update:modelValue'])
const contentValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.error(val)
    emits('update:modelValue', val)
  }
})
const editorInit = reactive({
  language: 'zh-Hans',
  language_url: '/tinymce/langs/zh-Hans.js',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.css',
  min_height: 490,
  max_height: 600,
  branding: false,
  menubar: false,
  statusbar: false,
  plugins:
    'toolbarsticky paste lists link image table colorpicker textcolor fullscreen fullpage autoresize quickbars imagetools',
  toolbar:
    ' undo redo | bold italic underline strikethrough forecolor backcolor | blocks fontsize fontfamily | bullist numlist | alignleft aligncenter alignright alignjustify outdent indent | blockquote link image table | removeformat fullscreen',
  formats: {
    alignleft: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,figure',
      classes: 'left-custom'
    },
    aligncenter: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,figure',
      classes: 'center-custom'
    },
    alignright: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,figure',
      classes: 'right-custom'
    },
    alignjustify: {
      selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img,figure',
      classes: 'justify-custom'
    }
  },
  style_formats: [
    { title: '段落', format: 'p' },
    { title: '标题1', format: 'h2' },
    { title: '标题2', format: 'h3' },
    { title: '标题3', format: 'h4' }
  ],
  fontsize_formats:
    '12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px',
  font_formats:
    '默认字体=PingFangSC-Regular,PingFang SC,Helvetica Neue,Microsoft YaHei,sans-serif;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;',
  fullpage_default_font_family:
    'PingFangSC-Regular,PingFang SC,Helvetica Neue,Microsoft YaHei,sans-serif',
  fullpage_default_font_size: '14px',
  fullpage_default_text_color: '#333',
  //选中时出现的快捷工具，与插件有依赖关系
  quickbars_selection_toolbar:
    'bold italic underline strikethrough forecolor backcolor fontsizeselect fontselect | quicklink unlink',
  // quickbars_image_toolbar: 'alignleft aligncenter alignright alignjustify | rotateleft rotateright | imageoptions',
  quickbars_insert_toolbar: false,
  // 图片上传
  images_upload_handler: function (blobInfo, success, failure) {
    uploadFn(blobInfo.blob(), success, failure)
  },
  paste_data_images: true,
  paste_enable_default_filters: false,
  paste_filter_drop: false,
  ...props.config
})
const uploadFn = (file, success, failure) => {
  const fileFormData = new FormData()
  this.$request
    .get(
      `/yp/tools/oss/token?target_dir=${this.uploadPath}&fileName=${file.name}`
    )
    .then((res) => {
      let ossData = {
        key: res.dir,
        policy: res.policy,
        OSSAccessKeyId: res.accessid,
        success_action_status: '200',
        signature: res.signature,
        file
      }
      Object.keys(ossData).forEach((key) => {
        fileFormData.append(key, ossData[key])
      })
      Axios({
        url: import.meta.env.VITE_APP_PROXY_URL === 'development' ? '/upload' : res.host,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: fileFormData
      })
        .then((upl) => {
          // console.log('res:', upl);
          if (upl.status === 200) {
            success('https://v-static.36krcdn.com/' + ossData.key)
          } else {
            failure()
          }
        })
        .catch((err) => {
          failure()
          console.log(err)
        })
    })
    .catch((err) => {
      failure()
      console.log(err)
    })
}
onMounted(async () => {
  tinymce.init({}) //初始化
})
onUnmounted(() => {
  tinymce.remove() //销毁
})
// tinymce.init({})
</script>
