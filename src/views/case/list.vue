<template>
  <div>
    <!-- 表单 -->
    <el-card>
      <el-form
        :inline="true"
        ref="resetFormData"
        :model="formInline"
        label-width="80px"
      >
        <el-form-item label="案例标题" prop="title">
          <el-input
            v-model="formInline.title"
            placeholder="请输入案例标题"
          ></el-input>
        </el-form-item>
        <!-- 搜索选择产品 -->
        <el-form-item label="关联产品" prop="productId">
          <el-select
            v-model="formInline.productId"
            filterable
            single
            remote
            placeholder="输入选择"
            :remote-method="searchProductFunc"
          >
            <el-option
              v-for="item in tmpProductList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="案例状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择">
            <el-option
              v-for="item in resBean.statusList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm(resetFormData)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card class="table-warp">
      <el-table :data="resBean.caseList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="案例标题" />
        <el-table-column prop="productName" label="关联产品" />
        <el-table-column
          prop="industrys"
          label="案例企业所在行业"
          width="140"
        />
        <el-table-column prop="statusZh" label="案例状态" width="100" />
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column prop="companyName" label="所属商户" />
        <el-table-column prop="address" label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleMod(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="handleOperateLog(scope.row)"
              >操作记录</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              type="danger"
              @click="handleOffline(scope.row)"
              >下线</el-button
            >
            <el-button
              v-else
              size="small"
              type="success"
              @click="handleOnline(scope.row)"
              >上线</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        hide-on-single-page
        background
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pager.pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
      <OperateLog
        v-model:visible="operateLogVisible"
        :operateLogList="operateLogList"
      />
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import OperateLog from '@comps/Product/OperateLog.vue'
import { list, offline, online, searchProduct } from '@/api/case'
import { caseOperateLogApi } from '@/api/commonApi'
// 表单绑定
const resetFormData = ref(null)
const formInline = reactive({
  status: '',
  title: '',
  productId: ''
})
// 关联产品下拉数据
const tmpProductList = ref([])
const resBean = ref({
  caseList: [],
  statusList: []
})

// 操作记录
const operateLogVisible = ref(false)
const operateLogList = ref([])
const handleOperateLog = (row) => {
  caseOperateLogApi({
    caseId: row.id
  }).then((res) => {
    operateLogList.value = res.operateLogList
    operateLogVisible.value = true
  })
}
// 查询
const onSubmit = () => {
  getListData()
}
// 重置表单
const resetForm = (formEl) => {
  formEl.resetFields()
  getListData()
}
//搜索产品
const searchProductFunc = (query) => {
  searchProduct({
    productName: query
  }).then((res) => {
    tmpProductList.value = res.productList
  })
}

//编辑
const router = new useRouter()
const handleMod = (row) => {
  router.push({ path: '/case/mod', query: { id: row.id } })
}
// 上线
const handleOnline = (row) => {
  online({
    caseId: row.id
  }).then(() => {
    getListData()
    ElMessage({
      type: 'success',
      message: '上线成功!'
    })
  })
}
// 下线
const handleOffline = (row) => {
  ElMessageBox.prompt('请填写下线原因', '下线确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(({ value }) => {
      offline({
        caseId: row.id,
        reason: value
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '下线成功'
        })
        getListData()
      })
    })
    .catch(() => {})
}
// 初始化分页对象
const pager = reactive({
  pageNo: 1,
  pageSize: 20
})
const totalCount = ref(0)
// 列表
const getListData = async () => {
  const { caseList, statusList, page } = await list({
    ...formInline,
    ...pager
  })
  resBean.value = { caseList, statusList }
  totalCount.value = page.totalCount
}

//初始化页面方法
const initFunc = () => {
  getListData()
}
initFunc()

// 翻页事件处理
const handleCurrentChange = (pageNo) => {
  pager.pageNo = pageNo
  getListData()
}
const handleSizeChange = (pageSize) => {
  pager.pageSize = pageSize
  getListData()
}
</script>

<style lang="less" scoped>
.table-warp {
  margin-top: 10px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
