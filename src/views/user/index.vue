<template>
  <div class="app-container">
    <div>
      <!-- <AccountOption v-model="account" />
      <GenderOption v-model="gender" />
      <DepartmentOption v-model="department" />
      <RoleOption v-model="role" /> -->
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
        v-waves
        :loading="listLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
    </div>
    <!-- <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%:margin-top: 30px;"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
    </el-table>-->

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index + (listQuery.page - 1) * listQuery.limit + 1 }}</template>
      </el-table-column>
      <el-table-column label="账号" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="性别" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gender | genderFilter">{{ scope.row.gender }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="165" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="电话" width="140" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column align="center" prop="create_time" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="部门" width="160" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.department | departmentFilter">{{ scope.row.department }}</el-tag> -->
          {{ scope.row.departmentName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色" width="160" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.role | roleFilter">{{ scope.row.role }}</el-tag> -->
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录次数" min-width="60px">
        <template slot-scope="scope">{{ scope.row.loginTimes }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="info" size="small" @click="hanleDetail(scope)">查看详情</el-button>
          <el-button type="success" size="small" @click="handleAssign(scope)">分配角色</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">冻结</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
// import AccountOption from './components/AccountOption'
// import GenderOption from './components/GenderOption'
// import DepartmentOption from './components/DepartmentOption'
// import RoleOption from './components/RoleOption'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  // components: { AccountOption, GenderOption, RoleOption, DepartmentOption, Pagination },
  components: { Pagination },
  directives: { waves },
  filters: {
    genderFilter(status) {
      const genderMap = {
        '男': 'success',
        '女': 'danger'
      }
      return genderMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        account: '',
        gender: 0,
        departmentId: 0,
        roleId: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.axios({
        method: 'post',
        url: '/user/pageQuery',
        data: {
          'account': this.listQuery.account,
          'gender': this.listQuery.gender,
          'departmentId': this.listQuery.departmentId,
          'roleId': this.listQuery.roleId,
          'curPage': this.listQuery.page,
          'limit': this.listQuery.limit
        }
      })
        .then((response) => {
          const res = response.data
          if (res.code === 200) {
            this.list = res.userPage.list
            this.total = res.userPage.total
          } else {
            this.$message.error('获取用户信息错误')
          }
        })
    },
    getList() {

    },
    handleEdit() {

    },
    handleDetail() {

    },
    handleAssign() {

    },
    handleDelete() {

    },
    handleFilter() {

    },
    handleCreate() {

    },
    handleDownload() {

    }
  }
}
</script>
