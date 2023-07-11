<template>
  <div id="UserGroup">
    <el-row :gutter="20">
      <el-col :span="8" :offset="1">
        <div class="grid-content1 bg-purple">
        <el-upload
            class="avatar-uploader"
            action="http://43.143.189.51:9999/tsetmeal/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            :before-upload="beforeAvatarUpload">
        <div class="demo-type">
          <el-avatar :size="200"  style="margin: 10px">
            <img :src="'http://imnu.congmingdemofeitegjj.shop/'+imageUrl"/>
          </el-avatar>
        </div>
        </el-upload>
          <div style="margin-top: 10px;margin-bottom: 10px">
            {{ this.User.username }}
          </div>
          <div style="margin-top: 10px;margin-bottom: 10px;font-size: 5px">
            生日：{{ this.User.birthdayput }}
          </div>
          <el-tag type="success">点击头像更换新头像</el-tag>
          <div class="cards">
            <div style="margin-left: auto;margin-right: auto;background: #f4f4f5;padding: 15px;margin-top: -25px">
              信息绑定
            </div>
            <div style="margin-top: 10px;margin-bottom: 10px">
              电话：{{ this.User.telephone }}
            </div>
            <div style="margin-top: 30px;margin-bottom: 20px">

            </div>
          </div>
      </div>
      </el-col>
      <el-col :span="14"><div class="grid-content bg-purple">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="ruleForm.role" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话号" prop="phonenumber">
            <el-input v-model="ruleForm.phonenumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即更改</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {

  data() {
    return {
      newimageURL:'',
      imageUrlup:'',
      User:'',
      imageUrl:'',
      ruleForm: {
        id:'',
        birthday:'',
        name: '',
        role:'',
        phonenumber:'',
        gender:'',
        station:'',
      },
      headers:{
        Authorization:localStorage.getItem("token"),
      },
      rules: {
        name: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        phonenumber: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    //更新信息
  async  submitForm(formName) {
     await this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/update',{
            birthday: this.ruleForm.birthday,
            gender: this.ruleForm.gender,
            id: this.ruleForm.id,
            password: null,
            remark: this.imageUrl,
            station: this.ruleForm.station,
            telephone: this.ruleForm.phonenumber,
            username: this.ruleForm.name,
          })
              .then((res)=>{
                this.getUser();
              });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //获取个人信息
    async  getUser(){
     await this.$axios.get('/auth/userInfo').then((res)=>{
        this.User = res.data.data;
        this.imageUrl = res.data.data.remark;
        this.ruleForm.name=res.data.data.username;
        this.ruleForm.role = res.data.data.roleName;
        this.ruleForm.phonenumber = res.data.data.telephone;
        this.ruleForm.id = res.data.data.id;
        this.ruleForm.birthday = res.data.data.birthdayput;
        this.ruleForm.gender = res.data.data.gender;
        this.ruleForm.station = res.data.data.station;
      })
    },
    //头像上传
    handleAvatarSuccess(res) {
      this.imageUrl = res.data;
      //单独更改头像也需要上传
      this.submitForm('ruleForm');
      this.getUser();
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success'
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  created() {
    this.getUser();
  }
}
</script>
<style>
.bg-purple {
  background: #f4f4f5;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
  transition-duration: 0.5s
}
.grid-content1 {
  border-radius: 4px;
  min-height: 36px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
  transition-duration: 0.5s
}
.grid-content:hover{
  -webkit-box-shadow: #ccc 10px 0px 10px;
  -moz-box-shadow: #ccc 10px 0px 10px;
  box-shadow: #ccc 10px 10px 10px;
}
.cards{
  width: 95%;
  height: 200px;
  margin-top: 30px;
  border-top: 2px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.demo-type{
  transition-duration: 0.5s
}
.demo-type:hover{
  -webkit-box-shadow: #ccc 10px 10px 10px;
  -moz-box-shadow: #ccc 10px 10px 10px;
  box-shadow: #ccc 10px 10px 10px;
}
</style>