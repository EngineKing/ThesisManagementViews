<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.number"
        clearable
        placeholder="请输入学生学号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="请输入学生姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left:10px;"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%;margin-top: 20px;"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
        <template slot-scope="scope">{{ scope.row.taskResult.submitTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.taskResult.isAuditPassed | getIsAuditPassed }}</template>
      </el-table-column>
      <el-table-column label="意见" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.taskResult.auditOpinion | getAuditOpinion }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDownload(scope.row)">下载结果</el-button>
          <el-button
            :disabled="scope.row.taskResult.isAuditPassed !== -1"
            type="success"
            size="small"
            @click="handlePass(scope.row)"
          >通过</el-button>
          <el-button
            :disabled="scope.row.taskResult.isAuditPassed !== -1"
            type="danger"
            size="small"
            @click="handleFail(scope.row)"
          >不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="意见填写" :visible.sync="dialogTextVisible" append-to-body="true">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="意见">
          <el-input v-model="form.auditOpinion" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTextVisible = false">取消</el-button>
        <el-button type="primary" @click="fail()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
export default {
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
      listQuery: {
        number: '',
        name: ''
      },
      form: {
        taskResultId: 0,
        auditOpinion: ''
      },
      dialogTextVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/teacher/getTaskResult',
        data: this.qs.stringify({
          'taskId': this.value
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.studentResultVOS
          this.listLoading = false
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/teacher/getTaskResultWithCondition',
        data: {
          'number': this.listQuery.number,
          'name': this.listQuery.name
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.studentResultVOS
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handleDownload(row) {
      window.location.href = 'http://127.0.0.1:8080/taskResult/getAnnex?taskResultId=' + row.taskResult.id
    },
    handlePass(row) {
      this.axios({
        method: 'post',
        url: '/teacher/pass',
        data: this.qs.stringify({
          'taskResultId': row.taskResult.id
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
      this.dialogTextVisible = true
      this.form.taskResultId = row.taskResult.id
    },
    fail() {
      this.$confirm('操作后学生不可参加答辩', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/teacher/fail',
          data: this.qs.stringify({
            'taskResultId': this.form.taskResultId,
            'auditOpinion': this.form.auditOpinion
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
      })
    }
  }
}
</script>
