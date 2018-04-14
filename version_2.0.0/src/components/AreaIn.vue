<template>
  <div class="infoWindow">
      <ul class="info-msg">
        <li class="area-title"><span>区域信息</span></li>
        <li><i></i>区域编号 <span>0x123156131FDS</span></li>
        <li><i></i>总地块数 <span>100</span></li>
        <li><i></i>未开拍的地块数 <span>60</span></li>
        <li><i></i>拍卖中的地块数 <span>30</span></li>
        <li><i></i>已拍卖的地块数 <span>10</span></li>
      </ul>
      <button @click="chageGroundStep">进入该区域</button>
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
      // this.$emit('chageGroundStep','3')
    }
  }
}
</script>

<style scoped>


</style>
