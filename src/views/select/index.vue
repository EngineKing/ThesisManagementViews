<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="导师姓名" style="width: 200px;" class="filter-item" />
      <el-input placeholder="题目名称" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-search"
        @click="handleFilter"
      >查看选题结果</el-button>
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
      <el-table-column label="导师" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.tutor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.description }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="发表时间" min-width="130px">
        <template slot-scope="{row}">
          <i class="el-icon-time" />
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可选人数" width="60px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.optional }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已选人数" width="60px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.selected }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="130"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            :disabled="row.optional <= row.selected"
            @click="handleUpdate(row)"
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>
<script>
import { fetchList } from '@/api/topic'
import waves from '@/directive/waves'
// import Pagination from '@/components/Pagination'

export default {
  name: 'RoleTable',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 3,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      currentPage: 1,
      pageSize: 10
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
