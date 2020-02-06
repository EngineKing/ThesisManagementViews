<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;margin:20px;">DepartmentName: </label>
    <el-input v-model="departmentName" placeholder="Please enter the department name" style="width:345px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    departmentName: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
