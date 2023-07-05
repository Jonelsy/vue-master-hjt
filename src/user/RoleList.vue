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
          label="角色ID"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="username"
          label="用户名"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="telephone"
          label="电话号码">
      </el-table-column>
      <el-table-column
          align="center"
          prop="gender"
          label="性别">
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
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button
                type="primary" plain
                size="small"
                @click="opendialog2(scope.row)">编辑
            </el-button>
            <el-button
                type="warning" plain
                size="small"
                @click="opendialog3(scope.row)">重置密码
            </el-button>
            <el-button
                type="warning" plain
                size="small"
                @click="opendialog4(scope.row)">分配角色
            </el-button>
            <el-button
                size="small"
                plain
                type="danger"
                @click="deleteCheckItems(scope.row.id)">删除
            </el-button>
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
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               label-position="right" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="this.title=='新增用户'">
          <el-input v-model="ruleForm.password" style="width: 300px" type="password"></el-input>
        </el-form-item>
        <el-form-item label="电话号" prop="telephone">
          <el-input type="number" v-model="ruleForm.telephone" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" required>
          <el-col>
            <el-form-item prop="birthday">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="ruleForm.gender" placeholder="请选择性别" style="width: 150px">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="station">
          <el-switch
              v-model=ruleForm.station
              active-text="启用"
              inactive-text="禁用"
              active-value="0"
              inactive-value="1">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="addCheckItems('ruleForm')" v-if="this.title=='新增用户'">新 增</el-button>
    <el-button type="primary" @click="changeCheckItems('ruleForm')" v-if="this.title=='编辑用户'"> 编 辑</el-button>
  </span>
    </el-dialog>

    <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible2"
        width="500px"
        @close="resetForm('ruleForm')"
    >
      <!--内容-->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="right" :inline="true">
        <el-form-item label="选项" prop="ids" >
          <el-select v-model="ruleForm.ids" placeholder="请选择" style="width: 150px">
            <el-option :label="item.name" :value="item.id" v-for="item in tableData2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary" @click="allotCheckItems('ruleForm')">分 配</el-button>
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
import qs from "qs";

export default {
  data() {
    return {
      title: '',
      ids: [],
      userId:'',
      //分页
      page: 1,
      pageSize: 10,
      total: 0,
      name: null,
      birthday: '',
      ruleForm: {
        id:'',
        ids:'',
        birthday: "",
        gender: "",
        password: "",
        remark: "",
        station: 0,
        telephone: "",
        username: "",
      },
      rules: {
        username: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        telephone: [
          {required: true, message: '请输入电话', trigger: 'blur'},
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请填写说明', trigger: 'change'}
        ],
        ids: [
          {required: true, message: '请选择', trigger: 'change'}
        ],

      },
      dialogVisible: false,
      dialogVisible2:false,
      input: '',
      loading: false,
      tableData: [],
      tableData2: []
    }
  },
  methods: {
    //弹出框
    opendialog() {
      this.ruleForm = {};
      this.dialogVisible = true;
      this.title = '新增用户';
    },
    opendialog2(row) {
      this.dialogVisible = true;
      this.title = '编辑用户';
      this.ruleForm.birthday = row.birthday;
      this.ruleForm.gender = row.gender;
      this.ruleForm.remark = row.remark;
      this.ruleForm.station = row.station;
      this.ruleForm.telephone = row.telephone;
      this.ruleForm.username = row.username;
      this.ruleForm.password = row.password;
      this.ruleForm.id = row.id;
    },
    //重置密码
   async opendialog3(row) {
      let ids = row.id
      await this.$axios.get('/user/rePass?id='+ids)
          .then((res)=>{
            this.$notify({
              title: '成功',
              message: '重置密码成功',
              type: 'success'
            });
          })

    },
    //分配角色
    opendialog4(row) {
      this.dialogVisible2 = true;
      this.userId = row.id;
      // console.log(this.ids)
    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //获取全部数据
    async getCheckItems() {
      await this.$axios
          .get("/user/list", {
            params: {
              page: this.page,
              pageSize: this.pageSize,
              name: null,
            }
          })
          .then((res) => {
                this.tableData = res.data.data;
                this.total = res.data.data.total;
                this.tableData.forEach((item, index, array) => {
                  item.birthday = this.$formatDate(new Date(item.birthday), 'yyyy-MM-dd')
                  if (item.gender == 1) {
                    item.gender = '男'
                  } else if (item.gender == 2) {
                    item.gender = '女'
                  }
                })
              }
          )
          .catch(function (error) {
            console.log(error.response);
          })
    },
    //获取分配数据
    async getSecondItems(){
      await this.$axios
          .get("/role/listRole",)
          .then((res)=> {
                this.tableData2 = res.data.data;
              }
          )
          .catch(function (error){
            console.log(error.response);
          })
    },
    //查询项目
    async selectCheckItems() {
      await this.$axios
          .get("/user/list", {
            params: {
              page: 1,
              pageSize: 10,
              name: this.input,
            }
          })
          .then((res) => {
                this.loading = true;
                this.tableData = res.data.data;
                this.total = res.data.data.total;
                this.input = '';
                this.loading = false;
                this.$notify({
                  title: '成功',
                  message: '查询成功',
                  type: 'success'
                });
              }
          )
          .catch(function (error) {
            console.log(error.response);
            this.$notify({
              title: '失败',
              message: '查询失败',
              type: 'warning'
            });
          })
    },
    //增加检查项
    addCheckItems(formName) {
      this.birthday = this.$formatDate(new Date(this.ruleForm.birthday), 'yyyy-MM-dd')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading = true;
          this.$axios
              .post("/user/save", {
                birthday: this.birthday,
                gender: this.ruleForm.gender,
                password: this.ruleForm.password,
                remark: this.ruleForm.remark,
                station: this.ruleForm.station,
                telephone: this.ruleForm.telephone,
                username: this.ruleForm.username,
              })
              .then((res) => {
                this.loading = false;
                this.getCheckItems();
                this.birthday = '',
                    this.$notify({
                      title: '成功',
                      message: '增加成功',
                      type: 'success'
                    });
              })
              .catch(function (error) {
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
    //分配角色
    allotCheckItems(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible2 = false;
          this.loading = true;
          this.$axios
              .get("/user/distributionRoleId?roleId="+this.ruleForm.ids+"&userId="+this.userId)
              .then((res) => {
                this.loading = false;
                this.getCheckItems();
                this.birthday = '',
                    this.$notify({
                      title: '成功',
                      message: '分配成功',
                      type: 'success'
                    });
              })
              .catch(function (error) {
                this.$notify({
                  title: '失败',
                  message: '分配失败',
                  type: 'warning'
                });
              })
        } else {
          this.$notify({
            title: '失败',
            message: '分配失败',
            type: 'warning'
          });
          return false;
        }
      })
    },
    //修改检查项
    async changeCheckItems(formName) {
      this.birthday = this.$formatDate(new Date(this.ruleForm.birthday), 'yyyy-MM-dd')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.loading = true;
          this.$axios
              .post("/user/update", {
                id: this.ruleForm.id,
                birthday: this.birthday,
                gender: this.ruleForm.gender,
                password: this.ruleForm.password,
                remark: this.ruleForm.remark,
                station: this.ruleForm.station,
                telephone: this.ruleForm.telephone,
                username: this.ruleForm.username,
              })
              .then((res) => {
                this.loading = false;
                this.getCheckItems();
                this.$notify({
                  title: '成功',
                  message: '编辑成功',
                  type: 'success'
                });
              })
              .catch(function (error) {
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
      this.birthday='';
    },

    //删除检查项
    async deleteCheckItems(row) {
      this.ids.push(row)
      let {data} = await this.$axios
          .post("/user/deleteByIds",this.ids)
      if (data) {
        this.loading = true;
        await this.getCheckItems();
        this.loading = false;
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        });
      }
      ;
      if (this.tableData.length === 0) {
        if (this.page > 1) {
          this.page = this.page - 1
          await this.getCheckItems()
        } else {
          await this.getCheckItems()
        }
      }
    },


    //分页
    handleCurrentChange(val) {
      this.page = val;
      this.getCheckItems();
    }
  },
  created() {
    this.getCheckItems();
    this.getSecondItems();
  }
}
</script>