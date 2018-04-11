<template>
  <div id="app" class="app">
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
/** 清除内外边距 **/
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
form, fieldset, legend, button, input, textarea, /* form elements 表单元素 */
th, td /* table elements 表格元素 */ {
    margin: 0;
    padding: 0;
}
.app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
