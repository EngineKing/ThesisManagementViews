<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :action="uploadAction"
    :data="formData"
    :on-success="handleSuccess"
    :on-error="handleError"
    :auto-upload="false"
    :with-credentials="true"
  >
    <el-button slot="trigger" size="small" type="primary" icon="el-icon-document">选取文件</el-button>
    <el-button
      style="margin-left: 10px;"
      size="small"
      type="success"
      icon="el-icon-upload"
      @click="submitUpload"
    >上传到服务器</el-button>
  </el-upload>
</template>
<script>
// 用于测试单独的功能
export default {
  data() {
    return {
      uploadAction: 'http://127.0.0.1:8080/taskResult/submit',
      formData: {
        userId: 37,
        taskId: 4
      }
    }
  },
  methods: {
    handleSuccess(content) {
      console.log(content)
    },
    handleError(content) {
      console.log(content)
    },
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>
