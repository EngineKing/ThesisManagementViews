<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="margin:20px;">Parent Department: </label>
    <el-select v-model="pDepartment" style="width:120px;">
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
      options: ['First_Clinical', 'Second_Clinical', 'Third_Clinical']
    }
  },
  computed: {
    pDepartment: {
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
