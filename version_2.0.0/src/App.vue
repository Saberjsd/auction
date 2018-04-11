<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Vue from "vue";
// import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

// Vue.use(Element);

export default {
  name: "App"
};
</script>

<style>
body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* 登录遮罩 */
.el-loading-mask{
  background-color: rgba(0 ,0 ,0 ,.3) !important;
}
.el-loading-mask p{
  color: white !important;
}
.el-loading-mask .path {
  stroke:white !important;
}
</style>
