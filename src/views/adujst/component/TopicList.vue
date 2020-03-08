<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.name" clearable placeholder="请输入题目名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.teacherId" placeholder="请选择导师" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in teacherOptions" :key="item.name" :label="item.name" :value="item.id" />
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
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
      </el-table-column>
      <el-table-column label="题目名称" min-width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="题目描述" min-width="300" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="可选人数" min-width="170" align="center">
        <template slot-scope="scope">{{ scope.row.optionalNumber }}</template>
      </el-table-column>
      <el-table-column label="已选人数" min-width="170" align="center">
        <template slot-scope="scope">{{ scope.row.selectedNumber }}</template>
      </el-table-column>
      <el-table-column label="导师" min-width="170" align="center">
        <template slot-scope="scope">{{ scope.row.teacher.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.selectedNumber === scope.row.optionalNumber || scope.row.id === topicId" size="small" @click="handleSelect(scope.row)">重新选择</el-button>
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
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    studentId: {
      type: Number,
      default: 0
    },
    topicId: {
      type: Number,
      default: 0
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
        name: '',
        teacherId: undefined,
        taskId: undefined
      },
      teacherOptions: [],
      student: []
    }
  },
  created() {
    this.getList()
    this.getAllTeachers()
    this.getStudent()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/topic/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.topicPage.list
          this.total = res.topicPage.total
        } else {
          this.$message.error('获取题目错误')
        }
      })
    },
    getAllTeachers() {
      this.axios({
        method: 'get',
        url: '/teacher/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.teacherOptions = res.teachers
        } else {
          this.$message.error('获取任务错误')
        }
      })
    },
    getStudent() {
      this.axios({
        method: 'post',
        url: 'student/get',
        data: this.qs.stringify({
          'studentId': this.studentId
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.student = res.student
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/topic/pageQuery',
        data: {
          'name': this.listQuery.name,
          'teacherId': this.listQuery.teacherId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.topicPage.list
          this.total = res.topicPage.total
        } else {
          this.$message.error('获取题目错误')
        }
      })
    },
    handleSelect(row) {
      this.$confirm('您是否要选择《' + row.name + '》作为' + this.student.name + '新的毕业设计题目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/studentTopic/add',
          data: {
            'studentId': this.studentId,
            'topicId': row.id,
            'isTutorAgree': 0
          }
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('选择题目成功')
            this.getList()
            this.topicId = row.id
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
