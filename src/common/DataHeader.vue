<template>
<div class="header-wraper">
    <el-menu  default-active="1" class="el-menu-demo" mode="horizontal" >
        <li class="title">
            <i class="el-icon-menu"></i>
            <span style="color: white">后台管理系统</span>
        </li>
        <li class="user">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link"style="color: black" >
                      <el-avatar size="small"  :src=this.imageUrl style="margin-right: 8px;cursor:pointer;"></el-avatar>
                <span style="cursor:pointer;">{{this.name}}</span><i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="personMenu()">个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="editMenu()">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </li>
    </el-menu>
</div>
</template>


<script>

export default {

    data() {
        return {
          imageUrl:'',
          name:'',
        }
    },
    methods: {
      editMenu(){
        this.$axios.post("/logout").then(res => {
          console.log(res.data.data)
          localStorage.clear()
          this.$router.push("/")
        })
      },
      personMenu(){
        this.$router.push("/index/UserGroup");
      },
      getUser(){
        this.$axios.get('/auth/userInfo').then((res)=>{
          this.imageUrl = 'http://imnu.congmingdemofeitegjj.shop/'+res.data.data.remark;
          this.name = res.data.data.roleName
        })
      }
    },
  created() {
    this.getUser();
  }
}
</script>


<style media="screen">
.header-wraper {
  background-color: #545c64;
}
.header-wraper li {
    float: left;
    margin-right: 20px;
    margin-top: 5px;

}
.el-menu.el-menu--horizontal{
  background-color: #545c64;
}

.title {
    padding: 1em .2em;
}

.title span {
    font-size: 1.4em;
    margin-left: 5px;
}
.el-select-dropdown__list{
  max-height: 187px !important;
}
.option {
    padding-top: 10px;
}

.user .el-dropdown {
    position: absolute;
    right: 20px;
    padding-top: 20px;
    color: #fff !important;
}
.el-dropdown-link{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
