<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.name"
        clearable
        placeholder="请输入角色名称"
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
      <el-table-column label="角色名称" width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色描述" min-width="300" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="handleAssign(scope.row)">分配权限</el-button>
          <el-button type="danger" size="small" @click="deleteRole(scope)">删除</el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <div :if="dialogTreeVisible">
      <el-dialog title="分配权限" :visible.sync="dialogTreeVisible">
        <el-tree
          ref="tree"
          :data="menus"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="checkedMenus"
          :props="defaultProps"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTreeVisible = false">取消</el-button>
          <el-button type="primary" @click="assignData()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

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
        name: ''
      },
      temp: {
        id: 0,
        name: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogTreeVisible: false,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      menus: [],
      checkedMenus: [],
      roleId: undefined,
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/role/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.rolePage.list
          this.total = res.rolePage.total
        } else {
          this.$message.error('获取角色信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/role/pageQuery',
        data: {
          'name': this.listQuery.name,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.rolePage.list
          this.total = res.rolePage.total
        } else {
          this.$message.error('获取角色信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        description: ''
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
            url: '/role/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增角色成功')
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/role/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑角色成功')
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
    handleAssign(row) {
      this.getMenus()
      this.getCheckedMenus(row)
      this.dialogTreeVisible = true
      this.roleId = row.id
    },
    getMenus() {
      this.axios({
        method: 'get',
        url: 'menu/listTree'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.menus = res.menuVOS
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getCheckedMenus(row) {
      this.axios({
        method: 'post',
        url: '/role/getPermissions',
        data: this.qs.stringify({
          'id': row.id
        })
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.checkedMenus = res.menuIds
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    assignData() {
      this.axios({
        method: 'post',
        url: '/role/assign',
        data: {
          'roleId': this.roleId,
          'menuIds': this.$refs.tree.getCheckedKeys()
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.$message.success('权限分配成功')
          this.dialogTreeVisible = false
        } else {
          this.$message.error('权限分配失败')
        }
      })
    },
    deleteRole(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/role/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除角色成功')
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
