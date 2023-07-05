<template>
  <div class="con-main">

    <div class="con-list">
      <el-row>
        <el-button type="primary" style="margin-left: 20px;margin-top: 10px"@click="downloadFile">模板下载</el-button>
        <el-button type="primary" style="margin-left: 20px;margin-top: 10px"@click="updataFile">模板上传</el-button>
      </el-row>
      <!-- 日历 -->
      <el-calendar v-model="calendarDate">
        <!-- 插槽 -->
        <template slot="dateCell" slot-scope="{date, data}" >
          <!--  date   单元格代表的日期  data { type, isSelected, day}，type 表示该日期的所属月份，可选值有 prev-month，current-month，next-month；isSelected 标明该日期是否被选中；day 是格式化的日期，格式为 yyyy-MM-dd-->
          <div @click="calendarOnClick(data)" class="weiyuansu">
<!--            &lt;!&ndash; 这里加了周六周天的判断 &ndash;&gt;-->
            <div :class="(date.getDay()==6 || date.getDay()==0)?'weeked' :'notweeked'" >{{data.day}}</div>
<!--            &lt;!&ndash; 数组循环 &ndash;&gt;-->
            <div class="cell" v-for="(item) in tableData" >
              <!-- 加数据 -->
              <div v-if="data.day === item.orderdate">
                  <div class="info">
                    <i class="el-icon-time"></i>
                    <b>{{item.number}}</b>
                  </div>
                <div class="info">
                  <i class="el-icon-time"></i>
                  <b>{{item.reservations}}</b>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
    <el-dialog
        :title=title
        :visible.sync="dialogVisible"
        width="700px"
        @close="resetForm('ruleForm')"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="确定当天预约人数" prop="number">
          <el-input v-model="ruleForm.number" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
        :title=title2
        :visible.sync="dialogVisible2"
        width="400px"
        @close="resetForm('ruleForm')"
    >
      <el-upload
          class="upload-demo"
          ref="upload"
          accept=".xlsx, .xlsm, .xls"
      :auto-upload="false"
      action="#"
      :limit="1"
      :file-list="fileList"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
          drag
          multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleImportExcel" :disabled="uploading"
        >确定导入</el-button>
        <el-button @click="cancle">取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fileList:[],  //文件列表
      file:{},
      uploading:true, //默认置灰确定导入按钮
      ruleForm: {
        number:'',
      },
      rules: {
        number: [
          { required: true, message: '请输入人数', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
      },
      orderdata:'',
      title:'设置预约人数',
      title2:'模板上传',
      dialogVisible:false,
      dialogVisible2:false,
      calendarDate: new Date(),
      calendarData: [0],
      tableData: [
      ],
    }
  },
  created() {
    this.getTimeData();
  },
  mounted() {
    //获取上个月今天下个月
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(1)"
      );
      prevBtn.addEventListener("click", () => {
        this.judgeDate(this.calendarDate);
      });
      let dayBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(2)"
      );
      dayBtn.addEventListener("click", () => {
        this.judgeDate(this.calendarDate);
      });
      let nextBtn = document.querySelector(
          ".el-calendar__button-group .el-button-group>button:nth-child(3)"
      );
      nextBtn.addEventListener("click", () => {
        this.judgeDate(this.calendarDate);
      });
    });
  },
  methods: {
    //文件状态改变触发
    handleChange(file) {     //(file,fileList)参数
      this.uploading = false;
      this.file = file;
    },
//文件超出个数限制
    handleExceed() {
      this.$message.warning("仅允许上传一个文件！");
    },
//移除文件
    handleRemove() {
      this.uploading = true;
    },
//取消
    cancle() {
      this.file = {};
      this.fileList = [];
      this.dialogVisible2 = false;
      this.uploading = true;
    },
//导入excel
   async handleImportExcel(){
      if (!this.file.size) {
        this.$message.warning("请选择上传的文件");
        return;
      }
      this.uploading = true;
      let excelFiles = new FormData();
      excelFiles.append('excelFile',this.file.raw);
      await this.$axios.post('/tordersetting/upload',
          excelFiles,
          {'Content-Type': 'multipart/form-data'}
      )
          .then(res=>{  //调用接口
        this.uploading = false;
        this.$message.success("上传成功");
        this.getTimeData();
        this.cancle()
      }).catch(err=>{
        this.$message.error(err)
      })
    },
    //提交每天预约人数
   async submitForm(formName) {
    await  this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/tordersetting/editNumberByDate',{
            number: this.ruleForm.number,
            orderdate: this.orderdata,
          }).then((res)=>{

            this.getTimeData();
            this.dialogVisible = false;
          })
        } else {
          return false;
        }
      });
    },
    //校验规则
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
    },
    //点击日历块事件
    calendarOnClick(e){
      let newdata = e.day.slice(0, e.day.length - 3);
      this.getTimeData(newdata);
      this.orderdata = e.day;
      this.dialogVisible = true;
    },
// 判断是否是上个月今天还是下个月
    judgeDate(dateVal) {
      let y = dateVal.getFullYear();
          let m = dateVal.getMonth() + 1;
          m = m < 10 ? ('0' + m) : m;
          let d = dateVal.getDate();
          d = d < 10 ? ('0' + d) : d;
          let nowdata= y + '-' + m + '-' + d ;
          let nowdata2 = y + '-' + m
      this.getTimeData(nowdata2);
    },
    //下载模板
    downloadFile(){
      let a = document.createElement("a"); //创建一个<a></a>标签
      a.href = "/file/ordersetting_template.xlsx"; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
      a.download = "预约表格模板.xlsx"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
      a.style.display = "none"; // 障眼法藏起来a标签
      document.body.appendChild(a); // 将a标签追加到文档对象中
      a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove(); // 一次性的，用完就删除a标签
    },
    //上传模板
    updataFile(){
     this.dialogVisible2=true;
    },
    //获取本机时间+获取当月预约人数
    async getTimeData(chuandata){
      if (chuandata){
        await this.$axios.get('/tordersetting/list',{
          params:{
            date:chuandata,
          }
        }).then(res=>{
          this.tableData = res.data.data;
          this.tableData.forEach((item)=>{
            if (item.reservations===null){
              item.reservations=0;
            }
          })
        })
      }else{
        //获取当前时间并打印
        var _this = this;
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth()+1;
        if (mm<10){
          mm='0'+mm;
        }
        _this.gettime = yy+'-'+mm;
        await this.$axios.get('/tordersetting/list',{
          params:{
            date:_this.gettime,
          }
        }).then(res=>{
          this.tableData = res.data.data;
          this.tableData.forEach((item)=>{
            if (item.reservations===null){
              item.reservations=0;
            }
          })
        })
      }
    },

  },
  // watch:{
  //   //增加预设人数
  //   calendarDate(val) {
  //     //获得现在时间
  //     let ntime = new Date()
  //     let a = ntime.getFullYear();
  //     let b = ntime.getMonth() + 1;
  //     b = b < 10 ? ('0' + b) : b;
  //     let c = ntime.getDate();
  //     c = c < 10 ? ('0' + c) : c;
  //     let todydata= a + '-' + b + '-' + c ;
  //     //中国标准时间转换为标准时间
  //     let y = val.getFullYear();
  //     let m = val.getMonth() + 1;
  //     m = m < 10 ? ('0' + m) : m;
  //     let d = val.getDate();
  //     d = d < 10 ? ('0' + d) : d;
  //     let nowdata= y + '-' + m + '-' + d ;
  //     let chuandata = y + '-' + m;
  //     if (a==y&&b==m&c==d){
  //       console.log("点击了本天"+nowdata);
  //       this.getTimeData(chuandata);
  //     }else {
  //       console.log("点击了上下个月");
  //       this.getTimeData(chuandata);
  //     }
  //
  //   },
  // }
}
</script>

<style scoped>
.weiyuansu{
  position: relative;
}
.weiyuansu::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;

}

div ::v-deep th.gutter {
  display: initial;
}
div ::v-deep .el-calendar-day{
  min-height: 110px;
  height: inherit !important;
  position: relative;
  z-index: inherit;
}
.notweeked{
  padding: 5px;
  text-align: center;
  background-color: #f1f6fb;
  color: #354158;
}
.weeked{
  padding: 5px;
  text-align: center;
  background-color: rgba(255,0,0,.1);
}
</style>