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
              <span :class="{active:refreshActive,delay:refreshPriceCount}" ></span>
              <b v-if="refreshPriceCount">{{refreshPriceCount}}s</b>
            </li>
            <div class="price-count" v-if="reTime"><span>剩余竞拍时间: {{reTime}}</span></div>

            <div class="price-list" v-loading="PriceLoading">
              <li v-if="priceList.length==0&&PriceLoading==false" style="font-size:16px;border-bottom:none;">该地块暂时还没有人出价,快来竞拍吧!</li>
              <template >
                <li v-for="item in priceList" :key="item.id" :class="{myDDC:item.walletAddr==$store.state.userInfo.walletAddr}">
                  <span >{{item.walletAddr}} </span>
                  <!-- <i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i> -->
                  <!-- <span v-if="item.walletAddr==$store.state.userInfo.walletAddr"> </span> -->
                  <!-- <br> -->
                  <span v-if="item.price" class="ddc">{{item.price}} DDC &nbsp;&nbsp;<i v-if="item.walletAddr==$store.state.userInfo.walletAddr">(我)</i></span>
                  
                  <span>{{dateFormat(item.priceTime,'M-dd hh:mm:ss')}}</span>
                </li>
              </template>
              
            </div>

            <li class="set-price"><i></i>我要竞拍 <span>最低加价 {{$store.getters.currentGround.minAddPrice}} DDC</span></li>
            <div class="input-p">
              <!-- <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input><br/> -->
              <!-- :min="topPrice" -->
              <el-input-number v-model="inputPrice" :step="$store.getters.currentGround.minAddPrice"  readonly="true"></el-input-number>
              <span class="help-text" >{{helpText}}</span>
            </div>
            
        </ul>
        <!-- <p style="display:none">{{endTime}}</p> -->
        <button type="primary"  :class="{'set-price-btn':true,active:inputActive}" :loading="btnLoading" @click="inputPriceClick()">
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
import dateFormat from "@/util/dateF";
export default {
  name: "GroundStep2",
  props: ["landid", "priceList","PriceLoading"],
  data() {
    return {
      dateFormat,
      inputPrice: 0,
      inputActive: true, //是否可以竞价
      //  collectionActive:false,
      refreshActive: false, //刷新中的动画,true 是有
      refreshPriceCount: 0, //刷新等待剩余时间,默认 0 是可以立即点的
      inputPriceCount: 0, //竞价剩余等待时间
      noPriceList: "",
      states: ["未开拍", "拍卖中", "已拍卖", "已拍卖"],
      topPrice: 0,
      helpText: "",
      // ishelp:false, //help文字显示,
      // timeOut: 0, //超时计时器
      timer: 0, //倒计时器

      reTime: null,
      time60: 0,
      endTime: "",
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
      retimer10: -1,
      ptime: 0,
      // newState:null,
      btnDisable:false,
    };
  },
  computed: {
    refreshTime: function() {
      if (
        this.land() &&
        this.land().isMark == 2
      ) {
        return 10;
      }
      return 60;
    },
  },
  mounted() {

    clearInterval(this.ptime);
    // debugger;
    clearInterval(this.retimer10);
    clearInterval(this.timer);
    clearInterval(this.time60);
    this.refreshPriceCount = this.refreshTime;
    // console.log("66666");
    // console.log('id',this.landid)
    // this.get_five_price();
    //this.refresh2();

    if (this.land().endTime) {
      this.getT();
      this.timer = setInterval(() => {
        this.getT();
      }, 1000);
    }
    this.retimer10 = setInterval(() => {
      this.refresh2();
      // console.log(2222222)
    }, this.refreshTime * 1000); //请求刷新

    this.refreshPriceCount = this.refreshTime;
    this.ptime = setInterval(() => {
      // console.log(this.ptime, this.refreshPriceCount);
      if (this.refreshPriceCount == 0) {
        this.refreshPriceCount = this.refreshTime;
        clearInterval(this.ptime);
        this.refreshActive = false;
      }
      this.refreshPriceCount--;
    }, 1000);

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
          30000 * this.inputPriceCount
        );
        if (this.inputPriceCount <= 0) {
          clearInterval(this.time60);
          this.inputActive = true;
        }
      }, 1000);
    }

    this.priceChage();
  },
  destroyed() {
    clearInterval(this.ptime);
    // debugger;
    clearInterval(this.retimer10);
    clearInterval(this.timer);
    clearInterval(this.time60);
  },
  watch: {

    landid: function(value, oldvalue) {
      // console.log(value, oldvalue);
      this.priceChage();
      clearInterval(this.timer);
      this.reTime = null;
      if (this.land().endTime) {
        this.getT();
        this.timer = setInterval(() => {
          this.getT();
        }, 1000);
      }

      clearInterval(this.retimer10);
      clearInterval(this.ptime);
      this.refreshPriceCount = this.refreshTime;
      // this.refresh2();
      this.retimer10 = setInterval(() => {
        this.refresh2();
      }, this.refreshTime * 1000);
      this.refreshPriceCount = this.refreshTime;
      this.ptime = setInterval(() => {
        // console.log(this.ptime, this.refreshPriceCount);
        if (this.refreshPriceCount == 0) {
          this.refreshPriceCount = this.refreshTime;
          clearInterval(this.ptime);
          this.refreshActive = false;
        }
        this.refreshPriceCount--;
      }, 1000);
    },

    priceList() {
      this.helpText = ''
      if(this.priceList.length ==0){
        return false;
      }
      console.log("change");
      this.priceChage();
      clearInterval(this.ptime);
      // debugger;
      clearInterval(this.retimer10);
      clearInterval(this.timer);

      this.refreshPriceCount = this.refreshTime;
      // console.log("66666");
      // console.log('id',this.landid)
      // this.get_five_price();
      //this.refresh2();

      if (this.land()) {
        this.getT();
        this.timer = setInterval(() => {
          this.getT();
        }, 1000);
      }
      this.retimer10 = setInterval(() => {
        this.refresh2();
        // console.log(2222222)
      }, this.refreshTime * 1000); //请求刷新
      
      this.refreshPriceCount = this.refreshTime;
      this.ptime = setInterval(() => {
        // console.log(this.ptime, this.refreshPriceCount);
        if (this.refreshPriceCount == 0) {
          this.refreshPriceCount = this.refreshTime;
          clearInterval(this.ptime);
          this.refreshActive = false;
        }
        this.refreshPriceCount--;
      }, 1000);
    },
  },
  methods: {
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
    getT() {
      var land=this.land()
      if (land && land.endTime) {
        this.endTime = land.endTime;
        // console.log("this.endTime", this.endTime);
        var start = new Date();
        if (this.$store.state.ctime) {
          var localNow = new Date().getTime();
          if (localNow > this.$store.state.ctimer) {
            var diff = localNow - this.$store.state.ctimer;
            start = new Date(this.$store.state.ctime + diff);
          }
        }
        var end = new Date(
          this.endTime
            .replace(/-/g, "/")
            .replace(/T|Z/g, " ")
            .trim()
        );
        var res = getTime(start, end);
        if (
          res.totalTime <= 0 &&
          land.state == 1
        ) {
          // debugger;
          clearInterval(this.timer);
          // debugger;
          this.land_over();
          // this.$store.dispatch("setData", { state: "groundStep", data: 3 });
        }else if(res.totalTime <= 0){
          this.reTime = ''
        }
         else {
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
      this.$emit("refreshLand");
      if (this.priceList.length > 0) {
        if (this.$store.state.userInfo.id == this.priceList[0].userId) {
          this.$http
            .get("/auction/api/user/craeteTransactionByLandId", {
              params: {
                landId: this.$store.state.currentGroundID
              },
              timeOut: 5000
            })
            .then(res => {
              if (res.data.code == 1) {
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

    goArea: function() {
      this.$emit("goArea", "2");
      this.$store.dispatch("setData", { state: "groundIn", data: false });
    },
    priceChage() {
      var land=this.land();
      this.refreshActive = false;
      var old = this.topPrice;
      // debugger;
      console.log('price',land.priceCount)
      if (land.priceCount > 0) {
        // debugger;
        if (this.$store.getters.currentLabel) {
          this.$store.getters.currentLabel.setContent(
            parseInt(land.topPrice / 1000) + "k"
          );
        }
        // console.log("222", this.priceList, this.priceList.length > 0);
        this.topPrice =
          parseInt(land.topPrice) +
          parseInt(land.minAddPrice);
      } else {
        // console.log("333", this.priceList, this.priceList.length > 0);
        this.topPrice = land.startPrice;
      }

      this.inputPrice = this.topPrice;
    },
    refresh2() {
      this.refreshPriceCount = this.refreshTime;
      clearInterval(this.ptime);
      this.ptime = setInterval(() => {
        // console.log(this.ptime, this.refreshPriceCount);

        if (this.refreshPriceCount == 0) {
          this.refreshPriceCount = this.refreshTime;
          clearInterval(this.ptime);
          this.refreshActive = false;
        }
        this.refreshPriceCount--;
      }, 1000);
      // this.get_land_detail();
      this.$emit("getPrice");
      // this.get_five_price(res => {
      //   // console.log("this.topPrice", this.topPrice);
      //   // this.refreshActive = false;
      //   if (this.topPrice < res) {
      //     this.$message({
      //       showClose: true,
      //       message: "当前最高价是" + res,
      //       type: "info"
      //     });
      //   }
      // });
    },
    inputPriceClick() {
      this.helpText = ''
      if(this.btnDisable) return false;

      if (!this.inputActive) {
        return false;
      }
      if (this.priceList.lenght > 0) {
        // debugger;
        this.topPrice =
          parseInt(this.priceList[0].price) +
          parseInt(this.land().minAddPrice);
      } else {
        this.topPrice = this.land().startPrice;
      }

      console.log('inputPrice',parseInt(this.inputPrice))
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
      this.btnDisable=true;
      //出价
      this.set_price(() => {
        setCookie("inputPriceCount", 30, 1000 * 30);
        this.inputActive = false;
        this.inputPriceCount = parseInt(getCookie("inputPriceCount"));
        this.time60 = setInterval(() => {
          if (this.inputPriceCount > 0) {
            this.inputPriceCount -= 1;
            setCookie(
              "inputPriceCount",
              this.inputPriceCount,
              30000 * this.inputPriceCount
            );
          } else {
            clearInterval(this.time60);
            this.inputActive = true;
          }
        }, 1000);
      });
    },
    // get_land_detail() {
    //   // console.log('lid',lid)
    //   var vthis = this;
    //   this.$http
    //     .get("/auction/api/land/getByLandId", {
    //       params: {
    //         userId: this.$store.state.userInfo.id,
    //         landId: this.$store.state.currentGroundID
    //       },
    //       timeOut: 5000
    //     })
    //     .then(function(res) {
    //       if (res.data.code == 1) {
    //         // console.log('地块详情:',res.data.data);
    //         // debugger;
    //         var land = res.data.data.land;
    //         var startTime = new Date(land.startTime);
    //         var now = new Date();
    //         if (startTime < now && land.state == 0) {
    //           land.state = 1;
    //         }
    //         if (land.endTime) {
    //           var end = new Date(land.endTime);
    //           if (end < now) {
    //             land.state = 2;
    //           }
    //         }
    //         vthis.$store.dispatch("setData", {
    //           state: "currentGroundDetail",
    //           data: land
    //         });

    //         var PayLoad = vthis.$store.getters.currentPayLoad;
    //         var label = vthis.$store.getters.currentLabel;
    //         var status = res.data.data.land.state;
    //         var topPrice = res.data.data.land.topPrice;
    //         // PayLoad.setFillColor(vthis.ployStyle[status].fillColor);
    //         label.setContent(parseInt(topPrice / 1000) + "k");
    //       } else {
    //         vthis.$message({
    //           showClose: true,
    //           message: res.data.msg,
    //           type: "error"
    //         });
    //       }
    //     })
    //     .catch(function(err) {
    //       // console.log(err);
    //     });
    // },
    set_price(call) {
      var vthis = this;
      
      // console.log(this.$store.state.currentGroundID)
      this.$http
        .post(
          "/auction/api/land/acting",
          {
            money: parseInt(this.inputPrice),
            userId: this.$store.state.userInfo.id,
            landId: this.$store.state.currentGroundID
          },
          { timeOut: 5000 }
        )
        .then(res => {
          // console.log(res.data);
          // console.log('/api/land/acting/'+parseInt(vthis.inputPrice)+'/5/'+vthis.$store.state.currentGroundID)
          console.log("出价之后", res.data);
          this.btnDisable =false;
          this.refreshPriceCount = this.refreshTime;
          clearInterval(this.retimer10);
          this.refresh2();
          this.retimer10 = setInterval(() => {
            this.refresh2();
            // console.log(222222, this.refreshTime);
            // console.log(2222222)
          }, this.refreshTime * 1000);
          if (res.data.code == 1) {
            // vthis.priceList = res.data.data
            var data = res.data.data;
            vthis.btnLoading = false;

            vthis.$store.dispatch("chageUserInfo", {
              ableDdc: data.ableDdc,
              freezeDdc: data.freezeDdc,
              allDdc: data.ableDdc + data.freezeDdc
            });
             setCookie(
                        "userInfo",
                        JSON.stringify(this.$store.state.userInfo),
                        1000 * 60 * 60 * 24
                      );
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
          } else if(res.data.code == 0){
            if (call) call();
            vthis.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          } else {
            // vthis.refreshPrice();
            // vthis.get_five_price();
            // vthis.get_land_detail();
            vthis.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(function(err) {
          this.btnDisable =false;
          console.log(err);
          vthis.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    }
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
