<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.title" clearable placeholder="请输入标题" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left:10px;"
        icon="el-icon-search"
        @click="getList"
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="标题" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="描述" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" min-width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.beginTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" min-width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.endTime | formatDate }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="结果截止上传时间" min-width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.resultsEndTime | formatDate }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">
          {{ getType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="父任务" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.pTask.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDownload(scope.row)">下载附件</el-button>
          <el-button type="success" size="small" @click="handleCheck(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="学生任务结果信息" :visible.sync="dialogStudentVisible" width="80%">
      <StudentList :value="taskId" />
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import StudentList from './components/StudentList'

export default {
  components: { StudentList },
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
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        title: ''
      },
      dialogStudentVisible: false,
      taskId: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/teacher/query',
        data: this.qs.stringify({
          'userId': 11,
          'title': this.listQuery.title
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.taskVOS
        } else {
          this.$message.error('获取任务信息错误')
        }
      })
    },
    handleDownload(row) {
      var canDownLoad = false
      this.axios({
        method: 'post',
        url: '/task/getAnnex',
        data: this.qs.stringify({
          'taskId': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          canDownLoad = res.annex === null
        } else {
          this.$message.error('获取附件信息失败')
        }
      })
      if (canDownLoad) {
        window.location.href = 'http://127.0.0.1:8080/task/download?taskId=' + row.task.id
      } else {
        this.$message.error('暂无附件')
      }
    },
    handleCheck(row) {
      this.dialogStudentVisible = true
      this.taskId = row.id
    },
    getType(type) {
      var name = ''
      if (type === 0) {
        name = '毕业设计任务'
      } else if (type === 1) {
        name = '开题报告任务'
      } else if (type === 2) {
        name = '实验计划任务'
      } else if (type === 3) {
        name = '论文预答辩任务'
      } else if (type === 4) {
        name = '盲评和查重任务'
      } else if (type === 5) {
        name = '论文答辩任务'
      } else if (type === 6) {
        name = '答辩后期任务'
      }
      return name
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
