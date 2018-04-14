<template>
  <div class="infoWindow">
    <ul class="info-msg">
        <li><i @click="goArea"></i><span>地块信息</span><b class="collection"></b></li>
        <li><i></i>地块编号 <span>0xWX4EYEFP1BHQ</span></li>
        <li><i></i>地块类型 <span>大型</span></li>
        <li><i></i>地块状态 <span>已拍卖</span></li>
        <li><i></i>地块拥有者</li>
      </ul>
      <div class="ground-owner">
        <span>153****7891</span>
      </div>
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
      this.$emit('goArea','1')
    }
  }
}
</script>
<style scoped>

</style>
