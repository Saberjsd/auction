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
          <li class="count-down"><i>
            </i>开拍倒计时 
              <span >
                {{reTime}}

              </span>
            </li>
          <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice}} DDC</span></li>
          <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input>
        </ul>
        <button class="set-price-btn">我要出价</button>
      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
import getTime from '@/util/getTime'
export default {
  name: 'GroundStep1',
  data () {
    return { 
       inputPrice:'',
       collectionActive:false,
       states:["未开拍","拍卖中","已拍卖","已拍卖"],
       reTime:"",
       timer:null,
       
    }
  },
  destroyed(){
    clearInterval(this.timer)
  },
  mounted(){
    this.getT();
    this.timer = setInterval(() => {
      this.getT();
    },1000)

    
  },
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
    goArea:function(){
      this.$emit('goArea','1')
      this.$store.dispatch('setData',{state:'groundIn',data:false})
    },
    time(){
      var start = new Date();
      var end= this.$store.getters.currentGround.startTime;
      if(!end){
        end=new Date()
      }else{
        end=new Date(end);
      }
      return getTime(start,end)
    },
    getT(){
         var date=this.time();
         if(date.totalTime <=0){
           clearInterval(this.timer);
          //  this.$store.dispatch('setData',{state:'groundStep',data:2})
         }else{
           this.reTime=date.days+"天"+date.hours+"时"+date.minutes+"分"+date.seconds+"秒"
         }
     
    }
    // showToggle:function(){
    //   this.$store.dispatch('setGroundShowDetail')
    // }
  }
}
</script>
<style scoped>

</style>
