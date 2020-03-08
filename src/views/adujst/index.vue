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
      ref="table"
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
      <el-table-column class-name="status-col" label="性别" min-width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.student.gender | genderFilter">{{ getGender(scope.row.student.gender) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="电话号码" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.student.phone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="邮箱" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.student.email }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所选题目" min-width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.topic.name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="导师" min-width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.teacher.name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="导师意见" min-width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isTutorAgree | opinionFilter">{{ getOpinion(scope.row.isTutorAgree) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleAdujst(scope.row)">调整</el-button>
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
    <div v-if="dialogVisible">
      <el-dialog title="题目信息" :visible.sync="dialogVisible" width="80%">
        <TopicList :student-id="studentId" :topic-id="topicId" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import TopicList from './component/TopicList'

export default {
  components: { Pagination, TopicList },
  directives: { waves },
  filters: {
    genderFilter(status) {
      const genderMap = {
        '0': 'success',
        '1': 'danger'
      }
      return genderMap[status]
    },
    opinionFilter(status) {
      const opinionMap = {
        '0': 'success',
        '1': 'danger',
        '2': 'primary'
      }
      return opinionMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        number: '',
        name: '',
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      studentId: undefined,
      topicId: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/studentTopic/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.studentTopicPage.list
          this.total = res.studentTopicPage.total
          this.listLoading = false
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/studentTopic/pageQuery',
        data: {
          'number': this.listQuery.number,
          'name': this.listQuery.name,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.studentTopicPage.list
          this.total = res.studentTopicPage.total
          this.listLoading = false
        } else {
          this.$message.error('获取学生信息错误')
        }
      })
    },
    handleAdujst(row) {
      this.dialogVisible = true
      this.studentId = row.student.id
      this.topicId = row.topic.id
    },
    getGender(gender) {
      return gender === 0 ? '男' : '女'
    },
    getOpinion(type) {
      var res = null
      if (type === 0) {
        res = '通过'
      } else if (type === 1) {
        res = '不通过'
      } else {
        res = '待审核'
      }
      return res
    },
    change() {
      this.$forceUpdate()
    },
    formatTime(val) {
      this.temp.enrollmentDate = new Date(val).getTime()
    },
    getScoolSystem(schoolSystem) {
      return schoolSystem === 0 ? '硕士研究生' : '博士研究生'
    }
  }
}
</script>
