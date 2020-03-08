<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.title"
        clearable
        placeholder="请输入标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        placeholder="请选择类型"
        clearable
        style="width: 160px;"
        class="filter-item"
      >
        <el-option
          v-for="item in typeOptions"
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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
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
      <el-table-column align="center" label="结果截止上传时间" min-width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.resultsEndTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="180" align="center">
        <template slot-scope="scope">{{ getType(scope.row.type) }}</template>
      </el-table-column>
      <el-table-column label="父任务" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.pTask.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="importTutor(scope.row)">关联导师</el-button>
          <el-button type="success" size="small" @click="importStudent(scope.row)">关联学生</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="handleFilter"
    />

    <div v-if="dialogTutorVisible">
      <el-dialog title="导师信息" :visible.sync="dialogTutorVisible" width="80%">
        <TutorList :value="taskId" />
      </el-dialog>
    </div>
    <div v-if="dialogStudentVisible">
      <el-dialog title="学生信息" :visible.sync="dialogStudentVisible" width="80%">
        <StudentList :value="taskId" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import TutorList from './components/TutorList'
import StudentList from './components/StudentList'

export default {
  components: { Pagination, TutorList, StudentList },
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
        page: 1,
        limit: 10,
        title: '',
        type: undefined
      },
      pTaskOptions: [],
      typeOptions: [
        { key: 0, value: '毕业设计任务' },
        { key: 1, value: '开题报告任务' },
        { key: 2, value: '实验计划任务' },
        { key: 3, value: '论文预答辩任务' },
        { key: 4, value: '盲评和查重任务' },
        { key: 5, value: '论文答辩任务' },
        { key: 6, value: '答辩后期任务' }
      ],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      dialogTutorVisible: false,
      dialogStudentVisible: false,
      taskId: 0
    }
  },
  created() {
    this.getList()
    this.getAllPTasks()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/task/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.taskPage.list
          this.total = res.taskPage.total
        } else {
          this.$message.error('获取任务信息错误')
        }
      })
    },
    getAllPTasks() {
      this.axios({
        method: 'get',
        url: '/task/getAllPTasks'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.pTaskOptions = res.pTasks
        } else {
          this.$message.error('获取父任务信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/task/pageQuery',
        data: this.listQuery
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.taskPage.list
          this.total = res.taskPage.total
        } else {
          this.$message.error('获取任务信息错误')
        }
      })
    },
    importTutor(row) {
      this.dialogTutorVisible = true
      this.taskId = row.id
    },
    importStudent(row) {
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
    formatBeginTime(val) {
      this.temp.beginTime = new Date(val).getTime()
      this.$forceUpdate()
    },
    formatEndTime(val) {
      this.temp.endTime = new Date(val).getTime()
      this.$forceUpdate()
    },
    formatResultEndTime(val) {
      this.temp.resultsEndTime = new Date(val).getTime()
      this.$forceUpdate()
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
