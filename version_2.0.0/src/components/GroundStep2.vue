<template>
  <div class="infoWindow">
    <ul class="info-msg">
        <li><i @click="goArea"></i><span>地块信息</span><b class="collection"></b></li>
        <li><i></i>地块编号 <span>0xWX4EYEFP1BHQ</span></li>
        <li><i></i>地块类型 <span>小型</span></li>
        <li><i></i>地块状态 <span>拍卖中</span></li>
        <li class="last-price"><i></i>最近出价 <span ></span></li>
        <div class="price-count"><span>剩余竞拍时间: 22:15:12</span></div>
        <div class="price-list">
          <li v-for="item in priceList" :key="item.uid"><span>{{item.price}} DDC</span> <span>{{item.time}}</span></li>
        </div>
        <li class="set-price"><i></i>我要竞拍 <span>最低加价 100 DDC</span></li>
        <el-input class="input-price" placeholder="请输入价格" v-model="inputPrice" clearable></el-input>
      </ul>
      <button class="set-price-btn active">我要出价</button>

  </div>
</template>

<script>
export default {
  name: 'GroundStep2',
  data () {
    return { 
       inputPrice:'',
       priceList:[
        {uid:5,uname:'Tom',price:'23000',time:'2018/4/9 9:26:73'},
        {uid:4,uname:'Kaite',price:'22000',time:'2018/4/9 9:25:45'},
        {uid:3,uname:'Jack',price:'20000',time:'2018/4/9 9:23:05'},
        {uid:2,uname:'Anni',price:'25000',time:'2018/4/9 9:20:03'},
        {uid:1,uname:'Garen',price:'30000',time:'2018/4/9 9:20:00'}
      ]
    }
  },
  methods:{
    goArea:function(){
      this.$emit('goArea','2')
    }
  }
}
</script>
<style scoped>

</style>
