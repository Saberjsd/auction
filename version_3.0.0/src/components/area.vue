<template>
  <div class="infoWindow">
    <div class="info-head">
      <span @click="$store.dispatch('setGroundShowDetail')">
        区域信息
        <em :class="{active:!isShowDetail}"></em>
      </span>
      <b @click="chageGroundStep" class="go-land"></b>
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="isShowDetail" >
        <ul class="info-msg">
          <!-- <li><i></i>区域编号 <span>0x123156131FDS</span></li> -->
          <li><i></i>总地块数 <span>{{Area.landSum}}</span></li>
          <li><i></i>未开拍的地块数 <span>{{Area.unActionCount}}</span></li>
          <li><i></i>拍卖中的地块数 <span>{{Area.actingCount}}</span></li>
          <li><i></i>已拍卖的地块数 <span>{{Area.actedCount}}</span></li>
        </ul>
        <button @click="chageGroundStep">进入该区域</button>
      </div>
    </el-collapse-transition>

    </div>
</template>

<script>
export default {
  name: 'AreaIn',
  props:["Area"],
  data () {
    return { 
      
    }
  },
  methods:{
    chageGroundStep:function(){
      // debugger;
      this.$emit('goGround','001')
      
    }
    

  },
  computed:{
      isShowDetail(){
          return this.$store.state.groundShowDetail;
      }
  },
  mounted(){
    // console.log(this.$store.state.areaDatail)
  }
}
</script>

<style scoped>


</style>
