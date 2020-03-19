<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.name" clearable placeholder="请输入菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column align="center" label="ID" min-width="95">
        <template slot-scope="scope">{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
      </el-table-column>
      <el-table-column label="名称" min-width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="上级菜单" min-width="240" align="center">
        <template slot-scope="scope">{{ getMenuName(scope.row.pmenu) }}</template>
      </el-table-column>
      <el-table-column label="类型" min-width="200" align="center">
        <template slot-scope="scope">{{ getType(scope.row.type) }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="备注" min-width="260" align="center">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="260px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
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
        <el-form-item label="名称" prop="name" placeholder="请输入菜单名称">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="pid">
          <el-select v-model="temp.pid" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in menuOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="url" placeholder="请输入菜单路径">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="权限" prop="permission" placeholder="请输入菜单权限">
          <el-input v-model="temp.permission" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNo" placeholder="请输入菜单排序">
          <el-input v-model="temp.orderNo" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark" placeholder="请输入菜单说明">
          <el-input v-model="temp.remark" />
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
        name: ''
      },
      typeOptions: [{ key: 0, value: '菜单' }, { key: 1, value: '接口' }],
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      menuOptions: [],
      temp: {
        name: '',
        pid: undefined,
        url: '',
        permission: '',
        orderNo: '',
        type: '',
        remark: '',
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
        pid: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ],
        url: [
          { required: true, message: '路径不能为空', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'change' },
          { validator: select, trigger: 'change' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'change' },
          { validator: select, trigger: 'change' }
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
        url: '/menu/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.menuPage.list
          this.total = res.menuPage.total
        } else {
          this.$message.error('获取菜单信息错误')
        }
      })
    },
    getMenus() {
      this.axios({
        method: 'get',
        url: '/menu/getAll'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.menuOptions = res.menus
        } else {
          this.$message.error('获取菜单信息错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/menu/pageQuery',
        data: {
          'name': this.listQuery.name,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.menuPage.list
          this.total = res.menuPage.total
        } else {
          this.$message.error('获取角色信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        pid: undefined,
        url: '',
        permission: '',
        orderNo: '',
        type: '',
        remark: '',
        status: 0
      }
    },
    handleCreate() {
      this.getMenus()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/menu/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增菜单成功')
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
      this.getMenus()
      this.temp = Object.assign({}, row) // copy obj
      this.temp.pid = row.pmenu.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/menu/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑菜单成功')
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
    deleteRole(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/menu/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除菜单成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    getMenuName(pmenu) {
      return pmenu === null ? '无' : pmenu.name
    },
    getType(type) {
      return type === 0 ? '菜单' : '接口'
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
