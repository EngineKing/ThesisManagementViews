<template>
  <div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="任务名称" min-width="200">
        <template slot-scope="scope">{{ scope.row.task_name | orderNoFilter }}</template>
      </el-table-column>
      <el-table-column label="截止时间" width="195" align="center">
        <template slot-scope="scope">{{ scope.row.end_time | toThousandFilter }}</template>
      </el-table-column>
      <el-table-column label="进行中" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        yes: 'success',
        no: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
