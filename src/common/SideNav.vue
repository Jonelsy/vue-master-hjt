<template>
  <div>

    <el-menu default-active="/Domd" class="el-menu-vertical-demo" router
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
<!--    <el-submenu index="0">-->
<!--      <template slot="title"><i class="el-icon-message"></i>工作台</template>-->
<!--      <el-menu-item-group>-->
<!--        <template slot="title">分组一</template>-->
<!--        <el-menu-item index="/index/CheckItems">测试管理</el-menu-item>-->
<!--        <el-menu-item index="/index/userGroup">用户分群管理</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--      <el-menu-item-group title="分组2">-->
<!--        <el-menu-item index="/index/userList">用户管理</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
      <template v-for="item in leftdata">
      <el-submenu :index="item.id":key="item.id"  >
        <template slot="title">{{item.name}}</template>
        <el-menu-item-group v-for="item2 in item.children">
          <el-menu-item :index="item2.linkurl" :key="item2.id" v-if="">{{item2.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      </template>
<!--      <el-submenu index="1">-->
<!--        <template slot="title"><i class="el-icon-message"></i>预约管理</template>-->
<!--        <el-menu-item-group>-->
<!--          <el-menu-item index="/index/List">预约列表</el-menu-item>-->
<!--          <el-menu-item index="/index/Setup">预约设置</el-menu-item>-->
<!--          <el-menu-item index="/index/Package">套餐管理</el-menu-item>-->
<!--          <el-menu-item index="/index/Inspection">检查组管理</el-menu-item>-->
<!--          <el-menu-item index="/index/CheckItems">检查项管理</el-menu-item>-->
<!--        </el-menu-item-group>-->
<!--      </el-submenu>-->

  </el-menu>

  </div>
</template>
<script>
export default {

  data() {
    //接收的左侧列表数据
    return {
      pathName: this.$route.name,
      leftdata: [],
      newdata: [],
      seconddata: [],
      nextLoading: false,
    }
  },
  methods: {
   async getItem(){
     await this.$axios
          .get("/menu/nav",)
          .then((res)=> {
                this.leftdata = res.data.data.nav;
                for (let i = 0; i < this.leftdata.length; ++i) {
                  this.leftdata[i].id = String(this.leftdata[i].id);
                }
              }
          )
          .catch(function (error){
            console.log(error);
          })
    }
  },
  created() {
this.getItem()


    },


}
</script>
<style>

</style>