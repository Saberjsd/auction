<template>
  <div class="infoWindow">
    <div class="info-head">
      <span @click="$store.dispatch('setGroundShowDetail')">
        区域信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
      <b @click="chageGroundStep" class="go-land"></b>
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >
        <ul class="info-msg">
          <li><i></i>区域编号 <span>0x123156131FDS</span></li>
          <li><i></i>总地块数 <span>100</span></li>
          <li><i></i>未开拍的地块数 <span>60</span></li>
          <li><i></i>拍卖中的地块数 <span>30</span></li>
          <li><i></i>已拍卖的地块数 <span>10</span></li>
        </ul>
        <button @click="chageGroundStep">进入该区域</button>
      </div>
    </el-collapse-transition>

    </div>
</template>

<script>
export default {
  name: 'AreaIn',
  data () {
    return { 
      
    }
  },
  methods:{
    chageGroundStep:function(){
      this.$emit('goGround','001')
      this.$store.dispatch('setData',{state:'areaIn',data:false})
    }
  }
}
</script>

<style scoped>


</style>
