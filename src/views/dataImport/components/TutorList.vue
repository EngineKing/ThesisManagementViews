<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.number"
        clearable
        placeholder="请输入导师编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="请输入导师姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.jobTitle"
        placeholder="请选择职称"
        clearable
        style="width: 180px;"
        class="filter-item"
      >
        <el-option
          v-for="item in jobTitleOptions"
          :key="item.value"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.subjectId"
        placeholder="请选择学科"
        clearable
        style="width: 180px;"
        class="filter-item"
      >
        <el-option
          v-for="item in subjectOptions"
          :key="item.name"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.departmentId"
        placeholder="请选择部门"
        clearable
        style="width: 180px;"
        class="filter-item"
      >
        <el-option
          v-for="item in departmentOptions"
          :key="item.name"
          :label="item.name"
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
        v-waves
        class="filter-item"
        style="margin-left:10px;"
        type="primary"
        icon="el-icon-document"
        @click="related2Task"
      >批量关联</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleImport"
      >导入</el-button>
    </div>
    <el-table
      ref="table"
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
      <el-table-column type="selection" align="center" :reserve-selection="true" />
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
      </el-table-column>
      <el-table-column label="编号" min-width="100" align="center">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="性别" min-width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderFilter">{{ getGender(scope.row.gender) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="电话号码" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="邮箱" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="职称" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.jobTitle | jobTitleFilter">{{ getJobTitleName(scope.row.jobTitle) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属学科" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.subject.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属部门" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.department.name }}</template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="handleFilter"
    />

    <el-dialog title="导入" :visible.sync="dialogImportVisible" :append-to-body="true">
      <el-upload
        class="upload-file"
        action
        :on-error="handleError"
        :on-success="handleSuccess"
        :before-upload="uploadBefore"
        :limit="1"
        accept=".xlsx, .xls"
        :show-file-list="true"
        :file-list="fileList"
        style="display: inline-block;"
      >
        <el-button size="small" type="primary" @click="handleDownloadTemplate">下载模板</el-button>
        <el-button size="small" type="success">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传.xls/xlsx文件，且不超过2M，点击确定后导入</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImportVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmImport">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import XLSX from 'xlsx'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    genderFilter(status) {
      const genderMap = {
        '0': 'success',
        '1': 'danger'
      }
      return genderMap[status]
    },
    jobTitleFilter(status) {
      const jobTitleMap = {
        '0': 'info',
        '1': 'primary',
        '2': 'success',
        '3': 'danger'
      }
      return jobTitleMap[status]
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
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        number: '',
        name: '',
        jobTitle: undefined,
        subjectId: undefined,
        departmentId: undefined
      },
      subjectOptions: [],
      departmentOptions: [],
      genderOptions: [{ key: 0, value: '男' }, { key: 1, value: '女' }],
      jobTitleOptions: [
        { key: 0, value: '助教' },
        { key: 1, value: '讲师' },
        { key: 2, value: '副教授' },
        { key: 3, value: '教授' }
      ],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      multipleSelection: [],
      associatedTIds: [],
      dialogImportVisible: false,
      fileList: [],
      output: {
        teachers: []
      }
    }
  },
  created() {
    this.getList()
    this.getAllSubjects()
    this.getAllDepartments()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/teacher/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.teacherPage.list
          this.total = res.teacherPage.total
          this.getTeacherByTaskId()
        } else {
          this.$message.error('获取导师信息错误')
        }
      })
    },
    getTeacherByTaskId() {
      this.axios({
        method: 'post',
        url: '/task/getTeacherIdByTaskId',
        data: this.qs.stringify({
          'id': this.value
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.associatedTIds = res.teacherIds
          this.associatedTIds.forEach((v) => {
            this.$refs.table.toggleRowSelection(this.list.find(c => c.id === v), true)
          })
        } else {
          this.$message.error('获取关联教师信息失败')
        }
      })
    },
    getAllSubjects() {
      this.axios({
        method: 'post',
        url: '/subject/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.subjectOptions = res.subjects
        } else {
          this.$message.error('获取学科信息错误')
        }
      })
    },
    getAllDepartments() {
      this.axios({
        method: 'post',
        url: '/department/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.departmentOptions = res.departments
        } else {
          this.$message.error('获取部门信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/teacher/pageQuery',
        data: {
          'number': this.listQuery.number,
          'name': this.listQuery.name,
          'jobTitle': this.listQuery.jobTitle,
          'subjectId': this.listQuery.subjectId,
          'departmentId': this.listQuery.departmentId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.teacherPage.list
          this.total = res.teacherPage.total
        } else {
          this.$message.error('获取导师信息错误')
        }
      })
    },
    handleImport() {
      this.dialogImportVisible = true
    },
    handleDownloadTemplate() {
      window.location.href = 'http://127.0.0.1:8080/teacher/downloadTemplate2Related'
    },
    handleSuccess(res, file, index) {
      this.$message.success('文件导入成功')
      this.dialogImportVisible = false
      this.fileList = this.fileList.slice(-1) // 获取数组元素的第一个值
    },
    handleError() {
      this.$message.error('文件导入失败')
    },
    uploadBefore(file) {
      const _this = this
      // 使返回的值变成Promise对象，如果校验不通过，则reject，校验通过，则resolve
      return new Promise(function(resolve, reject) {
        // readExcel方法也使用了Promise异步转同步，此处使用then对返回值进行处理
        _this.readExcel(file).then(result => {
          const isLt2M = file.size / 1024 / 1024 < 2
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
          const extension = testmsg === 'xls' || testmsg === 'xlsx'
          if (!isLt2M) {
            _this.$message.error('文件大小不能超过500kb!')
          }
          if (!extension) {
            _this.$message.error('文件类型只能是.xls或者.xlsx，请重新上传')
          }
          if (isLt2M && result) {
            resolve('校验成功!')
          }
        }, error => {
          _this.$message.error(error)
        })
      })
    },
    readExcel(file) {
      const _this = this
      _this.output.teachers = []
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = (e) => {
          let workbook
          try {
            // 以二进制流方式读取得到整份excel表格对象
            const data = e.target.result
            workbook = XLSX.read(data, { type: 'binary' })
          } catch (e) {
            this.handleError()
          }
          for (const sheet in workbook.Sheets) {
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            for (var i = 0; i < ws.length; i++) {
              _this.output.teachers[i] = ws[i].编号
            }
          }
        }
        reader.readAsBinaryString(file)
      })
    },
    handleConfirmImport() {
      this.axios({
        method: 'post',
        url: '/teacher/related2TaskByExcel',
        data: {
          'taskId': this.value,
          'numbers': this.output.teachers
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.handleSuccess()
        } else {
          this.handleError()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    related2Task() {
      if (this.multipleSelection.length) {
        this.axios({
          method: 'post',
          url: '/teacher/related2Task',
          data: {
            'taskId': this.value,
            'numbers': this.getNumber(this.multipleSelection, 'number')
          }
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('关联成功')
          } else {
            this.$message.error('关联失败')
          }
          this.getList()
        })
      } else {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
      }
    },
    getNumber(input, field) {
      var output = []
      for (var i = 0; i < input.length; i++) {
        output.push(input[i][field])
      }
      return output
    },
    getRowKeys(row) {
      return row.id
    },
    getGender(gender) {
      return gender === 0 ? '男' : '女'
    },
    getJobTitleName(jobTitle) {
      var jobTitleName = ''
      if (jobTitle === 0) {
        jobTitleName = '助教'
      } else if (jobTitle === 1) {
        jobTitleName = '讲师'
      } else if (jobTitle === 2) {
        jobTitleName = '副教授'
      } else {
        jobTitleName = '教授'
      }
      return jobTitleName
    },
    getJobTitleCode(jobTitle) {
      var jobTitleCode
      if (jobTitle === '助教') {
        jobTitleCode = 0
      } else if (jobTitle === '讲师') {
        jobTitleCode = 1
      } else if (jobTitle === '副教授') {
        jobTitleCode = 2
      } else {
        jobTitleCode = 3
      }
      return jobTitleCode
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
