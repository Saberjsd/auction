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
          <li><i></i>地块类型 <span>大型</span></li>
          <li><i></i>地块状态 <span>已拍卖</span></li>
          <li><i></i>地块拥有者</li>
        </ul>
        <div class="ground-owner">
          <span>153****7891</span>
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
       isActive:false
    }
  },
  methods:{
    goArea:function(){
      this.$emit('goArea','1')
      this.$store.dispatch('setData',{state:'areaIn',data:true})
    }
  }
}
</script>
<style scoped>

</style>
