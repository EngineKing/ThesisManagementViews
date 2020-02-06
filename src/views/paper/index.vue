<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="任务标题" style="width: 200px;" class="filter-item" />
      <el-select placeholder="任务类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in taskOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        父任务
      </el-checkbox>-->
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top:20px;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="任务标题" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="任务描述" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.description }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeFilter">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="父任务" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="120px">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.begin_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="截止时间" min-width="120px">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结果截止上报时间" min-width="120px">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.result_end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否通过" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_pass | isPassFilter">{{ scope.row.is_pass }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="140"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">下载附件</el-button>
          <el-button
            type="success"
            size="mini"
            :disabled="row.is_pass == '否' || row.is_pass == '是'"
            @click="handleUpdate(row)"
          >提交结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" @pagination="getList" />
  </div>
</template>
<script>
import { fetchList } from '@/api/task'
export default {
  filters: {
    typeFilter(status) {
      const typeMap = {
        '毕业设计任务': 'primary',
        '开题报告任务': 'info',
        '论文预答辩任务': 'warning',
        '论文答辩任务': 'gray'
      }
      return typeMap[status]
    },
    isPassFilter(status) {
      const isPassMap = {
        '是': 'primary',
        '进行中': 'info',
        '否': 'danger'
      }
      return isPassMap[status]
    }
  },
  data() {
    return {
      list: null,
      // showReviewer: false,
      taskOptions: ['毕业设计任务', '开题报告任务', '论文预答辩任务', '论文答辩任务'],
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
