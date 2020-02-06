<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;margin:10px;">账号: </label>
    <el-input v-model="account" placeholder="请输入账号" style="width:345px;" prefix-icon="el-icon-document" />
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
    account: {
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
