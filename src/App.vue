<template>
  <div id="app">

        <router-view></router-view>

  </div>
</template>

<script>


export default {
  name: 'app',
  data () {
    return {

    }
  },
  components:{

  },
  watch: {
  }
}
</script>

<style>
body{
  margin: 0;
}
#app{
  height: 100%;
  margin: 0;
  display: flex;
  flex-flow: column;
}
.app_header{
  position: relative;
  flex: 0 0 auto;
  z-index: 2;
  background: #545c64;
}
.app_header .title{
  margin-left: 16px;
  color: #fff;
  background: #545c64;
}
.app_content{
  flex: 1;
  display: flex;
  flex-flow: row;
}
.app_nav{
  position: relative;
  flex: 0 0 280px;
  background: #545c64;
}
.app_right{
  flex: 1;
  overflow: auto;
  padding: 20px;
}
.breadcrumb{
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
</style>
