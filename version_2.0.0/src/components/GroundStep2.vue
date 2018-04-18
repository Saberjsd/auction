<template>
  <div class="infoWindow">
    <div class="info-head">
      <i @click="goArea"></i>
      <span @click="$store.dispatch('setGroundShowDetail')">
        地块信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
      <b :class="{collection:true,active:collectionActive}" @click="collectionClick"></b>
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >
        <ul class="info-msg">
            <li><i></i>地块编号 <span>{{$store.getters.currentGround.signId}}</span></li>
            <li><i></i>地块类型 <span>{{$store.getters.currentGround.classify}}</span></li>
            <li><i></i>地块状态 <span>{{states[$store.getters.currentGround.state]}}</span></li>
            <li><i></i>起拍价格 <span>{{$store.getters.currentGround.startPrice}}</span></li>
            <li class="last-price">
              <i></i>最近出价
              <span :class="{active:refreshActive,delay:refreshPriceCount}" @click="refreshPrice"></span>
              <b v-if="refreshPriceCount">{{refreshPriceCount}}s</b>
            </li>
            <div class="price-count"><span>剩余竞拍时间: {{reTime}}</span></div>
            <div class="price-list">
              <li v-for="item in priceList" :key="item.userId"><span>{{item.price}} DDC</span> <span>{{item.priceTime}}</span></li>
            </div>
            <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice}} DDC</span></li>
            <div class="input-p">
              <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input><br/>
              <span class="help-text" v-if="ishelp">{{helpText}}</span>
            </div>
            
        </ul>
        <button :class="{'set-price-btn':true,active:inputActive}" @click="inputPriceClick()">
          我要出价
          <i v-if="inputPriceCount">({{inputPriceCount}}s)</i>
        </button>
      </div>
    </el-collapse-transition>

    
  </div>
</template>

<script>
import getTime from '@/util/getTime'
import {setCookie,getCookie} from '@/util/util'
export default {
  name: 'GroundStep2',
  data () {
    return { 
       inputPrice:'',
       inputActive:true, //是否可以竞价
       collectionActive:false, 
       refreshActive:false, //刷新中的动画,true 是有
       refreshPriceCount:0, //刷新等待剩余时间,默认 0 是可以立即点的
       inputPriceCount:0, //竞价剩余等待时间
       priceList:[
        //{userId:5,price:'23000',priceTime:'2018/4/9 9:26:73'},
       ],
      states:["未开拍","拍卖中","已拍卖","已拍卖"],
      topPrice:0,
      helpText:'输入错误',
      ishelp:false, //help文字显示,
      timeOut:0, //超时计时器
      endTime:'',
      timer:0, //倒计时器
      reTime:null,
      time60:0,
      isRes:false, //刷新5条数据是否返回的数据
    }
  },
  computed(){

  },
  mounted(){
    this.get_five_price(this.$store.state.currentGroundID)
    // this.get_end_time()
    this.getT();
    this.timer = setInterval(() => {
      this.getT();
    },1000)
    //输入限制时间
    // if(){
    
    // }
    if( parseInt(getCookie('inputPriceCount'))>0){
      // console.log(1111)
      this.inputActive = false;
      this.inputPriceCount = parseInt(getCookie('inputPriceCount'))
    }
    if(this.inputPriceCount >0){
      // console.log(2222)
      this.time60 = setInterval(() =>{
        this.inputPriceCount -=1;
        setCookie('inputPriceCount',this.inputPriceCount,1000*(this.inputPriceCount))
        if(this.inputPriceCount<=0){
          clearInterval(this.time60)
          this.inputActive=true;
        }
      },1000)
    }
    
  },
  updated(){
    
  },
  destroyed(){
    // debugger;
    clearInterval(this.timer)
    clearInterval(this.time60)
  },
  // watch:{
  //   'lanId':function(value,oldvalue){
  //     console.log(value)
  //   }
  // },
  methods:{
    collectionClick(){
      var vthis = this;
      if(!this.collectionActive){
        this.$http.get('/api/collect/collectLand/5/'+this.$store.state.currentGroundID)
                .then(function (res) {
                  if(res.data.code){
                    vthis.collectionActive = true
                    vthis.$message({
                      showClose: true,
                      message: '收藏成功',
                      type: 'success'
                    });
                  }else{
                    vthis.$message({
                      showClose: true,
                      message: '您已经收藏过了',
                      type: 'error'
                    });
                  }
                })
                .catch(function (err) {
                  console.log(err);
                });
      }else{
        this.$http.get('/api/collect/cancelCollect/5/'+this.$store.state.currentGroundID)
                .then(function (res) {
                  if(res.data.code){
                    vthis.collectionActive = false
                    vthis.$message({
                      showClose: true,
                      message: '取消收藏成功',
                      type: 'success'
                    });
                  }
                })
                .catch(function (err) {
                  console.log(err);
                });
      }

    },
    getT(){
      this.endTime = this.$store.getters.currentGround.endTime?this.$store.getters.currentGround.endTime:((new Date()).getTime()+24*3600*1000);
      var start = new Date();
      var end= new Date(this.endTime);  
      var res = getTime(start,end)
      // console.log(res)
      
      if(res.totalTime <=0){
          // debugger;
           clearInterval(this.timer);
        }else{
          this.reTime=(res.days)*24+res.hours+"时"+res.minutes+"分"+res.seconds+"秒"
        }
        // console.log(this.reTime)
    },
    get_five_price(lid){
      // console.log('give_five',lid)
      var vthis = this;
      this.priceList=[]
      this.$http.get('/api/priceRecord/getPriceRecord/'+lid,{
        timeOut:10000
      })
                .then(function (res) {
                  // console.log(res);
                  if(res.data.data){
                    vthis.priceList = res.data.data
                    vthis.refreshActive = false;
                    clearTimeout(vthis.timeOut);
                    // vthis.isRes = true;
                    return true;
                  }else{
                    vthis.priceList=[]
                    return false;
                  }
                  
                }).then((isSuccess) =>{
                  if(isSuccess){

                    vthis.isRes = true

                  }
                })
                .catch(function (err) {
                  console.log(err);
                  vthis.$message({
                    showClose: true,
                    message: '啊哦,服务器开小差了..请稍后重试!',
                    type: 'error'
                  });
                });
    },
    goArea:function(){
      this.$emit('goArea','2')
      this.$store.dispatch('setData',{state:'groundIn',data:false})
    },
    refreshPrice(){
      if(this.refreshPriceCount == 0){
        this.refreshPriceCount = 10;
      }else{
        return false;
      }
      this.refreshActive = true;
      if(this.refreshPriceCount == 10){
        // this.timeOut = setTimeout(() => {
        //   this.refreshActive = false;
        //   this.$message({
        //     showClose: true,
        //     message: '啊哦,数据没刷新出来..请稍后重试!',
        //     type: 'error'
        //   });
        // },5000)

        var ptime = setInterval(() => {
          this.refreshPriceCount -= 1;
          if(this.refreshPriceCount==0){
            clearInterval(ptime)
            this.refreshActive = false;
          }
        },1000)
      }


      this.get_five_price(this.$store.state.currentGroundID)

      
      if(this.isRes){//请求最新5条数据
        this.isRes = false;
        this.$message({
                      showClose: true,
                      message: '刷新成功',
                      type: 'success'
                    });
      }

      

      
     
    },
    inputPriceClick(){
      if(!this.inputActive){
        return false
      }
      if(this.priceList.lenght>0){
        this.topPrice = parseInt(this.priceList[0].price) + parseInt(this.$store.getters.currentGround.minAddPrice)
      }else{
        this.topPrice = this.$store.getters.currentGround.startPrice
      }
      
      // console.log(parseInt(this.inputPrice))
      if(isNaN(parseInt(this.inputPrice)) ){  //判断是否数字
        this.ishelp=true;
        this.helpText='请输入纯数字';
        return false;
      }
      if(parseInt(this.inputPrice) < this.topPrice){  //判断是否大于最小值
        this.ishelp=true;
        this.helpText = '您的出价应大于'+this.topPrice
        return false;
      }
      this.ishelp=false;
      //前端验证通过

      setCookie('inputPriceCount',60,1000*60)
      this.inputActive =false;
      this.inputPriceCount = parseInt(getCookie('inputPriceCount'))
      this.time60 = setInterval(() =>{
        if(this.inputPriceCount >0){
          this.inputPriceCount -=1;
          setCookie('inputPriceCount',this.inputPriceCount,1000*(this.inputPriceCount))
        }else{
          clearInterval(this.time60)
          this.inputActive=true;
        }
      },1000)
      //出价
      this.set_price()

    },
    set_price(){
      var vthis = this;
      // console.log(this.$store.state.currentGroundID)
      this.$http.get('/api/land/acting/'+parseInt(this.inputPrice)+'/6/'+this.$store.state.currentGroundID,{timeOut:10000})
                .then(function (res) {

                  // console.log(res.data);
                  // console.log('/api/land/acting/'+parseInt(vthis.inputPrice)+'/5/'+vthis.$store.state.currentGroundID)
                  if(res.data.code){
                    // vthis.priceList = res.data.data
                    vthis.refreshPrice()
                    vthis.$store.dispatch('setEndTime',{id:vthis.$store.state.currentGroundID,endTime:res.data.data.endTime})
                    vthis.$message({
                      showClose: true,
                      message: '出价成功!',
                      type: 'success'
                    });
                  }else{
                    vthis.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: 'error'
                    });
                  }
                  
                })
                .catch(function (err) {
                  console.log(err);
                  vthis.$message({
                    showClose: true,
                    message: '啊哦,出错了..请稍后重试!',
                    type: 'error'
                  });
                });
    }

  },
}
</script>
<style scoped>
.help-text{
  color: red;font-size: 14px;
}
.input-p{height: 65px;}
.infoWindow button.set-price-btn{margin-top: 0px !important;}
</style>
