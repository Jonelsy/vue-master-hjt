<template>
  <div>
    <el-input
        style="width: 200px;padding: 10px"
        placeholder="请输入名称"
        v-model="input"
        @keyup.enter.native="selectCheckItems">
    </el-input>
    <el-button icon="el-icon-search" circle @click="selectCheckItems"></el-button>
<!--    <el-button type="primary" icon="el-icon-edit" circle @click="opendialog"></el-button>-->
    <el-table
        :data="tableData"
        :header-cell-style="{'text-align':'center'}"
        stripe
        row-key="id"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        highlight-current-row
        style="width: 100%">
      <el-table-column
          align="center"
          prop="id"
          label="序号"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="name"
          label="名字">
      </el-table-column>
      <el-table-column
          align="center"
          prop="userName"
          label="用户名">
      </el-table-column>
      <el-table-column
          align="center"
          prop="phonenumber"
          label="电话号码"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="idcard"
          label="身份证号">
      </el-table-column>
      <el-table-column
          align="center"
          prop="sex"
          label="性别">
      </el-table-column>
      <el-table-column
          align="center"
          prop="regtime"
          label="创建时间">
      </el-table-column>
      <el-table-column
          align="center"
          prop="email"
          label="邮箱">
      </el-table-column>
      <el-table-column
          align="center"
          prop="birthday"
          label="生日">
      </el-table-column>
      <el-table-column
          align="center"
          prop="remark"
          label="说明">
      </el-table-column>
      <el-table-column label="操作"align="center">
<!--          获取当前行的数据scope-->
        <template slot-scope="scope">
          <el-row>
            <el-button
                type="primary" plain
                size="mini"
                @click="opendialog2(scope.row)">编辑</el-button>
            <el-button
                size="mini"
                plain
                type="danger"
                @click="deleteCheckItems(scope.row)">删除</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--提示框+loading-->
    <el-dialog
        :title=title
        :visible.sync="dialogVisible"
        width="600px"
        @close="resetForm('ruleForm')">
      <!--弹框内容-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" label-position="right" >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="this.title=='新增患者'">
          <el-input v-model="ruleForm.password" style="width: 300px" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电话号" prop="phonenumber">
          <el-input v-model="ruleForm.phonenumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" required>
          <el-col :span="11">
            <el-form-item prop="birthday">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" style="width: 300px" type="email"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard">
          <el-input v-model="ruleForm.idcard" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="ruleForm.remark" style="width: 300px" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增患者'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑患者'"> 编 辑</el-button>
  </span>

    </el-dialog>
    <!--    分页-->
    <div class="block">
      <el-pagination
          style="margin-top: 10px"
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          hide-on-single-page
          class="pagination"
          background
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<style media="screen">
</style>
<script>
export default {
  data() {
    return {
      //获取当页数据存放位置
      tableData:[],
      //弹出框标题
      title:'',
      //弹出框判断
      dialogVisible: false,
      //分页
      page:1,
      pageSize:10,
      total:10,
      //弹出框数据存放位置
      ruleForm: {
        id:'',
        birthday: "",
        email: "",
        idcard: "",
        name: "",
        password: "",
        phonenumber: "",
        remark: "",
        sex: "",
      },
      //校验规则
      rules: {
       name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 11, max: 11, message: '非法电话号', trigger: 'blur' }
        ],
        idcard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '非法身份证', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur',type: 'email' },
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        sex:[
          {required: true,message: '请选择性别',trigger: 'blur'},
        ],
        state:[
          {required: true,message: '请选择状态',trigger: 'blur'},
        ],
      },
      //搜索框数据
      input:'',
      //加载中判断
      loading: false,
    }
  },
  methods:{
    //增加弹出框
    opendialog(){
      this.ruleForm= {};//清空原本数据
      this.dialogVisible=true;
      this.title = '新增患者';
    },
    //编辑弹出框
    opendialog2(row){
      this.dialogVisible=true;
      this.title = '编辑患者';
      this.ruleForm.birthday = new Date(row.birthday);
      this.ruleForm.email = row.email;
      this.ruleForm.idcard = row.idcard;
      this.ruleForm.name = row.name;
      this.ruleForm.password = row.password;
      this.ruleForm.phonenumber = row.phonenumber;
      this.ruleForm.remark = row.remark;
      this.ruleForm.sex = row.sex;
      this.ruleForm.id = row.id;
    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //查询项目
    async selectCheckItems(){
      await this.$axios
          .get("/member/page",{
            params:{
              page:1,
              pageSize:10,
              name:this.input,
            }
          })
          .then((res)=> {
                this.loading=true;
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
                this.input = '';
                this.loading=false;
                this.$notify({
                  title: '成功',
                  message: '查询成功',
                  type: 'success'
                });
              }
          )
          .catch(function (error){
            console.log(error.response);
            this.$notify({
              title: '失败',
              message: '查询失败',
              type: 'warning'
            });
          })
    },
    //获取全部
    async getCheckItems(){
      await this.$axios
          .get("/member/page",{
            params:{
              page:this.page,
              pageSize:this.pageSize,
              name:null,
            }
          })
          .then((res)=> {
            this.tableData = res.data.data.records;//接收
            //循环替换
            this.tableData.forEach((item,index,array)=>{
             item.birthday=this.$formatDate(new Date(item.birthday), 'yyyy-MM-dd');//时间格式替换
             item.regtime=this.$formatDate(new Date(item.regtime), 'yyyy-MM-dd');
              if (item.sex==1){
                item.sex='女';
              }else{
                item.sex='男';
              }
            });
            this.total = res.data.data.total;
          })
          .catch(function (error){
            console.log(error);
          })
    },
    //获取第二数据
    // async getSecondItems(){
    //   await this.$axios
    //       .get("/menu/list")
    //       .then((res)=> {
    //             this.tableData2 = res.data.data;
    //           }
    //       )
    //       .catch(function (error){
    //         console.log(error);
    //       })
    // },
    //增加
    async addCheckItems(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading=true;
          this.$axios
              .post('/member/save',{
                birthday: this.ruleForm.birthday,
                email: this.ruleForm.email,
                idcard: this.ruleForm.idcard,
                name: this.ruleForm.name,
                password:this.ruleForm.password,
                phonenumber: this.ruleForm.phonenumber,
                remark: this.ruleForm.remark,
                sex: this.ruleForm.sex,
              })
              .then((res)=>{
                this.$notify({
                  title: '成功',
                  message: '增加成功',
                  type: 'success'
                });
                this.loading=false;
                this.getCheckItems()
              })
              .catch((error)=>{
                this.$notify({
                  title: '失败',
                  message: '增加失败',
                  type: 'danger'
                });
              })
        }
    })
    },
    //修改检查项
    async changeCheckItems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading = true;
          this.$axios.post('/member/update',{
            birthday: this.$formatDate(new Date(this.ruleForm.birthday ), 'yyyy-MM-dd'),
            email: this.ruleForm.email,
            id: this.ruleForm.id,
            idcard: this.ruleForm.idcard,
            name: this.ruleForm.name,
            phonenumber: this.ruleForm.phonenumber,
            remark: this.ruleForm.remark,
            sex: this.ruleForm.sex,
          })
              .then((res)=>{
                this.loading = false;
                this.getCheckItems();
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                });
              })
              .catch((error)=>{
                this.$notify({
                  title: '失败',
                  message: '修改失败',
                  type: 'danger'
                });
              })
        }
      })
    },
    //删除检查项
    async  deleteCheckItems(row){
      await this.$axios
          .delete("/member/delete", {
            params: {	// 请求参数拼接在url上
              ids: row.id,
            }
          })
          .then((res)=>{
            this.loading=true;
            this.getCheckItems();
            this.loading=false;
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
          })
          .catch((error)=>{
            this.loading=true;
           this.getCheckItems();
            this.loading=false;
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'warning'
            });
          })
      //自动调整分页
      if(this.tableData.length===0){
        if (this.page > 1){
          this.page = this.page - 1
          await this.getCheckItems()
        }else {
          await this.getCheckItems()
        }
      }
    },
    //分页
    handleCurrentChange(val){
      this.page = val;
      this.getCheckItems();
    },
  },
  created() {
    this.getCheckItems();
    // this.getSecondItems();
  }
}
</script>