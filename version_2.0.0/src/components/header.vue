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
      <div class="user-info">
        HELLO,
        <span>ALiyVgEZvcbRSA7zxVkDmMTdn8ryyesxnu</span>
      </div>
      <div class="span"></div>

      <div class="remainder">
        <span>总余额:</span>  
        <i>2500 DDC</i>
        <span>可用余额:</span>  
        <i>2000 DDC</i>
        <span>冻结余额:</span>  
        <i>500 DDC</i>
        
        <a href="javascript:void(0);" @click="refresh" :class="{active:refreshActive}">
          {{refreshRemainderCount == 0?'':refreshRemainderCount+'s'}}
        </a>
        <!-- <em class="remainder-count">
          <b v-show="refreshRemainderCount">{{refreshRemainderCount}}s</b>
        </em> -->
      </div>
      <div class="span"></div>

      <a href="" class="exit">
        <i></i>
      </a>

    </div> 

  </div>
</template>

<script>
export default {
  name: 'Headers',
  data () {
    return { 
       refreshActive:false,
       refreshRemainderCount:0  //刷新余额剩余时间
    }
  },
  methods:{
    refresh(){
      if(this.refreshRemainderCount == 0){
        this.refreshRemainderCount = 5;
      }else{
        return false;
      }
      this.refreshActive = true;
      if(this.refreshRemainderCount == 5){
        // setTimeout(() => {
        //   this.refreshActive = false;
        // },1000)

        var ptime = setInterval(() => {
          this.refreshRemainderCount -= 1;
          if(this.refreshRemainderCount==0){
            clearInterval(ptime)
            this.refreshActive = false;
          }
        },1000)
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index-header{
  width: 100%;height: 60px;background: #ffffff;line-height: 60px;position: absolute;
  box-shadow:1px 3px 3px rgba(0,0,0,.15);z-index: 1000;float: left;min-width: 1400px;
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
  float: right;height: 60px;color: #666;display: flex;
  align-items: center;justify-content: flex-end;font-size: 16px;
}
.span{width: 1px;height: 30px;background-color: #c5c5c5;margin: 15px 20px;}

.user-info span{color: #ff966d;user-select: text;}
.remainder a{
  width: 22px;height: 17px;display: inline-block;position: relative;top: 2px;
  background: url('~assets/icons/icon-refresh.png') no-repeat;background-size: contain;
}
/* .remainder-count{ width:20px;display: inline-block;} */
.remainder b{font-weight: normal;}
.remainder a:hover{background-image: url('~assets/icons/icon-refresh-hover.png')}
.remainder a.active{cursor: no-drop;background-image: none;color: #666;
}
.remainder i{font-style: normal;margin-right: 10px;}
.remainder i:nth-of-type(1){color: #9ac949;}
.remainder i:nth-of-type(2){color: #ff966d;}
.remainder i:nth-of-type(3){color: #4284f7;}
.exit{margin-right: 50px;}
.exit i{
  position: absolute;top: 21px;float: right;width: 17px;height: 18px;
  background: url('~assets/icons/icon-exit.png') no-repeat;
}
.exit:hover i{background-image: url('~assets/icons/icon-exit-hover.png')}
.exit:hover span{color: #4284f7;}


</style>
