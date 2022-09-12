import { ElMessage } from 'element-plus'

function beforeCopy(el, binding) {
  el.$value = binding.value // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
  el.handler = () => {
    if (!el.$value) {
      // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
      console.log('无复制内容')
      return
    }
    // 动态创建 textarea 标签
    const textarea = document.createElement('textarea')
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = el.$value
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const result = document.execCommand('Copy')
    if (result) {
      ElMessage({
        message: '已复制到粘贴板！',
        type: 'success'
      })
    }
    document.body.removeChild(textarea)
  }
  // 绑定点击事件，就是所谓的一键 copy 啦
  el && el.addEventListener('click', el.handler)
}

export default {
  // 在绑定元素的父组件被挂载后调用
  beforeMount(el, binding) {
    beforeCopy(el, binding)
  },
  // 当传进来的值更新的时候触发
  updated(el, binding) {
    el.$value = binding.value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unmounted(el) {
    el.removeEventListener('click', el.handler)
  }
}
