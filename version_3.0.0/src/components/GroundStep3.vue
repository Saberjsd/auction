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
          <li><i></i>地块拥有者</li>
        </ul>
        <div class="ground-owner">
          <span>{{owner}}</span>
        </div>

      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
export default {
  name: "GroundStep1",
  data() {
    return {
      inputPrice: "",
      //  collectionActive:false,
      states: ["未开拍", "拍卖中", "已拍卖 待支付", "已拍卖 已支付"],
      owner: ""
    };
  },
  props: ["landid"],
  mounted() {
    if (this.landid) {
      this.get_owner();
    }
  },
  watch: {
    landid: function(val, old) {
      this.get_owner();
    }
  },
  methods: {
    get_owner() {
      // debugger;
      if (this.$store.getters.currentGround.hasOwnProperty("userId")) {
        if (this.$store.getters.currentGround.userId == 0) {
          this.owner = "系统资产";
        } else{
          // debugger;
          this.$http
            .get(
              "/auction/api/user/getWalletAddrById/" +
                this.$store.getters.currentGround.userId
            )
            .then(res => {
              if (res.data.code) {
                this.owner = res.data.data;
              }
            });
        }
      }
    },
    collectionClick(){
      var vthis = this;
      if(!this.$store.state.landIsCollected){
        // console.log
        this.$http.get('/auction/api/collect/collectLand/'+this.$store.state.userInfo.id+'/'+this.$store.state.currentGroundID)
                .then(function (res) {
                  if(res.data.code){
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
                      message: '您已经收藏过了',
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
        this.$http.get('/auction/api/collect/cancelCollect/'+this.$store.state.userInfo.id+'/'+this.$store.state.currentGroundID)
                .then(function (res) {
                  if(res.data.code){
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
                      message: '取消收藏失败',
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
    goArea: function() {
      this.$emit("goArea", "1");
      this.$store.dispatch("setData", { state: "groundIn", data: false });
    }
  }
};
</script>
<style scoped>

</style>
