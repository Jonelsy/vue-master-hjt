<template>
<div >
  <div class="map" id="maps" onload="chart()">

  </div>
  <div style="width: 100%;margin-top: 50px">
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-statistic group-separator="," :precision="2" :value="value2" :title="title"></el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic title="已预约总人数">
            <template slot="formatter"> {{ totalReserved }} </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic group-separator="," :precision="2" decimal-separator="." :value="value1" title="总成交金额">
            <template slot="prefix">
              <i class="el-icon-coin" style="color: red"></i>
            </template>
            <template slot="suffix">
              <i class="el-icon-coin" style="color: blue"></i>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-statistic :value="users" title="用户量">
            <template slot="suffix">
              <span class="like">
                <i class="el-icon-user-solid" style="color:red"></i>
              </span>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "Domd",
  data(){
    return{
      like: true,
      value1: '',
      value2: '',
      title: '总预约人数',
      totalReserved:'',
      users:'',
      datas:[],
      data:[],
      number:[],
      reservations:[],
    }
  },
  methods: {
    //获取折线图数据
    getItem(){
      this.$axios.get('/tordersetting/statisticalList').then(res=>{
        this.datas = []
        this.data = res.data.data
        this.data.slice(-7).forEach((item,index)=>{
          item.orderdate = this.$formatDate(new Date(item.orderdate),'yyyy-MM-dd')
          this.datas.push(item.orderdate)
          this.number.push(item.number)
          this.reservations.push(item.reservations)
          this.chart();
        })
      })
    },
    getformData(){
      this.$axios.get('/tordersetting/total').then(res=>{
        console.log(res)
        this.value2 = res.data.data.totalAvailable
        this.value1 = res.data.data.turnover
        this.totalReserved = res.data.data.totalReserved
        this.users = res.data.data.users
      })
    },
    chart(){
      let myCharts = new Promise(resolve=>{
        resolve()
      })
      myCharts.then(()=>{
        var chartDom = document.getElementById('maps');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: '医疗患者数据检测'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.datas
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: '当日设置预约人数',
              type: 'line',
              data: this.number,
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              markLine: {
                data: [{ type: 'average', name: 'Avg' }]
              }
            },
            {
              name: '当日已预约人数',
              type: 'line',
              data: this.reservations,
              markPoint: {
                data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
              },
              markLine: {
                data: [
                  { type: 'average', name: 'Avg' },
                  [
                    {
                      symbol: 'none',
                      x: '90%',
                      yAxis: 'max'
                    },
                    {
                      symbol: 'circle',
                      label: {
                        position: 'start',
                        formatter: 'Max'
                      },
                      type: 'max',
                      name: '最高点'
                    }
                  ]
                ]
              }
            }
          ]
        };
        option && myChart.setOption(option);
      })
    }
  },
  created() {
    this.getItem()
    this.getformData()
  }
}
</script>

<style scoped>
.map{
  width: 100%;
  height: 40vh;
  margin-top: 50px;
}
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}
</style>