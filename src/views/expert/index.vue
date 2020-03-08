<template>
  <div class="app-container">
    <div>
      <el-input v-model="listQuery.name" clearable placeholder="请输入专家组名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.teacherId" placeholder="请选择组长" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in teacherOptions" :key="item.name" :label="item.name" :value="item.id" />
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
        icon="el-icon-menu"
        @click="handleAssign"
      >分配学生</el-button>
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
      <el-table-column label="名称" min-width="240" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="组长" min-width="240" align="center">
        <template slot-scope="scope">{{ scope.row.teacher.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="success" size="small" @click="handleAssign(scope.row)">分配成员</el-button>
          <el-button type="danger" size="small" @click="deleteExpertGroup(scope)">删除</el-button>
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
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="专家组名称" prop="name">
          <el-input v-model="temp.name" clearable />
        </el-form-item>
        <el-form-item label="组长" prop="teacherId">
          <el-select v-model="temp.teacherId" clearable class="filter-item" placeholder="请选择" @change="change()">
            <el-option
              v-for="item in teacherOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" clearable class="filter-item" placeholder="请选择" @change="change()">
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
        teacherId: undefined
      },
      statusOptions: [{ key: 0, value: '正常' }, { key: 1, value: '冻结' }],
      temp: {
        id: 0,
        name: '',
        teacherId: undefined,
        status: 0
      },
      teacherOptions: [],
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
        teacherId: [
          { required: true, message: '请选择专家组组长', trigger: 'change' },
          { validator: select, message: '请选择专家组组长', trigger: 'change' }
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
    this.getLeaders()
  },
  methods: {
    getList() {
      this.axios({
        method: 'post',
        url: '/expertGroup/pageQuery',
        data: {
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.expertGroupPage.list
          this.total = res.expertGroupPage.total
        } else {
          this.$message.error('获取专家组信息错误')
        }
      })
    },
    getLeaders() {
      this.axios({
        method: 'get',
        url: '/expertGroup/getLeaders'
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.teacherOptions = res.leaders
        } else {
          this.$message.error('获取组长错误')
        }
      })
    },
    handleFilter() {
      this.axios({
        method: 'post',
        url: '/expertGroup/pageQuery',
        data: {
          'name': this.listQuery.name,
          'teacherId': this.listQuery.teacherId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      }).then((response) => {
        const res = response.data
        if (res.code === 200) {
          this.list = res.expertGroupPage.list
          this.total = res.expertGroupPage.total
        } else {
          this.$message.error('获取专家组信息错误')
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        teacherId: undefined,
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
            url: '/expertGroup/add',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('新增专家组成功')
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
      this.temp.teacherId = row.teacher.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'post',
            url: '/expertGroup/update',
            data: this.temp
          }).then((response) => {
            const res = response.data
            if (res.code === 200) {
              this.$message.success('编辑专家组成功')
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
    deleteExpertGroup(scope) {
      this.$confirm('是否要继续此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios({
          method: 'post',
          url: '/expertGroup/delete',
          data: this.qs.stringify({
            'id': scope.row.id
          })
        }).then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.$message.success('删除专家组成功')
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    handleAssign() {
      // todo: 利用树形结构 分配专家组成员
    },
    change() {
      this.$forceUpdate()
    }
  }
}
</script>
