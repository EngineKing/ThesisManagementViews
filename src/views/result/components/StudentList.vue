<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.number"
        clearable
        placeholder="请输入学生学号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="请输入学生姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.result"
        placeholder="请选择结果"
        clearable
        style="width: 140px;"
        class="filter-item"
      >
        <el-option
          v-for="item in resultOptions"
          :key="item.value"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left:10px;"
        icon="el-icon-search"
        @click="getList"
      >搜索</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleExport"
      >导出</el-button>
      <el-button
        v-waves
        :loading="allExportLoading"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleAllExport"
      >全部导出</el-button>
    </div>
    <el-table
      ref="studentTable"
      v-loading="listLoading"
      :data="list"
      :row-key="getRowKeys"
      style="width: 100%;margin-top: 20px;"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="ID" min-width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="编号" min-width="100" align="center">
        <template slot-scope="scope">{{ scope.row.student.number }}</template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.student.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="电话号码" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.student.phone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="邮箱" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.student.email }}</template>
      </el-table-column>
      <el-table-column label="结果提交时间" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.submitTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="导师审核" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.isAuditPassed | getIsAuditPassed }}</template>
      </el-table-column>
      <el-table-column label="导师意见" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.auditOpinion | getAuditOpinion }}</template>
      </el-table-column>
      <el-table-column label="结果" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.result | getResult }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240px">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.result !== 2"
            type="success"
            size="small"
            @click="handlePass(scope.row)"
          >通过</el-button>
          <el-button
            :disabled="scope.row.result !== 2"
            type="danger"
            size="small"
            @click="handleFail(scope.row)"
          >不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    formatDate(date) {
      var d = new Date(date)
      var year = d.getFullYear()
      var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth + 1)
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
      var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
      var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()
      var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds()
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
    },
    getIsAuditPassed(isAuditPassed) {
      var result = ''
      if (isAuditPassed === -1) {
        result = '未审核'
      } else if (isAuditPassed === 0) {
        result = '通过'
      } else {
        result = '未通过'
      }
      return result
    },
    getAuditOpinion(auditOpinion) {
      return auditOpinion === null || auditOpinion === '' ? '未审核' : auditOpinion
    },
    getResult(result) {
      var res = ''
      if (result === -1) {
        res = '未答辩'
      } else if (result === 0) {
        res = '通过'
      } else if (result === 1) {
        res = '未通过'
      } else {
        res = '未上传'
      }
      return res
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        number: '',
        name: '',
        result: '',
        taskId: '',
        limit: 10,
        curPage: 1
      },
      resultOptions: [
        { key: 0, value: '通过' },
        { key: 1, value: '未通过' },
        { key: 2, value: '待审核' }
      ],
      multipleSelection: [],
      allExportLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/taskResult/pageQuery',
        data: {
          'taskId': this.value,
          'number': this.listQuery.number,
          'name': this.listQuery.name,
          'result': this.listQuery.result,
          'curPage': this.listQuery.curPage,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.taskResultPage.list
          this.total = res.taskResultPage.total
          this.listLoading = false
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handlePass(row) {
      this.axios({
        method: 'post',
        url: '/taskResult/pass',
        data: this.qs.stringify({
          'taskResultId': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.getList()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleFail(row) {
      this.axios({
        method: 'post',
        url: '/taskResult/fail',
        data: this.qs.stringify({
          'taskResultId': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.dialogTextVisible = false
          this.getList()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleExport() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        window.location.href = 'http://127.0.0.1:8080/taskResult/export?taskResultIds=' + this.getIds(this.multipleSelection, 'id')
      } else {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
      }
    },
    handleAllExport() {
      this.allExportLoading = true
      var studentForm = {
        'number': this.listQuery.number,
        'name': this.listQuery.name,
        'result': this.listQuery.result
      }
      window.location.href = 'http://127.0.0.1:8080/taskResult/allExport?condition=' + encodeURI(JSON.stringify(studentForm))
      this.allExportLoading = false
    },
    getIds(input, field) {
      var output = []
      for (var i = 0; i < input.length; i++) {
        output.push(input[i][field])
      }
      return output
    },
    getRowKeys(row) {
      return row.id
    }
  }
}
</script>
