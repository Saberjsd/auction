<template>
  <div class="infoWindow">
    <div class="info-head">
      <span @click="$store.dispatch('setGroundShowDetail')">
        交易信息
        <em :class="{active:!$store.state.groundShowDetail}"></em>
      </span>
    </div>

    <el-collapse-transition>
      <div class="info-body" v-show="$store.state.groundShowDetail" >

        <div class="info-msg no-record" v-if="!$store.getters.currentGround">
          <img src="~assets/icons/icon-no.png" >
          <p>抱歉,您当前暂无收藏/交易记录</p>
        </div>
        
        <template  v-if="$store.getters.currentGround">
          <ul class="info-msg">
            <li><i></i>地块编号 <span>0xWX4EYEFP1BHQ</span></li>
            <li><i></i>地块类型 <span>大型</span></li>
            <li class="record-id"><i></i>交易流水号 <span>132153151313</span></li>
            <li><i></i>金额 <span>5000 DDC</span></li>
            <li ><i></i>交易状态 <span>{{$store.getters.currentGround.status?'已支付':'待支付'}}</span></li>
            <li v-show="$store.getters.currentGround.status"><i></i>交易时间 <span>2018/4/9 9:26:73</span></li>
            <li v-show="!$store.getters.currentGround.status"><i></i>交易剩余时间 <span>10:12:23</span></li>
          </ul>
          <div v-show="!$store.getters.currentGround.status">
            <button @click="goPay">确认支付</button>
          </div >
          
          <div v-show="$store.getters.currentGround.status" class="ground-owner">
            <span>ALqFfi2NeACS3AQYDBkv2WjL4e3TyWkQ3c</span>
          </div>
        </template>

      </div>
    </el-collapse-transition>

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
    goPay(){
      this.$confirm('您将支付5000 DDC, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '支付成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '支付已取消'
        });          
      });
    }
  },
}
</script>
<style scoped>

</style>
