<template>
  <div>
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
          width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="memberName"
          label="患者姓名"
          width="100">
      </el-table-column>
      <el-table-column
          align="center"
          prop="setmealName"
          label="套餐名称"
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="orderdate"
          label="下单时间">
      </el-table-column>
      <el-table-column
          align="center"
          prop="sex"
          label="性别">
      </el-table-column>
      <el-table-column
          align="center"
          width="200"
          label="状态">
        <template slot-scope="scop">
          <el-steps :active="scop.row.active" align-center :finish-status="scop.row.finishStatus">
            <el-step title="已预约" ></el-step>
            <el-step title="体检中" ></el-step>
            <el-step title="已完结" ></el-step>
            <el-step title="取消" ></el-step>
          </el-steps>
        </template>
      </el-table-column>
      <el-table-column label="操作"align="center" width="130">
        <template slot-scope="scope">
          <el-select  v-model="scope.row.value" placeholder="请更新状态" @change="changeStatus(scope.row)">
            <el-option label="体检中" value="1"></el-option>
            <el-option label="已完结" value="2"></el-option>
            <el-option label="取消" value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="上传报告"align="center" width="280">
        <template slot-scope="scop">
          <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              :http-request="submitUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
              multiple="multiple"
              :on-change="submitUpload"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">上传报告</el-button>
            <el-button style="margin-left:10px" size="small" type="success" @click.stop="submitpeople(scop.row)">提交患者</el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import qs from 'qs';
export default{
  data(){
    return{
      tableData:[],
      loading:false,
      value:'',
      fileList: [],
      fileID:'',
    }
  },
  mounted() {
    // DOM 加载完毕后执行代码
    // 可以在这里操作 DOM、发送请求等等
    this.$nextTick(() => {
      // DOM 加载完毕后执行代码
      // 可以在这里操作 DOM、发送请求等等
      window.onload = () => {
        setTimeout(() =>{
          let start = document.getElementsByClassName('el-step__title')
          for (let i=0; i <start.length; i++){
            start[i].style.fontSize= '10px'
          }
        },300)

      }

    });

  },
  methods:{
    //报告上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件`);
    },
    submitUpload(file){
      const formData = new FormData();

      formData.append('file',file.raw)

      this.$axios.post('/tsetmeal/upload',formData,{
        headers: {
          'Content-Type': 'multipart/form-data' // 设置请求头
        }
      }).then(res=>{
        this.fileID = res.data.data
        this.$notify({
          title: '文件上传成功',
          message: res.data.msg,
          type: 'success'
        });
      })
    },
    submitpeople(row){
      const formData = new URLSearchParams();
      formData.append('fileUpload', this.fileID);
      formData.append('orderId', row.id);
      this.$axios.post('/member/fileupload', formData)
          .then(res => {
            this.$notify({
              title: '发送成功',
              message: res.data.msg,
              type: 'success'
            });
            this.fileList=[]
            this.getTable();
          })
    },
    getTable(){
      this.$axios.get('/order/page',{
        params:{
          name:null,
          startTime:null,
          overTime:null,
          page:1,
          pageSize:10,
          status:null,
        }
      }).then(res=>{
        this.tableData=res.data.data.records
        this.tableData.forEach((item,index)=>{
          item.orderdate = this.$formatDate(new Date(item.orderdate),'yyyy-MM-dd')
          if (item.orderstatus==='体检中'){
            item.active=2
            item.finishStatus='success'
            item.value="1"
          }else if (item.orderstatus==='已结束'){
            item.active=3
            item.finishStatus='success'
            item.value="2"
          }else if (item.orderstatus==='已取消'){
            item.active=4
            item.finishStatus='error'
            item.value="0"
          }else{
            item.active=1
            item.finishStatus='success'
            item.value=null
          }
        })
      })
    },
    //更改状态
    changeStatus(row){
      let data = {
        id:row.id,
        status:row.value
      }
      this.$axios.post('/order/status', qs.stringify(data)).then(res=>{
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success'
        });
        this.getTable()
      })
  },
  },
  created() {
    this.getTable()
  }
}

</script>
<style>
.el-step__title{
  font-size: 6px;
}

</style>