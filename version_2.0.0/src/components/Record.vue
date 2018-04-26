<template>
  <div class="infoWindow">
    <div class="info-head">
      <span @click="$store.dispatch('setGroundShowDetail')">
        交易信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >

        <div class="info-msg no-record" v-if="!$store.getters.currentGround">
          <img src="~assets/icons/icon-no.png" >
          <p>抱歉,您当前暂无收藏/交易记录</p>
        </div>
        
        <template  v-if="$store.getters.currentGround">
          <ul class="info-msg">
            <li><i></i>地块编号 <span>{{$store.getters.currentGround.signId}}</span></li>
            <li v-if="$store.getters.currentGround.classify"><i></i>地块类型 <span>{{$store.getters.currentGround.classify}}</span></li>
            <li class="record-id"><i></i>交易流水号 <span>{{$store.getters.currentGround.transactionRecord.serialNumber}}</span></li>
            <li><i></i>金额 <span>{{$store.getters.currentGround.transactionRecord.price}} DDC</span></li>
            <li ><i></i>交易状态 <span>已拍卖 {{$store.getters.currentGround.transactionRecord.state?'已支付':'待支付'}}</span></li>
            <li v-show="$store.getters.currentGround.transactionRecord.state"><i></i>交易时间 <span>{{$store.getters.currentGround.transactionRecord.transactionTime}}</span></li>
            <li v-show="!$store.getters.currentGround.transactionRecord.state"><i></i>交易剩余时间 <span>{{reTime}}</span></li>
          </ul>
          <div v-show="!$store.getters.currentGround.transactionRecord.state">
            <button @click="goPay">确认支付</button>
          </div >
          
          <div v-show="$store.getters.currentGround.transactionRecord.state" class="ground-owner">
            <span>{{$store.state.userInfo.walletAddr}}</span>
          </div>
        </template>

      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
import getTime from "@/util/getTime";
import {setCookie,getCookie,delCookie} from '@/util/util'
export default {
  name: "Record",
  data() {
    return {
      timer: 0,
      endTime: null,
      reTime: 0
    };
  },
  computed: {
    landid: function() {
      return this.$store.state.currentGroundID;
    }
  },
  mounted() {
    // debugger;
    this.getT();
    this.timer = setInterval(() => {
      this.getT();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {
    landid(news, old) {
      if (this.$store.getters.currentGround.transactionRecord.state == 0) {
        clearInterval(this.timer);
        this.getT();
        this.timer = setInterval(() => {
          this.getT();
        }, 1000);
      }
      // console.log(news,old)
    }
  },
  methods: {
    getT() {
      // debugger;
      this.endTime = this.$store.getters.currentGround.transactionRecord
        .overdueTime
        ? this.$store.getters.currentGround.transactionRecord.overdueTime
        : new Date().getTime() + 24 * 3600 * 1000;
      var start = new Date();
      var end = new Date(this.endTime);
      var res = getTime(start, end);
      // console.log(res)

      if (res.totalTime < 0) {
        // debugger;
        clearInterval(this.timer);
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
      // console.log(this.reTime)
    },
    refreshState() {
      this.$emit("renderRecords");
    },
    goPay() {
      var vthis = this;
      this.$confirm(
        "您将支付" +
          this.$store.getters.currentGround.transactionRecord.price +
          "DDC, 是否继续?",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success"
        }
      )
        .then(() => {
          return this.$http
            .post(
              "/auction/api/user/payForLand/" ,
              {
                userId:this.$store.state.userInfo.id,
                landId:this.$store.state.currentGroundID
              },
              { timeOut: 5000 }
            )
            .then((res) =>{
              if (res.data.code ==1) {
                vthis.$store.dispatch("chageUserInfo", {
                  allDdc: res.data.data.all_ddc,
                  freezeDdc: res.data.data.freeze_ddc,
                  ableDdc: res.data.data.all_ddc - res.data.data.freeze_ddc
                });

                setCookie(
                      "userInfo",
                      JSON.stringify(vthis.$store.state.userInfo),
                      1000 * 60 * 60 * 24
                    );
                vthis.refreshState();
                
                vthis.$message({
                  type: "success",
                  message: "支付成功!"
                });
              } else {
                vthis.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            })
            .catch((err) =>{
              console.log(err);
              vthis.$message({
                showClose: true,
                message: err.message,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "支付已取消"
          });
        });
    }
  }
};
</script>
<style scoped>

</style>
