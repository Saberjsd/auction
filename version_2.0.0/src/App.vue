<template>
  <div id="app" class="app">
    <template v-if="isPhone||isltIE9">
      你的浏览器不支持本网站
    </template>
    <template v-else-if="isDebug">
      为了网站安全,本网站禁止了调试功能
    </template>
    <template v-else> 
          <router-view/>
    </template>


  </div>
</template>

<script>
//import Vue from "vue";
// import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

// Vue.use(Element);

import brower from './util/ieTest'

export default {
  name: "App",
  data(){
    return {
      isPhone:false,
      isltIE9:false,
      isDebug:false,
    }
  },
  mounted(){
        var isPhone= brower.browserRedirect();
        if(isPhone){
          this.isPhone=true;
        }
        var vthis=this;
        window.addEventListener("devtoolschange",function(e){
        if(e.detail.open){
                    // document.getElementById("app").style.display='none'
                    vthis.isDebug=true;
                    // console.log('open');
        }else{
          vthis.isDebug=false;
            // document.getElementById("app").style.display='block'
            // console.log('close');
        }
        })
  }
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
h1, h2, h3, h4, h5, h6 { font-size: 100%; font-weight: normal;}
/** 重置列表元素 **/
ul, ol { list-style: none; }
/** 重置文本格式元素 **/
ul,li{list-style: none;}
a { text-decoration: none; }
a:hover { text-decoration: none; }
.app {
  font-family: "Microsoft YaHei" ,"MicrosoftYaHeiUI",MicrosoftYaHeiUI, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body,html,.app{width: 100%;height: 100%;}
.el-message{
    font-size: 18px !important;
    top: 100px !important;
    /* padding: 20px 20px !important; */
  }
.el-message__content{
    font-size: 18px !important;
}
</style>
