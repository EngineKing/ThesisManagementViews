<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.name" clearable placeholder="请输入学科名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.department" placeholder="请选择所属部门" clearable style="width: 180px;" class="filter-item">
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
      <el-table-column label="学科名称" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属部门" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.department.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="学科描述" min-width="300" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteSubject(scope)">删除</el-button>
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
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="temp.departmentId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in departmentOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学科描述" prop="description">
          <el-input v-model="temp.description" />
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
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { select } from '@/utils/formValidator.js'

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
        department: undefined
      },
      departmentOptions: [],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      temp: {
        id: 0,
        name: '',
        departmentId: undefined,
        description: '',
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
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
    this.getAllDepartments()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/subject/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.subjectPage.list
          this.total = res.subjectPage.total
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
        url: '/subject/pageQuery',
        data: {
          'name': this.listQuery.name,
          'departmentId': this.listQuery.department,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.subjectPage.list
          this.total = res.subjectPage.total
        } else {
          this.$message.error('获取学科信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        departmentId: undefined,
        description: '',
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
            url: '/subject/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增学科成功')
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
      this.temp.departmentId = row.department.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/subject/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑学科成功')
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
    deleteSubject(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/subject/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除学科成功')
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
    }
  }
}
</script>
