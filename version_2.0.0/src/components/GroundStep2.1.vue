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
            <li><i></i>起拍价格 <span>{{$store.getters.currentGround.startPrice}}</span></li>
            <li class="last-price">
              <i></i>最近出价
              <span :class="{active:refreshActive,delay:refreshPriceCount}" @click="refreshPrice"></span>
              <b v-if="refreshPriceCount">{{refreshPriceCount}}s</b>
            </li>
            <div class="price-count" v-if="reTime"><span>剩余竞拍时间: {{reTime}}</span></div>

            <div class="price-list">
              <li v-if="noPriceList" style="font-size:16px;">{{noPriceList}}</li>
              <li v-for="item in priceList" :key="item.userId">
                <span >{{item.walletAddr}} </span>
                <!-- <i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i> -->
                <!-- <span v-if="item.walletAddr==$store.state.userInfo.walletAddr"> </span> -->
                <!-- <br> -->
                <span v-if="item.price" class="ddc">{{item.price}} DDC &nbsp;&nbsp;<i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i></span>
                
                <span>{{new Date(item.priceTime).format('M-dd hh:mm:ss')}}</span>
              </li>
            </div>

            <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice}} DDC</span></li>
            <div class="input-p">
              <!-- <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input><br/> -->
              <el-input-number v-model="inputPrice" :step="$store.getters.currentGround.minAddPrice" :min="topPrice" readonly="true"></el-input-number>
              <span class="help-text" >{{helpText}}</span>
            </div>
            
        </ul>
        <button :class="{'set-price-btn':true,active:inputActive}" :loading="btnLoading" @click="inputPriceClick()">
          我要出价
          <i v-if="inputPriceCount">({{inputPriceCount}}s)</i>
        </button>
      </div>
    </el-collapse-transition>

    
  </div>
</template>

<script>
import getTime from "@/util/getTime";
import { setCookie, getCookie } from "@/util/util";
export default {
  name: "GroundStep2",
  props: ["landid"],
  data() {
    return {
      inputPrice: 0,
      inputActive: true, //是否可以竞价
      //  collectionActive:false,
      refreshActive: false, //刷新中的动画,true 是有
      refreshPriceCount: 0, //刷新等待剩余时间,默认 0 是可以立即点的
      inputPriceCount: 0, //竞价剩余等待时间
      priceList: [
        //{userId:5,price:'23000',priceTime:'2018/4/9 9:26:73'},
      ],
      noPriceList: "",
      states: ["未开拍", "拍卖中", "已拍卖", "已拍卖"],
      topPrice: 0,
      helpText: "",
      // ishelp:false, //help文字显示,
      timeOut: 0, //超时计时器
      endTime: "",
      timer: 0, //倒计时器
      reTime: null,
      time60: 0,
      isRes: false, //刷新5条数据是否返回的数据,
      // endTime:
      btnLoading: false,
      ployStyle: [
        {
          strokeColor: "#f1f1f1",
          fillColor: "#00FFFF",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#1253fc",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#ff966d",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        },
        {
          strokeColor: "#f1f1f1",
          fillColor: "#ff966d",
          strokeWeight: 1,
          strokeOpacity: 0,
          fillOpacity: 0.5
        }
      ],
      retimer10:0,
      // newState:null,
    };
  },
  computed:{
    refreshTime:function(){
      if(this.$store.getters.currentGround&&this.$store.getters.currentGround.isMark==2){
        return 10*1000
      }
      return 60*1000
    }
  },
  mounted() {
    // console.log('id',this.landid)
    this.get_five_price();
    // this.get_end_time()
    // debugger;
    // console.log(
    //   "currentGroundDetail.endTime",
    //   this.$store.getters.currentGround.endTime
    // );
    if (this.$store.getters.currentGround.endTime) {
      this.getT();
      this.timer = setInterval(() => {
        this.getT();
      }, 1000);
      //输入限制时间
      // if(){
    }

    if(!this.retimer10){
      // console.log(89999999)
      this.retimer10 = setInterval(()=>{
        this.get_five_price(res =>{
          if(this.topPrice<res){
            this.$message({
              showClose: true,
              message: "当前最高价是"+res,
              type: "info"
            })
          }
        })

        // console.log(2222222)
      },this.refreshTime)
    }

    // }
    if (parseInt(getCookie("inputPriceCount")) > 0) {
      // console.log(1111)
      this.inputActive = false;
      this.inputPriceCount = parseInt(getCookie("inputPriceCount"));
    }
    if (this.inputPriceCount > 0) {
      // console.log(2222)
      this.time60 = setInterval(() => {
        this.inputPriceCount -= 1;
        setCookie(
          "inputPriceCount",
          this.inputPriceCount,
          1000 * this.inputPriceCount
        );
        if (this.inputPriceCount <= 0) {
          clearInterval(this.time60);
          this.inputActive = true;
        }
      }, 1000);
    }
  },
  destroyed() {
    // debugger;
    clearInterval(this.retimer10);
    clearInterval(this.timer);
    clearInterval(this.time60);
  },
  watch: {
    landid: function(value, oldvalue) {
      // console.log(value, oldvalue);
      clearInterval(this.timer)
      this.reTime = null;
      if (this.$store.getters.currentGround.endTime) {
        this.getT();
        this.timer = setInterval(() => {
          this.getT();
        }, 1000);
      }
      this.get_five_price();
    }
  },
  methods: {
    collectionClick() {
      var vthis = this;
      if (!this.$store.state.landIsCollected) {
        // console.log
        this.$http
          .get(
            "/auction/api/collect/collectLand/" +
              this.$store.state.userInfo.id +
              "/" +
              this.$store.state.currentGroundID
          )
          .then(function(res) {
            if (res.data.code) {
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
                message: "您已经收藏过了",
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
          .get(
            "/auction/api/collect/cancelCollect/" +
              this.$store.state.userInfo.id +
              "/" +
              this.$store.state.currentGroundID
          )
          .then(function(res) {
            if (res.data.code) {
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
                message: "取消收藏失败",
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
    getT() {
      // debugger;
      if (this.$store.getters.currentGround.endTime) {
        this.endTime = this.$store.getters.currentGround.endTime;
        // console.log("this.endTime", this.endTime);
        var start = new Date();
        if(this.$store.state.ctime){
          var localNow = (new Date).getTime()
          if(localNow>this.$store.state.ctimer){
            var diff = localNow-this.$store.state.ctimer
            start=new Date(this.$store.state.ctime+diff);
          }
        }
        var end = new Date(this.endTime);
        var res = getTime(start, end);
        if (res.totalTime <= 0) {
          // debugger;
          clearInterval(this.timer);
          // debugger;
          this.land_over();
          // this.$store.dispatch("setData", { state: "groundStep", data: 3 });
        } else {
          this.reTime =
            res.days * 24 +
            res.hours +
            "时" +
            res.minutes +
            "分" +
            res.seconds +
            "秒";
        }
      }

      // console.log(this.reTime)
    },
    land_over(call) {
      // debugger;
      // console.log('refreshHot2')
      this.$emit("refreshHot",'05');
      if (this.priceList.length > 0) {
        if (this.$store.state.userInfo.id == this.priceList[0].userId) {
        this.$http
          .get(
            "/auction/api/user/craeteTransactionByLandId/" +
              this.$store.state.currentGroundID
          )
          .then(res => {
            
            if (res.data.code) {
              // console.log("hothot");

              // console.log("记录生成返回数据", res.data);
              // this.$store.dispatch("setData", {
              //   state: "landList",
              //   data: [res.data.data]
              // });
              // this.$store.getters.currentPayLoad.setFillColor("#ff966d");
            }
          });
        }
      }
    },
    get_five_price(call) {
      // console.log('give_five',lid)
      // var vthis = this;
      this.priceList = [];

      this.$http
        .get(
          "/auction/api/priceRecord/getPriceRecord/" +
            this.$store.state.currentGroundID,
          {
            timeOut: 10000
          }
        )
        .then(res => {
          // console.log(res);
          if (res.data.code) {
            
            this.noPriceList = "";
            this.priceList = res.data.data;
            this.refreshActive = false;
            // debugger;
            // console.log("111", this.priceList, this.priceList.length > 0);
            if (this.priceList.length > 0) {
              // debugger;
              if(call && typeof call =='function') call(this.priceList[0].price)
              if(this.$store.getters.currentLabel){
                this.$store.getters.currentLabel.setContent(parseInt(this.priceList[0].price / 1000) + "k")
              }
              // console.log("222", this.priceList, this.priceList.length > 0);
              this.topPrice =
                parseInt(this.priceList[0].price) +
                parseInt(this.$store.getters.currentGround.minAddPrice);
            } else {
              if(this.$store.getters.currentLabel){
                this.$store.getters.currentLabel.setContent('')
              }
              // console.log("333", this.priceList, this.priceList.length > 0);
              this.topPrice = this.$store.getters.currentGround.startPrice;
            }
            this.inputPrice = this.topPrice;
            
            
            // console.log(this.topPrice);
            clearTimeout(this.timeOut);
            // vthis.isRes = true;
            return true;
          } else {
            // this.priceList=[]
            // console.log(1111)
            this.topPrice = this.$store.getters.currentGround.startPrice;
            this.inputPrice = this.$store.getters.currentGround.startPrice;
            this.noPriceList = "该地块暂时还没有人出价,快来竞拍吧!";
            return false;
          }
        })
        // .then((isSuccess) =>{
        //   if(isSuccess){
        //     vthis.isRes = true
        //   }
        // })
        .catch(err => {
          console.log(err);

         
        });
    },
    goArea: function() {
      this.$emit("goArea", "2");

      this.$store.dispatch("setData", { state: "groundIn", data: false });
    },
    refreshPrice() {
      if (this.refreshPriceCount == 0) {
        this.refreshPriceCount = 10;
      } else {
        return false;
      }
      this.refreshActive = true;
      if (this.refreshPriceCount == 10) {
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
          if (this.refreshPriceCount == 0) {
            clearInterval(ptime);
            this.refreshActive = false;
          }
        }, 1000);
      }

      this.get_land_detail();
      this.get_five_price();

      if (this.isRes) {
        //请求最新5条数据
        this.isRes = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
      }
    },
    inputPriceClick() {
      if (!this.inputActive) {
        return false;
      }
      if (this.priceList.lenght > 0) {
        // debugger;
        this.topPrice =
          parseInt(this.priceList[0].price) +
          parseInt(this.$store.getters.currentGround.minAddPrice);
      } else {
        this.topPrice = this.$store.getters.currentGround.startPrice;
      }

      // console.log(parseInt(this.inputPrice))
      if (isNaN(parseInt(this.inputPrice))) {
        //判断是否数字
        // this.ishelp=true;
        this.helpText = "请输入纯数字";
        return false;
      }
      if (parseInt(this.inputPrice) < this.topPrice) {
        //判断是否大于最小值
        // this.ishelp=true;
        this.helpText = "您的出价应大于" + this.topPrice;
        return false;
      }
      // this.ishelp=false;
      //前端验证通过

      //出价
      this.set_price(() => {
        setCookie("inputPriceCount", 10, 1000 * 10);
        this.inputActive = false;
        this.inputPriceCount = parseInt(getCookie("inputPriceCount"));
        this.time60 = setInterval(() => {
          if (this.inputPriceCount > 0) {
            this.inputPriceCount -= 1;
            setCookie(
              "inputPriceCount",
              this.inputPriceCount,
              1000 * this.inputPriceCount
            );
          } else {
            clearInterval(this.time60);
            this.inputActive = true;
          }
        }, 1000);
      });
    },
    get_land_detail() {
      // console.log('lid',lid)
      var vthis = this;
      this.$http
        .get(
          "/auction/api/land/getByLandId/" +
            this.$store.state.currentGroundID +
            "/" +
            this.$store.state.userInfo.id
        )
        .then(function(res) {
          if (res.data.code) {
            // console.log('地块详情:',res.data.data);
            // debugger;
            var land = res.data.data.land;
            var startTime = new Date(land.startTime);
            var now = new Date();
            if (startTime < now && land.state == 0) {
              land.state = 1;
            }
            if (land.endTime) {
              var end = new Date(land.endTime);
              if (end < now) {
                land.state = 2;
              }
            }
            vthis.$store.dispatch("setData", {
              state: "currentGroundDetail",
              data: land
            });

            var PayLoad = vthis.$store.getters.currentPayLoad;
            var label = vthis.$store.getters.currentLabel;
            var status = res.data.data.land.state;
            var topPrice = res.data.data.land.topPrice;
            // PayLoad.setFillColor(vthis.ployStyle[status].fillColor);
            label.setContent(parseInt(topPrice / 1000) + "k");
          } else {
            vthis.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(function(err) {
          // console.log(err);
        });
    },
    set_price(call) {
      var vthis = this;
      this.btnLoading = true;
      // console.log(this.$store.state.currentGroundID)
      this.$http
        .post(
          "/auction/api/land/acting/" +
            parseInt(this.inputPrice) +
            "/" +
            this.$store.state.userInfo.id +
            "/" +
            this.$store.state.currentGroundID,
          {},
          { timeOut: 10000 }
        )
        .then(function(res) {
          // console.log(res.data);
          // console.log('/api/land/acting/'+parseInt(vthis.inputPrice)+'/5/'+vthis.$store.state.currentGroundID)
          if (res.data.code) {
            // vthis.priceList = res.data.data
            var data = res.data.data;
            vthis.btnLoading = false;

            vthis.get_five_price();
            vthis.get_land_detail();
            vthis.$store.dispatch("chageUserInfo", {
              ableDdc: data.ableDdc,
              freezeDdc: data.freezeDdc,
              allDdc: data.ableDdc + data.freezeDdc
            });
            if (data.endTime) {
              vthis.$store.dispatch("setEndTime", {
                id: vthis.$store.state.currentGroundID,
                endTime: data.endTime
              });
            }

            vthis.$message({
              showClose: true,
              message: "出价成功!",
              type: "success"
            });
            if (call) call();
          } else {
            // vthis.refreshPrice();
            vthis.get_five_price();
            vthis.get_land_detail();
            vthis.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(function(err) {
          console.log(err);
          vthis.$message({
            showClose: true,
            message: "啊哦,出错了..请稍后重试!",
            type: "error"
          });
        });
    },
    
  }
};
</script>
<style scoped>
.help-text {
  color: red;
  font-size: 14px;
  display: inline-block;
}
.input-p {
  height: 65px;
}
.infoWindow button.set-price-btn {
  margin-top: 0px !important;
}
</style>
