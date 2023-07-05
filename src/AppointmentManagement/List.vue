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
          width="180">
      </el-table-column>
      <el-table-column
          align="center"
          prop="memberName"
          label="患者姓名"
          width="180">
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
          prop="attention"
          label="下单套餐">
      </el-table-column>
      <el-table-column label="操作"align="center">


      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default{
  data(){
    return{
      tableData:[],
      loading:false,
    }
  },
  methods:{
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
        console.log(res)
        this.tableData=res.data.data.records
      })
    }
  },
  created() {
    this.getTable()
  }
}

</script>
<style media="screen">


</style>