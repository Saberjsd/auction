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
    </el-collapse-transition>

    
  </div>
</template>

<script>
export default {
  name: 'GroundStep2',
  data () {
    return { 
       inputPrice:'',
       isActive:false,
       priceList:[
        {uid:5,uname:'Tom',price:'23000',time:'2018/4/9 9:26:73'},
        {uid:4,uname:'Kaite',price:'22000',time:'2018/4/9 9:25:45'},
        {uid:3,uname:'Jack',price:'20000',time:'2018/4/9 9:23:05'},
        {uid:2,uname:'Anni',price:'25000',time:'2018/4/9 9:20:03'},
        {uid:1,uname:'Garen',price:'30000',time:'2018/4/9 9:20:00'}
      ],
    }
  },
  methods:{
    goArea:function(){
      this.$emit('goArea','2')
      this.$store.dispatch('setData',{state:'areaIn',data:true})
    },
  
  }
}
</script>
<style scoped>

</style>
