<template>
<div style="width: 100%;height: 100vh;display: flex;justify-content: center;align-items: center;overflow-y: hidden">
  <div style="width: 100%">
    <el-row type="flex" justify="center">
      <el-col :xl="6" :lg="7">
        <h2>欢迎来到医疗后台管理系统</h2>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :xl="6" :lg="7">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
          <el-form-item label="用户名" prop="username" style="width: 380px;">
            <el-input v-model="loginForm.username" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password"  style="width: 380px;">
            <el-input v-model="loginForm.password" type="password" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code"  style="width: 380px;">
            <el-input v-model="loginForm.code"  style="width: 172px; float: left" maxlength="5" @keyup.enter.native="submitForm('loginForm')"></el-input>
            <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">立即登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>

  <canvas height="926" width="1920" style="position: fixed; top: 0px; left: 0px; z-index: -999; opacity: 0.5;" id="c_n1"></canvas>
</div>
</template>

<script>
import qs from 'qs';
import './antimote/canvas-nest.min.js'
export default {
  name: "Login",
  data() {
    return {

      loginForm: {
        username: 'admin',
        password: '888888',
        code: '',
        key: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
        ],
      },
      captchaImg: null
    };
  },
  methods: {
   async submitForm(formName) {
     localStorage.removeItem('token')
    await this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('http://43.143.189.51:9999/login?'+ qs.stringify(this.loginForm)).then(res => {
            //接收res后端返回
            //处理请求头
            const authorization = res.headers['authorization'];
            const User = authorization.split(",");
            const tokens = User[0];
            const UserStation = User[1];
            localStorage.removeItem("token");
            localStorage.setItem("token",tokens);
            localStorage.removeItem("UserStation");
            localStorage.setItem("UserStation",UserStation);
            if (UserStation==1){
              this.$router.push("/index/Domd");
            }else if (UserStation==2){
              this.$notify({
                title: '错误',
                message: '请在客户端登录',
                type: 'danger'
              });
              this.$router.push("/index");
            }else {
              this.$notify({
                title: '错误',
                message: '未授权用户',
                type: 'danger'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
   async getCaptcha() {
     await this.$axios.get('/auth/captcha').then(res => {
        this.loginForm.key = res.data.data.token
        this.captchaImg = res.data.data.captchaImg
        this.loginForm.code = ''
      })
    },
  },
  created() {
    this.getCaptcha()
  }
}
</script>

<style scoped>
.el-row {
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.el-divider {
  height: 200px;
}
.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}
</style>