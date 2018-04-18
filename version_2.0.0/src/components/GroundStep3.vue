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
          <li><i></i>地块拥有者</li>
        </ul>
        <div class="ground-owner">
          <span>ALqFfi2NeACS3AQYDBkv2WjL4e3TyWkQ3c</span>
        </div>

      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
export default {
  name: 'GroundStep1',
  data () {
    return { 
       inputPrice:'',
       collectionActive:false,
       states:["未开拍","拍卖中","已拍卖","已拍卖"],
    }
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
    }
  }
}
</script>
<style scoped>

</style>
