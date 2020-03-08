<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="请输入题目名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.taskId"
        placeholder="请选择任务"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in taskOptions"
          :key="item.title"
          :label="item.title"
          :value="item.id"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
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
      <el-table-column label="可选人数" min-width="80" align="center">
        <template slot-scope="scope">{{ scope.row.optionalNumber }}</template>
      </el-table-column>
      <el-table-column label="已选人数" min-width="80" align="center">
        <template slot-scope="scope">{{ scope.row.selectedNumber }}</template>
      </el-table-column>
      <el-table-column label="所属任务" min-width="170" align="center">
        <template slot-scope="scope">{{ scope.row.task.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="handleSelected(scope.row)">查看已选学生</el-button>
          <el-button type="danger" size="small" @click="deleteTopic(scope)">删除</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="题目描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="可选人数" prop="optionalNumber">
          <el-select
            v-model="temp.optionalNumber"
            class="filter-item"
            placeholder="请选择"
            @change="change()"
          >
            <el-option
              v-for="item in numberOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属任务" prop="taskId">
          <el-select v-model="temp.taskId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in taskOptions"
              :key="item.title"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="已选学生" :visible.sync="dialogTableVisible" width="70%">
      <el-table
        v-loading="listLoading"
        :data="studentTopicVOs"
        style="width: 100%;margin-top: 20px;"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column type="selection" align="center" />
        <el-table-column align="center" label="ID" min-width="50">
          <template
            slot-scope="scope"
          >{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
        </el-table-column>
        <el-table-column label="编号" min-width="100" align="center">
          <template slot-scope="scope">{{ scope.row.student.number }}</template>
        </el-table-column>
        <el-table-column label="姓名" min-width="120" align="center">
          <template slot-scope="scope">{{ scope.row.student.name }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="性别" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.student.gender | genderFilter"
            >{{ getGender(scope.row.student.gender) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="电话号码" min-width="160" align="center">
          <template slot-scope="scope">{{ scope.row.student.phone }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="邮箱" min-width="160" align="center">
          <template slot-scope="scope">{{ scope.row.student.email }}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" min-width="160" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isTutorAgree | isTutorAgreeFilter"
            >{{ getIsTutorAgree(scope.row.isTutorAgree) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="240px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              :disabled="scope.row.isTutorAgree !== 2"
              @click="agree(scope.row)"
            >通过</el-button>
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.isTutorAgree !== 2"
              @click="disagree(scope.row)"
            >不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { select, number } from '@/utils/formValidator.js'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    genderFilter(gender) {
      const genderMap = {
        '0': 'success',
        '1': 'danger'
      }
      return genderMap[gender]
    },
    isTutorAgreeFilter(status) {
      const isTutorAgreeMap = {
        '0': 'success',
        '1': 'info',
        '2': 'primary'
      }
      return isTutorAgreeMap[status]
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
      temp: {
        id: 0,
        name: '',
        description: '',
        optionalNumber: undefined,
        selectedNumber: 0,
        taskId: undefined,
        status: 0
      },
      studentTopicVOs: [],
      numberOptions: [{ key: 1, value: '1人' }, { key: 2, value: '2人' }, { key: 3, value: '3人' }],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      taskOptions: [],
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTableVisible: false,
      // isTutorAgree: undefined,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        optionalNumber: [
          { required: true, message: '请输入可选人数', trigger: 'change' },
          { validator: number, message: '请输入数字', trigger: 'change' }
        ],
        taskId: [
          { required: true, message: '请选择任务', trigger: 'change' },
          { validator: select, message: '请选择任务', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
          { validator: select, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getAllTaks()
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
    getAllTaks() {
      this.axios({
        method: 'get',
        url: '/task/getAllPTasks'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.taskOptions = res.pTasks
        } else {
          this.$message.error('获取任务错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/topic/pageQuery',
        data: {
          'name': this.listQuery.name,
          'taskId': this.listQuery.taskId,
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
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        description: '',
        optionalNumber: undefined,
        selectedNumber: 0,
        taskId: undefined,
        status: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/topic/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增题目成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.taskId = row.task.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/topic/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑任务成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    deleteTopic(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/topic/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除题目成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    handleSelected(row) {
      this.dialogTableVisible = true
      this.getSelectedStudent(row)
    },
    agree(row) {
      this.isTutorAgree = 0
      this.isAgree(row)
    },
    disagree(row) {
      this.isTutorAgree = 1
      this.isAgree(row)
    },
    getSelectedStudent(row) {
      this.axios({
        method: 'post',
        url: 'studentTopic/getByTopicId',
        data: this.qs.stringify({
          'id': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.studentTopicVOs = res.studentTopicVOs
        } else {
          this.$message.error('获取学生信息失败')
        }
      })
    },
    isAgree(row) {
      this.$confirm('是否确定此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'studentTopic/isAgree',
          data: {
            'studentId': row.student.id,
            'topicId': row.topic.id,
            'isTutorAgree': row.isTutorAgree
          }
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.dialogTableVisible = false
          }
          this.dialogTableVisible = false
        })
      })
    },
    getGender(gender) {
      return gender === 0 ? '男' : '女'
    },
    getIsTutorAgree(status) {
      var isTutorAgree = null
      if (status === 0) {
        isTutorAgree = '通过'
      } else if (status === 1) {
        isTutorAgree = '不通过'
      } else {
        isTutorAgree = '未审核'
      }
      return isTutorAgree
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
