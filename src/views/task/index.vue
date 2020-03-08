<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.title" clearable placeholder="请输入标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择类型" clearable style="width: 140px;" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.value" :label="item.value" :value="item.key" />
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
      <el-table-column label="类型" min-width="160" align="center">
        <template slot-scope="scope">
          {{ getType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="父任务" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.pTask.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-upload
            ref="upload"
            :action="uploadAction"
            :data="taskId"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="true"
            :show-file-list="false"
            style="display:inline-block"
          >
            <el-button
              size="small"
              type="success"
              @click="handleSubmit(scope)"
            >上传附件</el-button>
          </el-upload>
          <el-button type="danger" size="small" @click="deleteTask(scope)">删除</el-button>
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
        label-width="110px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker v-model="temp.beginTime" type="datetime" placeholder="请选择开始时间" @change="formatBeginTime" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="datetime" placeholder="请选择结束时间" @change="formatEndTime" />
        </el-form-item>
        <el-form-item label="结果截止上传时间" prop="resultsEndTime">
          <el-date-picker v-model="temp.resultsEndTime" type="datetime" placeholder="请选择结果截止上传日期" default-time="12:00:00" @change="formatResultEndTime" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" @change="change()">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上级任务" prop="pTaskId">
          <el-select v-model="temp.pTaskId" class="filter-item" @change="change()">
            <el-option
              v-for="item in pTaskOptions"
              :key="item.title"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" @change="change()">
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { select, time } from '@/utils/formValidator.js'

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
      temp: {
        id: 0,
        title: '',
        description: '',
        beginTime: '',
        endTime: '',
        resultsEndTime: '',
        type: undefined,
        pTaskId: undefined,
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      uploadAction: 'http://127.0.0.1:8080/task/upload',
      taskId: {
        taskId: 0
      },
      rules: {
        title: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' },
          { validator: time, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
          { validator: time, message: '请选择结束时间', trigger: 'change' }
        ],
        resultsEndTime: [
          { required: true, message: '请选择结果截止上传时间', trigger: 'change' },
          { validator: time, message: '请选择结果截止上传时间', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' },
          { validator: select, message: '请选择类型', trigger: 'change' }
        ],
        pTaskId: [
          { required: true, message: '请选择上级任务', trigger: 'change' },
          { required: true, message: '请选择上级任务', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ]
      }
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
    resetTemp() {
      this.temp = {
        id: 0,
        title: '',
        description: '',
        beginTime: '',
        endTime: '',
        resultsEndTime: '',
        type: undefined,
        pTaskId: undefined,
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
            url: '/task/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('添加任务成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
              // this.$message.error('添加用户失败')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.pTaskId = row.pTask.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/task/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑任务成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
              // this.$message.error('编辑用户失败')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    handleSuccess(content) {
      this.$message.success('附件上传成功')
    },
    handleError(content) {
      this.$message.error('附件上传失败')
    },
    handleSubmit(scope) {
      this.taskId.taskId = scope.row.id
      this.$refs.upload.submit()
    },
    deleteTask(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/task/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除任务成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
            // this.$message.error('冻结用户失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      })
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
