<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="handleAddRole">New Department</el-button>
      <DepartmentNameOption v-model="deparmentName" />
      <PDepartmentOption v-model="pDepartment" />
      <el-button type="primary" round style="margin-left:20px;padding:10px 20px 10px 10px;">
        <svg-icon icon-class="search" />
        搜索
      </el-button>
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
    </el-table> -->

    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="DepartmentName" width="240" align="center">
        <template slot-scope="scope">
          {{ scope.row.departmentName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Parent_Department" width="240" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.pDepartment | pDepartmentFilter">{{ scope.row.pDepartment }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope)">Detail</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/table'

import DepartmentNameOption from './components/DepartmentNameOption'
import PDepartmentOption from './components/PDepartmentOption'

export default {
  components: { DepartmentNameOption, PDepartmentOption },
  filters: {
    pDepartmentFilter(status) {
      const pDepartmentMap = {
        First_Clinical: 'primary',
        Second_Clinical: 'success',
        Third_Clinical: 'warning'
      }
      return pDepartmentMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getDepartmentList().then(response => {
        this.list = response.departmentData.items
        this.listLoading = false
      })
    }
  }
}
</script>
