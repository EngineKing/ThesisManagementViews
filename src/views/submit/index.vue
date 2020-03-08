<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="请输入标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
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
          <span>{{ scope.row.task.resultsEndTime | formatDate }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">{{ getType(scope.row.type) }}</template>
      </el-table-column>
      <el-table-column label="父任务" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.pTask.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleDownload(scope.row)">下载附件</el-button>
          <el-upload
            ref="upload"
            :action="uploadAction"
            :data="formData"
            :on-success="handleSuccess"
            :on-error="handleError"
            accept=".doc, .docx, .pdf, .zip, .rar, .DOC, .DOCX, .PDF, .ZIP, .RAR"
            :before-upload="uploadBefore"
            :auto-upload="true"
            :show-file-list="false"
            style="display:inline-block"
          >
            <el-button
              :disabled="new Date().getTime() > scope.row.endTime"
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="handleSubmit(scope.row)"
            >提交结果</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
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
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        title: ''
      },
      uploadAction: 'http://127.0.0.1:8080/student/submit',
      formData: {
        userId: 56,
        taskId: 5
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/student/query',
        data: this.qs.stringify({
          'userId': this.formData.userId,
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
    uploadBefore(file) {
      // console.log(file)
      // this.$confirm('单文件请使用Word或者PDF类型，多文件请使用ZIP或者RAR类型?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {

      // })
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'zip' || testmsg === 'ZIP'
      const extension2 = testmsg === 'rar' || testmsg === 'RAR'
      const extension3 = testmsg === 'doc' || testmsg === 'DOC' || testmsg === 'docx' || testmsg === 'DOCX'
      const extension4 = testmsg === 'pdf' || testmsg === 'PDF'
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message.error('文件类型只能是.doc,.docx,.pdf,.zip或者.rar，请重新上传')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('文件大小不能超过2M, 请重新上传!')
        return false
      }
    },
    handleSuccess(content) {
      this.$message.success('结果提交成功')
    },
    handleError(content) {
      this.$message.error('结果提交失败')
    },
    handleSubmit(row) {
      this.formData.taskId = row.id
      this.$refs.upload.submit()
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
// accept="application/x-zip-compressed, application/x-rar-compressed"
</script>

