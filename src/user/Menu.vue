<template>
  <div>
    <el-input
        style="width: 200px;padding: 10px"
        placeholder="请输入菜单名称"
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
          prop="keyword"
          label="权限编码"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="name"
          label="菜单名称">
      </el-table-column>
      <el-table-column
          align="center"
          prop="icon"
          label="图标"
     >
       <template slot-scope="row">
         <i class="row.icon"></i>
       </template>
      </el-table-column>
<!--      <el-table-column-->
<!--          align="center"-->
<!--          prop="sex"-->
<!--          label="类别">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          align="center"-->
<!--          prop="linkurl"-->
<!--          label="菜单URL">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          align="center"-->
<!--          prop=""-->
<!--          label="菜单组件">-->
<!--      </el-table-column>-->
      <el-table-column
          align="center"
          prop="level"
          label="排序号">
      </el-table-column>
      <el-table-column
          align="center"
          prop=""
          label="状态">
      </el-table-column>
      <el-table-column label="操作"align="center">
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
        @close="resetForm('ruleForm')"
    >
      <!--内容-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" label-position="right" >
            <el-form-item label="类型" prop="type" v-if="this.title=='新增菜单'">
              <el-radio-group v-model="ruleForm.type">
                <el-radio label="目录" value="1" @click.native="ruleForm.orlook=1"></el-radio>
                <el-radio label="菜单" value="2" @click.native="ruleForm.orlook=2"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择上级菜单" prop="menu" v-if="ruleForm.orlook===2">
              <el-select v-model="ruleForm.menu" placeholder="请选择" style="width: 150px">
                <el-option :label="item.name" :value="item.id" v-for="item in tableData2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="ruleForm.menuName" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="权限编码" prop="code" v-if="ruleForm.orlook===1">
              <el-input v-model="ruleForm.code" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-select v-model="ruleForm.icon" placeholder="请选择" style="width: 150px">
                <el-option :label="item.icon" :value="item.icon" v-for="item in tableData2"></el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="菜单url" prop="url">-->
<!--              <el-input v-model="ruleForm.url"style="width: 300px"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="菜单组件" prop="component">-->
<!--              <el-input v-model="ruleForm.component" style="width: 300px"></el-input>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="状态" prop="state">-->
<!--              <el-radio-group v-model="ruleForm.state">-->
<!--                <el-radio label="启用"></el-radio>-->
<!--                <el-radio label="禁用"></el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="级别" prop="level">-->
<!--              <el-input-number v-model="num" :min="1" :max="9"></el-input-number>-->
<!--            </el-form-item>-->
          </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增菜单'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑菜单'"> 编 辑</el-button>
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

      //图片地址

      tableData2:[],
      //标签复选框
      num:'',
      title:'',
      //分页
      page:1,
      pageSize:10,
      total:0,
      name:null,
      ruleForm: {
        path:'',
        orlook:'',
        type:'',
        id:'',
        code:'',
        menuName:'',
        menu:'',
        icon:'',
        url:'',
        component:'',
        state:'',
      },
      rules: {
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ],
        menu: [
          { required: true, message: '请选择菜单', trigger: 'blur' }
        ],
        type:[
          {required: true,message: '请选择类型',trigger: 'blur'},
        ],
        state:[
          {required: true,message: '请选择状态',trigger: 'blur'},
        ],
      },
      dialogVisible: false,
      input:'',
      loading: false,
      tableData: [],
    }
  },
  methods:{
    //大图
    bigImg(url) {
      this.srcList[0] = url;
    },
    //弹出框
    opendialog(){
      this.getSecondItems();
      this.ruleForm= {};
      this.dialogVisible=true;
      this.title = '新增菜单';
    },
    opendialog2(row){
      this.getSecondItems();
      this.dialogVisible=true;
      this.title = '编辑菜单';
      if (row.level===1){
        this.ruleForm.id = row.id;
        this.ruleForm.orlook=1;
        this.ruleForm.code=row.keyword;
        this.ruleForm.menuName=row.name;
        this.ruleForm.icon=row.icon;
        this.ruleForm.path = row.path;
      }else{
        console.log(row)
        this.ruleForm.orlook=2;
        this.ruleForm.menuName=row.name;
        this.ruleForm.icon=row.icon;
        this.ruleForm.menu = row.parentmenuid;
        this.ruleForm.id = row.id;
        this.ruleForm.icon=row.icon;
        this.ruleForm.path = row.path;
      }

    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //查询项目
    async selectCheckItems(){
      await this.$axios
          .get("/menu/page",{
            params:{
              page:1,
              pageSize:10,
              name:this.input,
            }
          })
          .then((res)=> {
                this.loading=true;
                this.tableData = res.data.data;
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
    //获取全部数据
    async getCheckItems(){
      await this.$axios
          .get("/menu/page",{
            params:{
              page:this.page,
              pageSize:this.pageSize,
              name:null,
            }
          })
          .then((res)=> {
                this.tableData = res.data.data;
              }
          )
          .catch(function (error){
            console.log(error);
          })
    },
    //获取下拉框
    async getSecondItems(){
      await this.$axios
          .get("/menu/list")
          .then((res)=> {
            this.tableData2 = res.data.data;
              }
          )
          .catch(function (error){
            console.log(error);
          })
    },
    //增加检查项
    addCheckItems(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading=true;
          if (this.ruleForm.orlook===1){
            this.$axios
                .post("/menu/save",{
                  description: "",
                  icon: this.ruleForm.icon,
                  id: this.ruleForm.id,
                  keyword: this.ruleForm.code,
                  level: 1,
                  linkurl: "",
                  name: this.ruleForm.menuName,
                  parentmenuid: this.ruleForm.menu,
                  path: "",
                  priority: 0
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
          }else{
            this.tableData2.forEach((item,index,array)=>{
              if (array[index].id===this.ruleForm.menu){
                this.ruleForm.path = item.path;
              }
            })
            this.$axios
                .post("/menu/save",{
                  description: "",
                  icon: this.ruleForm.icon,
                  id: 0,
                  keyword: "",
                  level: 2,
                  linkurl: "",
                  name: this.ruleForm.menuName,
                  parentmenuid: this.ruleForm.menu,
                  path: this.ruleForm.path,
                  priority: 0
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
          }


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
          if (this.ruleForm.orlook===1){
            this.$axios
                .post("/menu/update",{
                  description: "",
                  icon: this.ruleForm.icon,
                  id: this.ruleForm.id,
                  keyword: this.ruleForm.code,
                  level: 1,
                  linkurl: "",
                  name: this.ruleForm.menuName,
                  parentmenuid: 0,
                  path: this.ruleForm.path,
                  priority: 0
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
          }else{
            this.$axios
                .post("/menu/update",{
                  description: "",
                  icon: this.ruleForm.icon,
                  id: this.ruleForm.id,
                  keyword: "",
                  level: 2,
                  linkurl: "",
                  name: this.ruleForm.menuName,
                  parentmenuid: this.ruleForm.menu,
                  path: this.ruleForm.path,
                  priority: 0
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
          }
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
          .delete("/menu/delete",{
            params:{
              id:row.id,
            }
          })
      if(data.code==200){
        this.loading=true;
        await this.getCheckItems();
        this.loading=false;
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
      }else{
        this.loading=true;
        await this.getCheckItems();
        this.loading=false;
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'warning'
        });
      }
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
    this.getSecondItems();

  }
}
</script>