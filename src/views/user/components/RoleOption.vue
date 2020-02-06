<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="margin:10px;">角色: </label>
    <el-select v-model="role" style="width:120px;">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'ALL'
    }
  },
  data() {
    return {
      options: ['Administrator', 'Subject_Secretary', 'Tutor', 'Student']
    }
  },
  computed: {
    role: {
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
