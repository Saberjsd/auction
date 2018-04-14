<template>
  <div class="index-header">

    <div class="index-header-logo">
      <a href="#/index">
          <img src="~assets/img/logo.png" alt="">
          <span>DREAM WORLD</span>
      </a>  
    </div>
    <!-- {{$store.state.user.username}}{{$store.state.user.passwd}}{{$store.state.user.code}} -->

    <div class="header-right">
      <a href="" class="exit">
        <span>退出</span>
        <i></i>
      </a>
      <div class="span"></div>
      <div class="remainder-refresh">
        余额:
        <span class="remainder"><i>1000</i> DDC</span>
        <a href=""></a>
      </div>
      <div class="span"></div>
      <div class="user-info">
        HELLO,
        <span>16351351351</span>
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
  width: 100%;height: 60px;background: #ffffff;line-height: 60px;position: absolute;
  box-shadow:1px 3px 3px rgba(0,0,0,.15);z-index: 10000;float: left;min-width: 900px;
}
.index-header-logo{
  height: 60px;width: 260px;background: #4284f7;float: left;
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
  float: right;height: 60px;color: #666;min-width: 600px;
}
.header-right>a,.header-right>div{
  float: right;color: #666;
}
.span{
  float: right;width: 1px;height: 30px;background-color: #c5c5c5;margin: 15px 20px;
}
.remainder-refresh{
  width: 170px;text-align: left;height: 60px;
}
.remainder-refresh a{
  position: relative;left: 12px;top:3px;width: 22px;height: 17px;display: inline-block;
  background: url('~assets/icons/icon-refresh.png') no-repeat;
}.remainder-refresh a:hover{
  background-image: url('~assets/icons/icon-refresh-hover.png')
}
.remainder{
  color: #ff966d;
}
.remainder i{font-style: normal;}
.remainder img{padding-left: 15px;}

.exit{
  margin-right: 60px;width: 75px;
}
.exit i{
  position: absolute;top: 21px;float: right;width: 17px;height: 18px;
  background: url('~assets/icons/icon-exit.png') no-repeat;
}
.exit:hover i{
  background-image: url('~assets/icons/icon-exit-hover.png')
}
.exit span{
  float: left;
}

.exit:hover span{
  color: #4284f7;
}
.user-info{
  float: right;
}
.user-info span{
  color: #ff966d;
}

</style>
