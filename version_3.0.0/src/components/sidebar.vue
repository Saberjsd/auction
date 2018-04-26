<template>
  <div class="sidebar">
    <ul class="sidebar-ul" @click="chageActive">
      <li :class="{active:$store.state.sidebars == '01'}">
        <a href="#" id="01"><i class="li-left"></i>参与拍卖</a>
      </li>
      <li :class="{active:$store.state.sidebars == '02'}">
        <a href="#" id="02"><i class="li-left"></i>我的收藏</a>
      </li>
      <li :class="{active:$store.state.sidebars == '03'}">
        <a href="#" id="03"><i class="li-left"></i>我的地块</a>
      </li>
      <li :class="{active:$store.state.sidebars == '04'}">
        <a href="#" id="04"><i class="li-left"></i>我的订单</a>
      </li>
      <li :class="{active:$store.state.sidebars == '05'}">
        <a href="#" id="05"><i class="li-left"></i>标志地块</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // props:["isActive"],
  name: 'Sidebar',
  data () {
    return {
      //isActive:'01'
    }
  },
  methods:{
    chageActive:function(e){
      if(e.target.nodeName =='A'){
        //this.isActive = e.target.id
        // console.log(e.target)
        // this.$store.dispatch('setData',{state:'sidebars',data:e.target.id})
        // console.log(this.$store.state.sidebars)
        // console.log(this.$store.getters.currentGround)
        this.$emit('chageSidebar',e.target.id)
        
      }
    }
  }
}
</script>

<style scoped>
.sidebar{
  float: left;width: 260px;position: absolute;top: 0; height: calc(100% - 60px);margin-top: 60px;
  background-color: #ffffff;box-shadow:3px 1px 3px rgba(0,0,0,.15);z-index: 1000;
}
.sidebar-ul{
  margin-top: 75px;font-size: 24px;
}
.sidebar-ul li{
  height: 80px;line-height: 80px;
}
.sidebar-ul li a{color: #848484;height: 80px;line-height: 80px;display: inline-block;width: 100%;}
.sidebar-ul li:nth-of-type(1) a{ background: url('~assets/icons/icon-siderbar-a.png') 44px center no-repeat;}
.sidebar-ul li:nth-of-type(2) a{ background: url('~assets/icons/icon-siderbar-b.png') 44px center no-repeat;}
.sidebar-ul li:nth-of-type(3) a{ background: url('~assets/icons/icon-siderbar-c.png') 44px center no-repeat;}
.sidebar-ul li:nth-of-type(4) a{ background: url('~assets/icons/icon-siderbar-d.png') 44px center no-repeat;}
.sidebar-ul li:nth-of-type(5) a{ background: url('~assets/icons/icon-siderbar-e.png') 44px center no-repeat;}
.sidebar-ul li i{float: left;width: 8px;height: 80px;background-color: #ffffff}
/* .sidebar-ul li:hover i{background-color: #4284f7} */
.sidebar-ul li:nth-of-type(1):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-a-hover.png')}
.sidebar-ul li:nth-of-type(2):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-b-hover.png')}
.sidebar-ul li:nth-of-type(3):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-c-hover.png')}
.sidebar-ul li:nth-of-type(4):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-d-hover.png')}
.sidebar-ul li:nth-of-type(5):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-e-hover.png')}
.sidebar-ul li.active i{background-color: #4284f7}
.sidebar-ul li:nth-of-type(1).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-a-hover.png')}
.sidebar-ul li:nth-of-type(2).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-b-hover.png')}
.sidebar-ul li:nth-of-type(3).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-c-hover.png')}
.sidebar-ul li:nth-of-type(4).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-d-hover.png')}
.sidebar-ul li:nth-of-type(5).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-e-hover.png')}
</style>
