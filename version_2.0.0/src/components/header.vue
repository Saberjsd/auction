<template>
  <div class="index-header">
    <div class="index-header-logo">
      <a href="#/index">
          <img src="~assets/img/logo.png" alt="">
          <span>DREAM WORLD</span>
      </a>  
    </div>

    <div class="header-right">
      <a href="" class="exit">
        <span>退出</span>
        <img src="~assets/icons/icon-exit.png">
      </a>
      <div class="span"></div>
      <div class="remainder-refresh">
        余额:
        <span class="remainder"><i>1000</i>DDC</span>
        <a href=""><img src="~assets/icons/icon-refresh.png"></a>
      </div>
      <div class="span"></div>
      <div class="user-info">
        HELLO,
        <span>183****4512</span>
      </div>
    </div> 


  </div>
</template>

<script>
export default {
  name: 'Headers',
  data () {
    return { 
       
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index-header{
  width: 100%;height: 60px;background: #ffffff;line-height: 60px;box-shadow: 0px 0px 10px 3px #ebebeb;
}
.index-header-logo{
  height: 60px;width: 320px;background: #4284f7;float: left;
}
.index-header-logo img{
  float: left;
  margin: 9px 12px 9px 0px;
}
.index-header-logo a{color:#ffffff;display: inline-block;}
.index-header-logo span{
  float: right;
  font-family: Arial-Black;font-size: 18px;font-weight:bold;
}
/* 右部 */
.header-right{
  float: right;height: 60px;color: #666;width: 520px;
}
.header-right>a,.header-right>div{
  float: right;color: #666;
}
.span{
  float: right;width: 1px;height: 30px;background-color: #c5c5c5;margin: 15px 20px;
}

.exit{
  margin-right: 60px;width: 75px;
}
.exit img{
  position: absolute;top: 21px;float: right;
}
.exit span{
  float: left;
}
.user-info{
  float: right;
}

</style>
