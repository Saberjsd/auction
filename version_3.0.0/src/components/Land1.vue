<template>
    <div class="infoWindow">   
        <div class="info-head">
            <i @click="goArea"></i>
            <span @click="clickHeader()">
                地块信息
                <em :class="{active:isCollapse}"></em>
            </span>
            <b :class="{collection:true,active:isCollected}" @click="collectionClick"></b>
        </div>
        <el-collapse-transition>
            <div class="info-body" v-show="isCollapse">
            <ul class="info-msg">
          <li><i></i>地块编号 <span>{{land.signId}}</span></li>
          <li><i></i>地块类型 <span>{{land.types}}</span></li>
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
import getTime from "@/util/getTime";
export default {
  props: ["land"],
  data() {
    return {
      states: ["未开拍", "拍卖中", "已拍卖", "已拍卖"],
      timer: -1,
      type: {
        "1": "特殊地块",
        "2": "标志地块"
      },
      reTime: ""
    };
  },
  computed: {
    isCollected() {
      return this.land.landIsCollected;
    },
    isCollapse() {
      return this.$store.state.groundShowDetail;
    },
    types() {
      if (this.land) {
        var mark = this.land.isMark;
        if (mark == 0) {
          return this.land.classify;
        } else {
          return this.type[mark];
        }
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    if (this.land) {
      this.getT();
      this.timer = setInterval(() => {
        this.getT();
      }, 1000);
    }
  },
  methods: {
    goArea() {
      //返回到区域
    },
    /**@description 点击收藏 */
    collectionClick() {},
    getT() {
      var date = this.time();
      if (date.totalTime <= 0) {
        this.reTime = "";
        clearInterval(this.timer);
        this.$emit("refreshHot");
      } else {
        this.reTime =
          date.days +
          "天" +
          date.hours +
          "时" +
          date.minutes +
          "分" +
          date.seconds +
          "秒";
      }
    },
    time() {
      var start = new Date();
      if (this.$store.state.ctime) {
        var localNow = new Date().getTime();
        if (localNow > this.$store.state.ctimer) {
          var diff = localNow - this.$store.state.ctimer;
          start = new Date(this.$store.state.ctime + diff);
        }
      }
      var end = this.land.startTime;
      if (!end) {
        end = new Date();
      } else {
        end = new Date(end);
      }
      return getTime(start, end);
    },
    collect() {
      var user = this.$store.state.userInfo.id;
      return this.$http
        .get('/auction/api/collect/collectLand"+/' + user + "/" + this.land.id)
        .then(data => data.data)
        .then(data => {
          if (data.code) {
            return true;
          } else {
            return false;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    uncollect() {
      return this.$http
        .get(
          '/auction/api/collect/cancelCollect"+/' + user + "/" + this.land.id
        )
        .then(data => data.data)
        .then(data => {
          if (data.code) {
            return true;
          } else {
            return false;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style>

</style>

