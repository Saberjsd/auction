<template>
  <div class="infoWindow">
    <ul class="info-msg">
        <li><i @click="goArea"></i><span>地块信息</span><b class="collection"></b></li>
        <li><i></i>地块编号 <span>0x123156131FDSV1531</span></li>
        <li><i></i>地块类型 <span>中型</span></li>
        <li><i></i>地块状态 <span>未开拍</span></li>
        <li class="count-down"><i></i>开拍倒计时 <span >2天23时15分45秒</span></li>
        <li class="set-price"><i></i>我要竞拍 <span>最低加价 100 DDC</span></li>
        <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input>
      </ul>
      <button class="set-price-btn">我要出价</button>

  </div>
</template>

<script>
export default {
  name: 'GroundStep1',
  data () {
    return { 
       inputPrice:'',
    }
  },
  methods:{
    goArea:function(){
      // this.$emit('goArea','1')
      this.$store.dispatch('setAreaIn',true)
    }
  }
}
</script>
<style scoped>

</style>
