<template>
  <div class="header">
    <h3 class="header-title">首页LOGO</h3>
    <ul class="nav">
      <li><a href="">地图总览</a></li>
      <li><a href="">拍卖市场</a></li>
    </ul>
    <!-- <h3 class="login">登陆</h3>  -->
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data () {
    return {    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{text-decoration: none;color: #8f9199;}
ul,li{list-style: none;}
.header{
  width: 100%;height: 95px;background: #151823;line-height: 95px;
}
.header-title{
  color: white;font-weight: normal;float: left;margin: 0 0 0 15px;
}
/* .login{font-weight: normal;float: right;margin: 0;} */
.nav:after{content: '';width: 0;height: 0;display: table;clear: both;}
.nav{
  margin: 0 auto;width: 200px;padding: 0;height: 100%;
  display: flex;align-items: center;justify-content: space-around;
}
.nav li a{
  height: 30px;line-height: 30px;padding: 10px 15px;border-radius: 30px;
}
.nav li:hover a{
  background: #ff4130;color: white ! important;
}


</style>
