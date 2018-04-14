<template>
  <div class="infoWindow">
    <template v-if="!records[0]">
      <ul class="info-msg" >
        <li><span>交易信息</span></li>
        <img src="~assets/icons/icon-no.png" >
        <p>抱歉,您当前暂无收藏/交易记录</p>
      </ul>
    </template>
    <template  v-if="records">
      <ul class="info-msg">
        <li><span>交易信息</span></li>
        <li><i></i>地块编号 <span>0xWX4EYEFP1BHQ</span></li>
        <li><i></i>地块类型 <span>大型</span></li>
        <li><i></i>交易流水号 <span>132153151313</span></li>
        <li><i></i>金额 <span>5000 DDC</span></li>
        <li ><i></i>交易状态 <span>{{records[0].status?'已支付':'待支付'}}</span></li>
        <li v-if="records[0].status"><i></i>交易时间 <span>2018/4/9 9:26:73</span></li>
        <li v-if="!records[0].status"><i></i>交易剩余时间 <span>10:12:23</span></li>
      </ul>
      <div v-if="!records[0].status">
        <button>确认支付</button>
      </div >
      
      <div v-if="records[0].status" class="ground-owner">
        <span>153****7894</span>
      </div>
    </template>

    

  </div>
</template>

<script>
export default {
  name: 'Record',
  data () {
    return { 
    }
  },
  methods:{
    goArea:function(){
      this.$emit('goArea','1')
    }
  },
  props:["records"]
}
</script>
<style scoped>

</style>
