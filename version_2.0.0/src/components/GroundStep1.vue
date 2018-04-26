<template>
  <div class="infoWindow">

    <div class="info-head">
      <i @click="goArea" v-if="$store.state.sidebars =='01'"></i>
      <span @click="$store.dispatch('setGroundShowDetail')">
        地块信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
      <b :class="{collection:true,active:$store.state.landIsCollected}" @click="collectionClick"></b>
      
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >
        <ul class="info-msg">
          <li><i></i>地块编号 <span>{{$store.getters.currentGround.signId}}</span></li>
          <li><i></i>地块类型 <span>{{types}}</span></li>
          <li><i></i>地块状态 <span>{{states[$store.getters.currentGround.state]}}</span></li>
          <li class="count-down"><i>
            </i>开拍倒计时 
              <span >
                {{reTime}}

              </span>
            </li>
          <li class="set-price" v-if="$store.getters.currentGround.startPrice"><i></i>起拍价格 <span>{{$store.getters.currentGround.startPrice}} DDC</span></li>
          <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice?$store.getters.currentGround.minAddPrice:0}} DDC</span></li>
          <!-- <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input> -->
        </ul>
        <!-- <button class="set-price-btn">我要出价</button> -->
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
      //  collectionActive:false,
       states:["未开拍","拍卖中","已拍卖","已拍卖"],
       type:{
         "1":'特殊地块',
         "2":"标志地块"
       },
       reTime:"",
       timer:null,
       
    }
  },
  computed:{
    types(){
      if(this.$store.getters.currentGround){
          var mark=this.$store.getters.currentGround.isMark;
          if(mark ==0 ){
            return this.$store.getters.currentGround.classify
          }else{
            return this.type[mark];
          }
      }
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
      if(!this.$store.state.landIsCollected){
        // console.log
        this.$http.get('/auction/api/collect/collectLand',
          {
            params:{
              userId:this.$store.state.userInfo.id,
              landId:this.$store.state.currentGroundID
            },
            timeOut:5000
          }
        )
                .then(function (res) {
                  if(res.data.code == 1){
                    // vthis.$store.dispatch('setGroundDetailCollection',true)
                    vthis.$store.dispatch('setData',{state:'landIsCollected',data:true})
                    // vthis.collectionActive = true
                    vthis.$message({
                      showClose: true,
                      message: '收藏成功',
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
                  vthis.$message({
                      showClose: true,
                      message: err.message,
                      type: 'error'
                    });
                });
      }else{
        this.$http.get('/auction/api/collect/cancelCollect',
          {
            params:{
              userId:this.$store.state.userInfo.id,
              landId:this.$store.state.currentGroundID
            },
            timeOut:5000
          }
        )
                .then(function (res) {
                  if(res.data.code == 1){
                    // vthis.collectionActive = false
                    vthis.$store.dispatch('setData',{state:'landIsCollected',data:false})
                    vthis.$message({
                      showClose: true,
                      message: '取消收藏成功',
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
                  vthis.$message({
                      showClose: true,
                      message: err.message,
                      type: 'error'
                    });
                });
      }

    },
    goArea:function(){
      this.$emit('goArea','1')
      this.$store.dispatch('setData',{state:'groundIn',data:false})
    },
    time(){
      var start = new Date();
      if(this.$store.state.ctime){
        var localNow = (new Date).getTime()
        if(localNow>this.$store.state.ctimer){
          var diff = localNow-this.$store.state.ctimer
          start=new Date(this.$store.state.ctime+diff);
        }
      }
      var end= this.$store.getters.currentGround.startTime;
      // console.log(start,end)
      if(!end){
        end=new Date()
      }else{
        end= new Date(end.replace(/-/g,'/').replace(/T|Z/g,' ').trim());;
      }
      return getTime(start,end)
    },
    getT(){
         var date=this.time();
         
         if(date.totalTime <=0){
           this.reTime = '';
           clearInterval(this.timer);
          // console.log('refreshHot1')
          //  this.$store.dispatch('setData',{state:'groundStep',data:2})
          // console.log('hothot')
          this.$emit('refreshLand')
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
