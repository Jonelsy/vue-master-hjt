<template>
  <div>

    <el-input
        style="width: 200px;padding: 10px"
        placeholder="请输入项目名称"
        v-model="input"
        @keyup.enter.native="selectCheckItems"
    >

    </el-input>
    <el-button icon="el-icon-search" circle @click="selectCheckItems"></el-button>
    <el-button type="primary" icon="el-icon-edit" circle @click="opendialog"></el-button>
    <el-table
        :data="tableData"
        :header-cell-style="{'text-align':'center'}"
        stripe
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
          prop="code"
          label="项目编码"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="name"
          label="项目名称">
      </el-table-column>
      <el-table-column
          align="center"
          prop="sex"
          label="适用性别">
      </el-table-column>
      <el-table-column
          align="center"
          prop="age"
          label="适用年龄">
      </el-table-column>
      <el-table-column
          align="center"
          prop="attention"
          label="项目说明">
      </el-table-column>
      <el-table-column label="操作"align="center">
        <template slot-scope="scope">
          <el-row>
          <el-button
              type="primary" plain
              size="small"
              @click="opendialog2(scope.row)">编辑</el-button>
          <el-button
              size="small"
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
        width="1000px"
        @close="resetForm('ruleForm')"
        >

<!--内容-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="right" :inline="true">
        <el-form-item label="项目编码" prop="code">
          <el-input v-model="ruleForm.code" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 150px">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
            <el-option label="不限" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用年龄" prop="age">
          <el-input v-model="ruleForm.age" style="width: 185px"></el-input>
        </el-form-item>
          <el-form-item label="类型" prop="leixing">
          <el-select v-model="ruleForm.leixing" placeholder="请选择" style="width: 150px">
            <el-option label="检查" value="1"></el-option>
            <el-option label="检验" value="2"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="money">
            <el-input v-model="ruleForm.money" style="width: 185px"></el-input>
          </el-form-item>
          <el-form-item label="项目说明" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"style="width: 585px"></el-input>
          </el-form-item>
          <el-form-item label="注意事项" prop="desc2">
            <el-input type="textarea" v-model="ruleForm.desc2" style="width: 585px"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增检查项'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑检查项'"> 编 辑</el-button>
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

<!--提示栏-->

  </div>
</template>

<style media="screen">


</style>
<script>
export default {
  data() {
    //项目编码自定义校验
    var checkJobNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('编码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value.length === 4) {
            callback()
          } else {
            callback(new Error('请输入4位纯数字'))
          }
        }
      }, 100)
    }
    return {
      title:'',
      //分页
      page:1,
      pageSize:10,
      total:0,
      name:null,
      ruleForm: {
        id:'',
        code:'',
        name:'',
        sex:'',
        age:'',
        leixing:'',
        money:'',
        desc:'',
        desc2:'',
      },
      ruleForm2:{
        id:'',
        name:'',
        sex:'',
        age:'',
        leixing:'',
        money:'',
        desc:'',
        desc2:'',
      },
      rules: {
        code:[
          {required: true,validator: checkJobNumber,trigger: 'blur',},
        ],
        name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        leixing: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        age:[
            {required: true,message: '请填写年龄',trigger: 'blur'},
          {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'}
        ],
        money:[
          {required: true,message: '请填写金额',trigger: 'blur'},
        ],
        desc:[],
        desc2:[],
      },
      dialogVisible: false,
      input:'',
      loading: false,
      tableData: [
      ]
    }
  },
  methods:{
    //弹出框
    opendialog(){
      this.ruleForm= {};
      this.dialogVisible=true;
      this.title = '新增检查项';
    },
    opendialog2(row){
      this.dialogVisible=true;
      this.title = '编辑检查项';
      this.ruleForm.id=row.id;
      this.ruleForm.code=row.code;
      this.ruleForm.name=row.name;
      this.ruleForm.sex=row.sex;
      this.ruleForm.age=row.age;
      this.ruleForm.leixing=row.type;
      this.ruleForm.money=row.price;
      this.ruleForm.desc=row.remark;
      this.ruleForm.desc2=row.attention;
    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //获取全部数据
    async getCheckItems(){
      await this.$axios
          .get("/tcheckitem/page",{
            params:{
              page:this.page,
              pageSize:this.pageSize,
              name:null,
            }
          })
          .then((res)=> {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
            this.tableData.forEach(function (value, index, array){
              if (value.sex==0){
                value.sex='不限';
              }else if (value.sex==1){
                value.sex='男';
              }else if(value.sex==2){
                value.sex='女';
              }
            })
              }
          )
          .catch(function (error){
            console.log(error.response);
          })
    },
    //查询项目
    async selectCheckItems(){
      await this.$axios
          .get("/tcheckitem/page",{
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
    //增加检查项
    addCheckItems(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading=true;
           this.$axios
              .post("/tcheckitem/save",{
                age: this.ruleForm.age,
                attention: this.ruleForm.desc2,
                code: this.ruleForm.code,
                id: this.ruleForm.id,
                name: this.ruleForm.name,
                price: this.ruleForm.money,
                remark: this.ruleForm.desc,
                sex: this.ruleForm.sex,
                type: this.ruleForm.leixing,
              })
               .then((res)=>{
                 this.loading=false;
                 this.getCheckItems();
                 this.$notify({
                   title: '成功',
                   message: '增加成功',
                   type: 'success'
                 });
               })
               .catch(function (error){
                 this.$notify({
                   title: '失败',
                   message: '增加失败',
                   type: 'warning'
                 });
               })
        } else {
          this.$notify({
            title: '失败',
            message: '增加失败',
            type: 'warning'
          });
          return false;
        }
      })
    },
    //修改检查项
    async changeCheckItems(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading=true;
          this.$axios
              .post("/tcheckitem/update",{
                age: this.ruleForm.age,
                attention: this.ruleForm.desc2,
                code: this.ruleForm.code,
                id: this.ruleForm.id,
                name: this.ruleForm.name,
                price: this.ruleForm.leixing,
                remark: this.ruleForm.desc,
                sex: this.ruleForm.sex,
                type: this.ruleForm.leixing,
              })
              .then((res)=>{
                this.loading=false;
                this.getCheckItems();
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
                  type: 'success'
                });
              })
              .catch(function (error){
                this.$notify({
                  title: '失败',
                  message: '编辑失败',
                  type: 'warning'
                });
              })
        } else {
          this.$notify({
            title: '失败',
            message: '增加失败',
            type: 'warning'
          });
          return false;
        }
      })
    },
    //删除检查项
    async  deleteCheckItems(row){
     let {data} = await this.$axios
            .delete("/tcheckitem/delete",{
              params:{
                id:row.id,
              }
            })
         if(data){
           this.loading=true;
           await this.getCheckItems();
           this.loading=false;
           this.$notify({
             title: '成功',
             message: '删除成功',
             type: 'success'
           });
         };
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
}
  },
  created() {
    this.getCheckItems();
  }
}
</script>