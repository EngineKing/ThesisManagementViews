<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.account" clearable placeholder="请输入账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gender" placeholder="请选择性别" clearable style="width: 120px;" class="filter-item">
        <el-option v-for="item in genderOptions" :key="item.value" :label="item.value" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.departmentId" placeholder="请选择部门" clearable style="width: 160px" class="filter-item">
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
      <el-table-column label="账号" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="性别" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderFilter">{{ getGender(scope.row.gender) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="170" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="电话" width="170" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_time" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="部门" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.department.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录次数" min-width="60px">
        <template slot-scope="scope">{{ scope.row.loginTimes }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="handleAssign(scope.row)">分配角色</el-button>
          <el-button type="danger" size="small" @click="deleteUser(scope)">冻结</el-button>
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
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" class="filter-item">
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="temp.departmentId" class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in departmentOptions"
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

    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible">
      <el-form
        ref="roleDataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-checkbox-group v-model="checkedRoles">
            <el-checkbox
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.id"
            >{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="assignData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { phone, email, select } from '@/utils/formValidator.js'

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
        account: '',
        gender: undefined,
        departmentId: undefined
      },
      genderOptions: [{ key: 0, value: '男' }, { key: 1, value: '女' }],
      departmentOptions: [],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      temp: {
        id: 0,
        account: '',
        password: '123',
        gender: 0,
        phone: '',
        email: '',
        createTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        departmentId: undefined,
        loginTimes: 0,
        status: 0
      },
      checkedRoles: [],
      roleOptions: [],
      dialogFormVisible: false,
      roleDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '账号不能小于4位', trigger: 'blur' }
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
    this.getAllRoles()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/user/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.userPage.list
          this.total = res.userPage.total
        } else {
          this.$message.error('获取用户信息错误')
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
    getAllRoles() {
      this.axios({
        method: 'post',
        url: '/role/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.roleOptions = res.roles
        } else {
          this.$message.error('获取角色信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/user/pageQuery',
        data: {
          'account': this.listQuery.account,
          'gender': this.listQuery.gender,
          'departmentId': this.listQuery.departmentId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.userPage.list
          this.total = res.userPage.total
        } else {
          this.$message.error('获取用户信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        account: '',
        password: '123',
        gender: 0,
        phone: '',
        email: '',
        createTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        departmentId: undefined,
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
            url: '/user/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('添加用户成功')
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
      this.temp.departmentId = row.department.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.temp.updateTime = new Date().getTime()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/user/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑用户成功')
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
    handleAssign(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.id = row.id
      this.roleDialogFormVisible = true
      this.axios({
        method: 'post',
        url: '/userRole/getByUserId',
        data: this.qs.stringify({
          'id': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.checkedRoles = res.userRoleIdList
        } else {
          this.$message.error(res.msg)
          // this.$message.error('获取用户角色信息错误')
        }
      })
    },
    assignData() {
      this.axios({
        method: 'post',
        url: '/userRole/assign',
        data: {
          'userId': this.temp.id,
          'roleIds': this.checkedRoles
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.$message.success('分配角色成功')
          this.roleDialogFormVisible = false
        } else {
          this.$message.error(res.msg)
          // this.$message.error('分配角色失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    deleteUser(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: 'user/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('冻结用户成功')
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
    getGender(gender) {
      return gender === 0 ? '男' : '女'
    },
    handleDownload() {

    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
