<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="margin:10px;">性别: </label>
    <el-radio-group v-model="gender">
      <el-radio :label="true" border>
        男
      </el-radio>
      <el-radio :label="false" border>
        女
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    gender: {
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
