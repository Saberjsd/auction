<template>
  <div>
    <div class="header">
      <h1 class="header-title">在"创世纪城"中挑选你的梦想领地</h1>
      <p style="color:#8f9199;">去中心化虚拟土地市场。免交易费。</p>
      <router-link to="auction_map" class="toNow">现在就开始</router-link>
    </div>
    <div class="nav">
      <div class="nav-top">
        <h3>最新上架虚拟土地</h3>
        <router-link to="">
          <span role="button">查看更多&nbsp;></span>
        </router-link>
      </div>
      <div class="nav-content">
        <router-link to="detail" class="nav-box">
          <div class="box-img">
            <img src="http://api.map.baidu.com/staticimage/v2?ak=F2oOX8uxAEObmO430kX60nsQNiipp6N7&center=-73.861641,40.885714&width=220&height=150&zoom=13" alt="">            
          </div>
        </router-link>
        <router-link to="detail" class="nav-box">
          <div class="box-img">
            <img src="http://api.map.baidu.com/staticimage/v2?ak=F2oOX8uxAEObmO430kX60nsQNiipp6N7&width=220&height=150&center=-73.857482,40.888277&zoom=16&paths=-73.85962,40.88915;-73.856844,40.888277;-73.857203,40.887623;-73.85997,40.888509;&pathStyles=0x000fff,2,0.5,0xff0000" alt="">            
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a{
  text-decoration: none;
}
.header::before{
  content: ' ';width: 0;height: 0;display: table;
}
.header{
  width: 100%;height: 500px;
  background: #151823 url(~img/home-bg.png) 0 center no-repeat;
  background-size: 100%;
}
.header-title{
  margin-top: 80px;color: white;
}
.toNow{
  display: inline-block;width: 125px;height: 42px;text-align: center;color: white;
  background: #ff4130;border-radius: 10px; line-height: 42px;
}

.nav::before{
  content: ' ';width: 0;height: 0;display: table;
}
.nav{
  width: 100%;height: 320px;background: #151823;
}
.nav-top{
  width: 1180px;height: 50px;margin:0 auto;color: white;line-height: 50px;
}
.nav-top>h3{
  float: left; font-weight: 400;margin: 0;margin-left: 50px;
}
.nav-top>a{
  float: right;color: #ff4130;
}

.nav-content{
  height: 230px;width: 1180px;margin: 0 auto;
}
a.nav-box{
  float: left;width: 220px;height: 220px;background: #2e3447;
  margin-left: 50px;color: white;
}

</style>
