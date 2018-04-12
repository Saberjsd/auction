<template>
  <div class="sidebar">
    <ul class="sidebar-ul" @click="chageActive">
      <li :class="{active:isActive == '1'}">
        <a href="#" id="1"><i class="li-left"></i>参与拍卖</a>
      </li>
      <li :class="{active:isActive == '2'}">
        <a href="#" id="2"><i class="li-left"></i>我的收藏</a>
      </li>
      <li :class="{active:isActive == '3'}">
        <a href="#" id="3"><i class="li-left"></i>我的地块</a>
      </li>
      <li :class="{active:isActive == '4'}">
        <a href="#" id="4"><i class="li-left"></i>交易记录</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data () {
    return {
      isActive:1
    }
  },
  methods:{
    chageActive:function(e){
      if(e.target.nodeName =='A'){
        this.isActive = e.target.id
        // console.log(e.target)
      }
    }
  }
}
</script>

<style scoped>
.sidebar{
  float: left;width: 320px;position: absolute;top: 0; height: 100%;
}
.sidebar-ul{
  margin-top: 120px;font-size: 24px;
}
.sidebar-ul li{
  height: 80px;line-height: 80px;
}
.sidebar-ul li a{color: #848484;height: 80px;line-height: 80px;display: inline-block;width: 100%;}
.sidebar-ul li:nth-of-type(1) a{ background: url('~assets/icons/icon-siderbar-a.png') 68px center no-repeat;}
.sidebar-ul li:nth-of-type(2) a{ background: url('~assets/icons/icon-siderbar-b.png') 68px center no-repeat;}
.sidebar-ul li:nth-of-type(3) a{ background: url('~assets/icons/icon-siderbar-c.png') 68px center no-repeat;}
.sidebar-ul li:nth-of-type(4) a{ background: url('~assets/icons/icon-siderbar-d.png') 68px center no-repeat;}
.sidebar-ul li i{float: left;width: 8px;height: 80px;background-color: #ffffff}
/* .sidebar-ul li:hover i{background-color: #4284f7} */
.sidebar-ul li:nth-of-type(1):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-a-hover.png')}
.sidebar-ul li:nth-of-type(2):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-b-hover.png')}
.sidebar-ul li:nth-of-type(3):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-c-hover.png')}
.sidebar-ul li:nth-of-type(4):hover a{color: #4284f7;background-image: url('~assets/icons/icon-siderbar-d-hover.png')}
.sidebar-ul li.active i{background-color: #4284f7}
.sidebar-ul li:nth-of-type(1).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-a-hover.png')}
.sidebar-ul li:nth-of-type(2).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-b-hover.png')}
.sidebar-ul li:nth-of-type(3).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-c-hover.png')}
.sidebar-ul li:nth-of-type(4).active a{color: #4284f7;background-color: #e8eeff;background-image: url('~assets/icons/icon-siderbar-d-hover.png')}
</style>
