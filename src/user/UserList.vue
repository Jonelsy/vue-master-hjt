<template>
  <div>

    <el-input
        style="width: 200px;padding: 10px"
        placeholder="请输入用户名称"
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
          prop="name"
          label="姓名"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="keyword"
          label="人员编码">
      </el-table-column>
      <el-table-column
          align="center"
          prop="description"
          label="说明">
      </el-table-column>
      <el-table-column label="操作"align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button
                type="primary" plain
                size="small"
                @click="opendialog3(scope.row)">分配菜单</el-button>
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
        width="500px"
        @close="resetForm('ruleForm')"
    >

      <!--内容-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="right" :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="自定义编码" prop="code">
          <el-input v-model="ruleForm.code" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="选项" prop="ids" >
          <el-checkbox-group v-model="ids" style="width: 350px">
            <el-checkbox :label="item.id" v-for="item in tableData2" :key="item.id"  name="type">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增检查项'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑检查项'"> 编 辑</el-button>
  </span>
    </el-dialog>
<!--分配菜单提示框-->
    <el-dialog
        title="分配菜单"
        :visible.sync="dialogVisible2"
        width="500px"
        @close="resetForm('ruleForm')"
    >
      <!--内容-->
      <el-form :model="ruleForm2" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="right" :inline="true">
        <el-form-item label="选项" prop="ids" >
          <el-checkbox-group v-model="ids2" style="width: 350px">
            <el-checkbox :label="item.id" v-for="item in tableData3" :key="item.id"  name="type">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="allotCheckItems()">分 配</el-button>
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
    return {
      title:'',
      ids:[],
      ids2:[],
      //分页
      page:1,
      pageSize:10,
      total:0,
      name:null,
      ruleForm: {
        id:'',
        code:'',
        name:'',
        desc:'',
      },
      ruleForm2:{
        id:'',
      },
      rules: {
        name: [
          {required: true, message: '请输入角色姓名', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入角色姓名', trigger: 'blur'},
        ],
        desc:[],

      },
      dialogVisible: false,
      dialogVisible2:false,
      input:'',
      loading: false,
      tableData: [
      ],
      tableData2: [
      ],
      tableData3:[
      ],
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
      this.ruleForm.code=row.keyword;
      this.ruleForm.name=row.name;
      this.ruleForm.desc = row.description
      this.ids=row.permissionIds;
      this.ruleForm.id = row.id;
    },
    //分配角色对应菜单
  async  opendialog3(row){
      this.dialogVisible2=true;
      this.ruleForm2.id = row.id
      await this.$axios.get('/role/MenuIdsByRoleId?roleId='+row.id)
          .then((res)=>{
            this.ids2 = res.data.data;
          })
    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ids = [];
      this.ids2 = [];
      this.dialogVisible = false;
      this.dialogVisible2 = false
    },
    //获取全部数据
    async getCheckItems(){
      await this.$axios
          .get("/role/list",{
            params:{
              page:this.page,
              pageSize:this.pageSize,
              name:null,
            }
          })
          .then((res)=> {
                this.tableData = res.data.data.records;
                this.total = res.data.data.total;
              }
          )
          .catch(function (error){
            console.log(error.response);
          })
    },
    //获取下拉数据
    async getSecondItems(){
      await this.$axios
          .get("/permission/permissionList",)
          .then((res)=> {
                this.tableData2 = res.data.data;
              }
          )
          .catch(function (error){
            console.log(error.response);
          })
    },
    //获取菜单数据
    async getThirdItems(){
      await this.$axios
          .get("/menu/getMenuList",)
          .then((res)=> {
                this.tableData3 = res.data.data;
              }
          )
          .catch(function (error){
            console.log(error.response);
          })
    },
    //查询项目
    async selectCheckItems(){
      await this.$axios
          .get("/role/list",{
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
              .post("/role/save",{
                keyword: this.ruleForm.code,
                rolePermissionIds: this.ids,
                description: this.ruleForm.desc,
                name:this.ruleForm.name,
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
              .post("/role/update",{
                description: this.ruleForm.desc,
                id: this.ruleForm.id,
                keyword: this.ruleForm.code,
                name: this.ruleForm.name,
                rolePermissionIds: this.ids,
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
    //修改角色对应菜单
    async allotCheckItems(){
        this.dialogVisible2=false;
        this.loading=true;
        this.$axios.get('/role/addMenuIdsByRoleId?menuIds='+this.ids2+'&roleId='+this.ruleForm2.id)
            .then((res)=>{
              this.loading=false;
              this.getCheckItems();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
              });
            })
    },
    //删除检查项
    async  deleteCheckItems(row){
      let {data} = await this.$axios
          .delete("/role/delete",{
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
    this.getSecondItems();
    this.getThirdItems();

  }
}
</script>