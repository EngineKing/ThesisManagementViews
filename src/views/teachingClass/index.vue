<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.name" clearable placeholder="请输入部门名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gradeId" placeholder="请选择年级" clearable style="width: 180px;" class="filter-item">
        <el-option v-for="item in gradeOptions" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.subjectId" placeholder="请选择学科" clearable style="width: 180px;" class="filter-item">
        <el-option v-for="item in subjectOptions" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.departmentId" placeholder="请选择部门" clearable style="width: 180px;" class="filter-item">
        <el-option v-for="item in departmentOptions" :key="item.name" :label="item.name" :value="item.id" />
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleAdd"
      >新增年级</el-button>
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
      <el-table-column label="班级名称" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属年级" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.grade.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属学科" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.subject.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属部门" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.department.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteTeachingClass(scope)">删除</el-button>
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
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属年级" prop="gradeId">
          <el-select v-model="temp.gradeId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in gradeOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" prop="subjectId">
          <el-select v-model="temp.subjectId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in subjectOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="temp.departmentId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in departmentOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
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

    <el-dialog title="新增年级" :visible.sync="gradeDialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="年级名称" prop="gradeName">
          <el-input v-model="gradeName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gradeDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addGradeData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { text, select } from '@/utils/formValidator.js'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        gradeId: undefined,
        subjectId: undefined,
        departmentId: undefined
      },
      gradeOptions: [],
      subjectOptions: [],
      departmentOptions: [],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      temp: {
        id: 0,
        name: '',
        gradeId: undefined,
        subjectId: undefined,
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gradeDialogFormVisible: false,
      gradeName: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        gradeName: [
          // { required: true, message: '名称不能为空', trigger: 'blur' }
          { validator: text, message: '名称不能为空', trigger: 'blur' }
        ],
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'change' },
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
    this.getAllGrades()
    this.getAllSubjects()
    this.getAllDepartments()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/teachingClass/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.teachingClassPage.list
          this.total = res.teachingClassPage.total
        } else {
          this.$message.error('获取教学班级信息错误')
        }
      })
    },
    getAllGrades() {
      this.axios({
        method: 'post',
        url: '/grade/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.gradeOptions = res.grades
        } else {
          this.$message.error('获取年级信息错误')
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
        url: '/teachingClass/pageQuery',
        data: {
          'name': this.listQuery.name,
          'gradeId': this.listQuery.gradeId,
          'subjectId': this.listQuery.subjectId,
          'departmentId': this.listQuery.departmentId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.teachingClassPage.list
          this.total = res.teachingClassPage.total
        } else {
          this.$message.error('获取教学班级信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        gradeId: undefined,
        subjectId: undefined,
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
            url: '/teachingClass/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增教学班级成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error(res.msg)
              // this.$message.error('新增部门失败')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.gradeId = row.grade.id
      this.temp.subjectId = row.subject.id
      this.temp.departmentId = row.department.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/teachingClass/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑教学班级成功')
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
    deleteTeachingClass(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/teachingClass/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除教学班级成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    change() {
      this.$forceUpdate()
    },
    handleAdd() {
      this.gradeName = ''
      this.gradeDialogFormVisible = true
    },
    addGradeData() {
      this.axios({
        method: 'post',
        url: '/grade/add',
        data: {
          'name': this.gradeName
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.$message.success('新增年级成功')
          this.gradeDialogFormVisible = false
          this.getAllGrades()
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
