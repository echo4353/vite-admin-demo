<template>
  <div class="base-table">
    <div class="action">
      <slot name="action"></slot>
    </div>
    <el-table v-bind="$attrs" border style="width: 100%">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.type == 'selection'"
          type="selection"
          width="55"
          key="selection"
        />
        <el-table-column v-else-if="!item.type" v-bind="item" />
        <el-table-column v-else-if="item.type == 'action'" v-bind="item">
          <template #default="scope">
            <slot name="actionBtn" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      background
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pager.pageNum"
      hide-on-single-page
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pager.pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  columns: Object,
  pager: Object,
  totalCount: Number
})
/**
 * 列按钮点击
 * @param index {number} 索引
 * @param row {object} 行数据
 */
const emits = defineEmits(['handleCurrentChange', 'handleSizeChange'])
/**
 * 页码变化
 * @param pageNum {number} 页码
 */
const handleCurrentChange = (pageNum) => {
  emits('handleCurrentChange', pageNum)
}
/**
 * 页码变化
 * @param pageSize {number} 分页条数
 */
const handleSizeChange = (pageSize) => {
  emits('handleSizeChange', pageSize)
}
</script>
<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
