<template>
  <div class="infoWindow">

    <div class="info-head">
      <i @click="goArea"></i>
      <span @click="$store.dispatch('setGroundShowDetail')">
        地块信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
      <b :class="{collection:true,active:isActive}" @click="isActive =! isActive"></b>
      
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >
        <ul class="info-msg">
          <li><i></i>地块编号 <span>0xWX4EYEFP1BHQ</span></li>
          <li><i></i>地块类型 <span>中型</span></li>
          <li><i></i>地块状态 <span>未开拍</span></li>
          <li class="count-down"><i></i>开拍倒计时 <span >2天23时15分45秒</span></li>
          <li class="set-price"><i></i>我要竞拍 <span>最低加价 100 DDC</span></li>
          <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input>
        </ul>
        <button class="set-price-btn">我要出价</button>
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
       isActive:false
    }
  },
  methods:{
    goArea:function(){
      this.$emit('goArea','1')
      this.$store.dispatch('setData',{state:'areaIn',data:true})
    },
    // showToggle:function(){
    //   this.$store.dispatch('setGroundShowDetail')
    // }
  }
}
</script>
<style scoped>

</style>
