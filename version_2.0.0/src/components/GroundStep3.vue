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
          <li><i></i>地块类型 <span>{{$store.getters.currentGround.classify?$store.getters.currentGround.classify:'标志地块'}}</span></li>
          <li><i></i>地块状态 <span>{{states[$store.getters.currentGround.state]}}</span></li>
          
          <template v-if="priceList.length >0" v-loading="PriceLoading">
            <li style="border-bottom:none;"><i></i>出价记录</li>
            <div class="price-list acted">
              <li v-for="item in priceList" :key="item.id" :class="{myDDC:item.walletAddr==$store.state.userInfo.walletAddr}">
                <span >{{item.walletAddr}} </span>
                <span v-if="item.price" class="ddc">{{item.price}} DDC &nbsp;&nbsp;<i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i></span>
                <span>{{dateFormat(item.priceTime,'M-dd hh:mm:ss')}}</span>
              </li>
            </div>
          </template>

          <template v-if="isCo
           //&&$store.getters.currentGround.userId==$store.state.userInfo.id
           ">
            <button @click="craeteTransaction()">生成订单</button>
          </template>
          <template v-else>
            <li ><i></i>地块拥有者 </li>
            <div class="ground-owner">
              <span>{{owner}}</span>
            </div>
          </template>

        </ul>

        

      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
import dateFormat from "@/util/dateF";
export default {
  name: "GroundStep1",
  data() {
    return {
      inputPrice: "",
      //  collectionActive:false,
      states: ["未开拍", "拍卖中", "已拍卖 待支付", "已拍卖 已支付"],
      owner: "",
      dateFormat,
      isCo:false,
    };
  },
  props: ["landid", "priceList","PriceLoading"],
  mounted() {
    if (this.landid) {
      this.get_owner();
    }
    this.isSetCloect()
  },
  watch: {
    landid: function(val, old) {
      this.get_owner();
      this.isSetCloect();
    },
    priceList:function(){
      this.isSetCloect();
    }
  },
  methods: {
    isSetCloect(){
      this.isCo=false;
      var now=new Date();
      var land=this.land();
      if(land.endTime&&land.state==1){
        var end=new Date(land.endTime);
        if(end<now){
          if(this.priceList.length>0&&this.priceList[0].userId==this.$store.state.userInfo.id){
            this.isCo=true;
          }
        }


      }
      
    },
    land(){
      var id=this.$store.state.currentGroundID;
      var landList=this.$store.state.landList;
      var indexs=-1;
      landList.forEach(function(item,index){
        if(item.id==id){
          indexs=index;
        }
      })
      if(indexs>=0)return landList[indexs];
      return null;
    },
    get_owner() {
      var land = this.$store.getters.currentGround;
      // console.log('land',land)

      if (land.addr) {
        this.owner = land.addr;
        console.log(111)
      } else if (land.userId == 0) {
        this.owner = "系统资产";
        console.log(222)
      } else if(land.userId >0){
        console.log(333)
        this.$http
          .get("/auction/api/user/getWalletAddrById", {
            params: {
              userId: land.userId
            },
            timeOut: 5000
          })
          .then(res => {
            if (res.data.code == 1) {
              land.addr= res.data.data;
              this.owner = res.data.data;
              this.$store.dispatch("setCurrentland",{id:land.id,data:land});
            }
          });
      }
    },
    collectionClick() {
      var vthis = this;
      if (!this.$store.state.landIsCollected) {
        // console.log
        this.$http
          .get("/auction/api/collect/collectLand", {
            params: {
              userId: this.$store.state.userInfo.id,
              landId: this.$store.state.currentGroundID
            },
            timeOut: 5000
          })
          .then(function(res) {
            if (res.data.code == 1) {
              // vthis.$store.dispatch('setGroundDetailCollection',true)
              vthis.$store.dispatch("setData", {
                state: "landIsCollected",
                data: true
              });
              // vthis.collectionActive = true
              vthis.$message({
                showClose: true,
                message: "收藏成功",
                type: "success"
              });
            } else {
              vthis.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(function(err) {
            vthis.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      } else {
        this.$http
          .get("/auction/api/collect/cancelCollect", {
            params: {
              userId: this.$store.state.userInfo.id,
              landId: this.$store.state.currentGroundID
            },
            timeOut: 5000
          })
          .then(function(res) {
            if (res.data.code == 1) {
              // vthis.collectionActive = false
              vthis.$store.dispatch("setData", {
                state: "landIsCollected",
                data: false
              });
              vthis.$message({
                showClose: true,
                message: "取消收藏成功",
                type: "success"
              });
            } else {
              vthis.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          })
          .catch(function(err) {
            vthis.$message({
              showClose: true,
              message: err.message,
              type: "error"
            });
          });
      }
    },
    goArea: function() {
      this.$emit("goArea", "1");
      this.$store.dispatch("setData", { state: "groundIn", data: false });
    },
    craeteTransaction(){
      this.$http.get("/auction/api/user/craeteTransactionByLandId",{
        params:{
          landId:this.$store.state.currentGroundID
        }
      }).then(data=>data.data)
      .then(data=>{
        if(data.code==1){
          // debugger;
          console.log(data);
          var land=data.data;
          land.oldState=2;
          var id=land.id;
          this.$store.dispatch("setCurrentland", {id:id, data: land });
          this.$message.success("订单生成成功")
        }else{
          this.$message.error(data.msg)
        }
      }).catch(error=>{
        console.error(error);
        this.$message.error(error.message)
      })
    }
  }
};
</script>
<style scoped>

</style>
