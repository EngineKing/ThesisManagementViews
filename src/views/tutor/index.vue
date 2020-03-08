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
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleImport"
      >导入</el-button>
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
      ref="tutorTable"
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
          <el-tag
            :type="scope.row.jobTitle | jobTitleFilter"
          >{{ getJobTitleName(scope.row.jobTitle) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属学科" min-width="160" align="center">
        <template slot-scope="scope">{{ scope.row.subject.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属部门" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.department.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="info" size="small" @click="getDetail(scope.row)">详情</el-button>
          <el-button type="danger" size="small" @click="deleteTeacher(scope)">冻结</el-button>
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

    <div :if="dialogFormVisible">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="80px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item v-show="dialogStatus === 'create'" label="账号" prop="account">
            <el-input v-model="temp.account" />
          </el-form-item>
          <el-form-item label="编号" prop="number">
            <el-input v-model="temp.number" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="temp.gender" class="filter-item" @change="change()">
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="temp.age" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item label="职称" prop="jobTitle">
            <el-select v-model="temp.jobTitle" class="filter-item" @change="change()">
              <el-option
                v-for="item in jobTitleOptions"
                :key="item.value"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input v-model="temp.introduction" />
          </el-form-item>
          <el-form-item label="所属学科" prop="subjectId">
            <el-select
              v-model="temp.subjectId"
              class="filter-item"
              placeholder="请选择"
              @change="change()"
            >
              <el-option
                v-for="item in subjectOptions"
                :key="item.name"
                :label="item.name"
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
    </div>
    <el-dialog title="查看详情" :visible.sync="detailDialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" :disabled="true" />
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="temp.number" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" :disabled="true" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" disabled class="filter-item" @change="change()">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" :disabled="true" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" :disabled="true" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" :disabled="true" />
        </el-form-item>
        <el-form-item label="职称" prop="jobTitle">
          <el-select v-model="temp.jobTitle" disabled class="filter-item" @change="change()">
            <el-option
              v-for="item in jobTitleOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input v-model="temp.introduction" :disabled="true" />
        </el-form-item>
        <el-form-item label="所属学科" prop="subjectId">
          <el-select
            v-model="temp.subjectId"
            class="filter-item"
            disabled
            placeholder="请选择"
            @change="change()"
          >
            <el-option
              v-for="item in subjectOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select
            v-model="temp.departmentId"
            class="filter-item"
            disabled
            placeholder="请选择"
            @change="change()"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" disabled class="filter-item" placeholder="请选择">
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
        <el-button @click="detailDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="detailDialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="dialogImportVisible">
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
import { select, email, phone } from '@/utils/formValidator.js'
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
      subjectMap: new Map(),
      genderOptions: [{ key: 0, value: '男' }, { key: 1, value: '女' }],
      jobTitleOptions: [
        { key: 0, value: '助教' },
        { key: 1, value: '讲师' },
        { key: 2, value: '副教授' },
        { key: 3, value: '教授' }
      ],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      temp: {
        id: 0,
        number: '',
        name: '',
        account: '',
        password: '123',
        gender: 0,
        phone: '',
        email: '',
        age: undefined,
        jobTitle: undefined,
        introduction: '',
        createTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        subjectId: undefined,
        departmentId: undefined,
        loginTimes: 0,
        status: 0
      },
      dialogFormVisible: false,
      detailDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      multipleSelection: [],
      allExportLoading: false,
      dialogImportVisible: false,
      fileList: [],
      output: {
        userAndTeachers: []
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '账号不能小于4位', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '编号不能为空', trigger: blur },
          { type: 'string', min: 4, message: '编号不能小于4位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: phone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: email, trigger: 'blur' }
        ],
        jobTitle: [
          { required: true, message: '请选择职称', trigger: 'blur' },
          { validator: select, trigger: 'blur' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' },
          { validator: select, trigger: 'change' }
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
        } else {
          this.$message.error('获取导师信息错误')
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
          for (var i = 0; i < this.subjectOptions.length; i++) {
            this.subjectMap.set(this.subjectOptions[i].name, this.subjectOptions[i].id)
          }
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
    resetTemp() {
      this.temp = {
        id: 0,
        number: '',
        name: '',
        gender: undefined,
        age: undefined,
        phone: '',
        email: '',
        jobTitle: undefined,
        introduction: '',
        subjectId: undefined,
        departmentId: undefined,
        createTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        loginTimes: 0,
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
            url: '/teacher/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增导师成功')
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
      this.temp.subjectId = row.subject.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/teacher/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑导师成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
              // this.$message.error('编辑部门失败')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    handleImport() {
      this.dialogImportVisible = true
    },
    handleDownloadTemplate() {
      window.location.href = 'http://127.0.0.1:8080/teacher/downloadTemplate'
    },
    handleSuccess(res, file, index) {
      this.$message.success('文件导入成功')
      this.fileList = this.fileList.slice(-1) // 获取数组元素的第一个值
      this.dialogImportVisible = false
      this.getList()
    },
    handleError(res) {
      this.$message.error(res.msg)
      // this.$message.error('文件导入失败')
      this.dialogImportVisible = false
      this.getList()
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
      _this.output.userAndTeachers = []
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
              var sheetData = {
                account: ws[i].账号,
                number: ws[i].编号,
                name: ws[i].姓名,
                gender: ws[i].性别 === '男' ? 0 : 1,
                age: ws[i].年龄,
                phone: ws[i].电话号码,
                email: ws[i].邮箱,
                jobTitle: _this.getJobTitleCode(ws[i].职称),
                introduction: ws[i].简介,
                subjectId: _this.subjectMap.get(ws[i].所属学科)
              }
              _this.output.userAndTeachers.push(sheetData)
            }
          }
        }
        reader.readAsBinaryString(file)
      })
    },
    handleConfirmImport() {
      this.axios({
        method: 'post',
        url: '/teacher/batchInsert',
        data: this.output.userAndTeachers
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.handleSuccess()
        } else {
          this.handleError(res)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleExport() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true
        window.location.href = 'http://127.0.0.1:8080/teacher/export?teacherIds=' + this.getIds(this.multipleSelection, 'id')
      } else {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
      }
    },
    handleAllExport() {
      this.allExportLoading = true
      var tutorForm = {
        'number': this.listQuery.number,
        'name': this.listQuery.name,
        'jobTitle': this.listQuery.jobTitle,
        'subjectId': this.listQuery.subjectId,
        'departmentId': this.listQuery.departmentId
      }
      window.location.href = 'http://127.0.0.1:8080/teacher/allExport?condition=' + encodeURI(JSON.stringify(tutorForm))
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
    },
    getDetail(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.subjectId = row.subject.id
      this.temp.departmentId = row.department.id
      this.detailDialogFormVisible = true
    },
    deleteTeacher(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/teacher/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除导师成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
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
