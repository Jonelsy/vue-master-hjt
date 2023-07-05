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
          label="检查组编码"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="name"
          label="检查组名称">
      </el-table-column>
      <el-table-column
          align="center"
          prop="sex"
          label="适用性别">
      </el-table-column>
      <el-table-column
          align="center"
          prop="helpcode"
          label="助记码">
      </el-table-column>
      <el-table-column
          align="center"
          prop="attention"
          label="说明">
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
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="right" :inline="true">
            <el-form-item label="检查组编码" prop="code">
              <el-input v-model="ruleForm.code" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="检查组名称" prop="name">
              <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="适用性别" prop="sex">
              <el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 150px">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
                <el-option label="不限" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="助记码" prop="helpcode">
              <el-input v-model="ruleForm.helpcode" style="width: 185px"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="desc">
              <el-input type="textarea" v-model="ruleForm.desc"style="width: 585px"></el-input>
            </el-form-item>
            <el-form-item label="注意事项" prop="desc2">
              <el-input type="textarea" v-model="ruleForm.desc2" style="width: 585px"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="检查项信息" name="second">
          <el-table
              ref="multipleTable"
              :data="tableData2"
              tooltip-effect="dark"
              height="400"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="code"
                label="项目编码"
                width="120">
            </el-table-column>
            <el-table-column
                prop="name"
                label="项目名称"
                width="120">
            </el-table-column>
            <el-table-column
                prop=""
                label="项目说明"
                show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增检查组'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑检查组'"> 编 辑</el-button>
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
      checkitemIds:[],
      //检查组中的检查项
      tableData2:[],
      //标签复选框
      multipleSelection:[],
      multipleSelection2:[],
      //标签
      activeName: 'first',
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
        helpcode:'',
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
    //复选框
    handleSelectionChange(val) {
      this.multipleSelection2=[]
      this.multipleSelection=[]
      val.forEach((value)=>{
       this.multipleSelection.push(value.id)
        this.multipleSelection2 = Array.from(new Set(this.multipleSelection))
      })
    },
    //更改标签
    handleClick() {
        let list = [];
        this.tableData2.forEach((item)=>{
          this.checkitemIds.forEach((val)=>{
            if (val===item.id){
              list.push(item)
            }
          })
        });
        if (list){
          list.forEach((row)=>{
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
    },
    //弹出框
    opendialog(){
      this.ruleForm= {};
      this.dialogVisible=true;
      this.title = '新增检查组';
    },
    opendialog2(row){

      this.dialogVisible=true;
      this.title = '编辑检查组';
      this.ruleForm.id=row.id;
      this.ruleForm.code=row.code;
      this.ruleForm.name=row.name;
      this.ruleForm.sex=row.sex;
      this.ruleForm.helpcode = row.helpcode;
      this.ruleForm.desc=row.remark;
      this.ruleForm.desc2=row.attention;
      this.checkitemIds = row.checkitemIds;
      this.handleClick()
    },
    //校验规则
    resetForm(formName) {
      this.$refs.multipleTable.clearSelection();
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //获取全部数据
    async getCheckItems(){
      await this.$axios
          .get("/tcheckgroup/page",{
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
            console.log(error);
          })
    },
    //获取检查组中的检查项数据
    async getCheckItems2(){
      await this.$axios
          .get("/tcheckitem/list",)
          .then((res)=> {
                this.tableData2 = res.data.data;
                this.tableData2.forEach(function (value, index, array){
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
            console.log(error);
          })
    },
    //查询项目
    async selectCheckItems(){
      await this.$axios
          .get("/tcheckgroup/page",{
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
              .post("/tcheckgroup/save",{
                attention: this.ruleForm.desc2,
                code: this.ruleForm.code,
                helpcode:this.ruleForm.helpcode,
                id: 0,
                name: this.ruleForm.name,
                remark: this.ruleForm.desc,
                sex: this.ruleForm.sex,
                tcheckitemIds : this.multipleSelection2,
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
        console.log(this.multipleSelection2)
        if (valid) {
          this.dialogVisible = false;
          this.loading=true;
          this.$axios
              .post("/tcheckgroup/update",{
                attention: this.ruleForm.desc2,
                code: this.ruleForm.code,
                id: this.ruleForm.id,
                name: this.ruleForm.name,
                remark: this.ruleForm.desc,
                sex: this.ruleForm.sex,
                helpcpde:this.ruleForm.helpcode,
                tcheckitemIds:this.multipleSelection2,
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
          .delete("/tcheckgroup",{
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
    this.getCheckItems2()
  }
}
</script>