<template>
  <div class="container"> 
     
    <header class="login-header">
      <div class="login-header-logo">
        <a href="#/index">
          <img src="~assets/img/logo.png" alt="">
          <span>DREAM WORLD</span>
        </a>
      </div>
    </header>
    <div class="content">

      <div class="content-left">
        <h2 class="login-text">欢迎登陆</h2>    
        <el-form :model="loginForm"  ref="loginForm" :rules="rules" class="loginForm">
          <el-form-item  prop="username">
            <img src="~assets/icons/icon-username.png" class="icon-input username">
            <el-input type="text" v-model="loginForm.username" placeholder="请输入您的手机号码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="passwd">
            <img src="~assets/icons/icon-passwd.png" class="icon-input passwd">
            <el-input type="password" v-model="loginForm.passwd"  placeholder="请输入您的密码" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="code">
            <img src="~assets/icons/icon-mouse.png" class="icon-input code">
            <el-input type="text" v-model="loginForm.code" class="input-code" placeholder="请输入右侧验证码" auto-complete="off"></el-input>
            <img src="http://iph.href.lu/206x73" class="img-code">
          </el-form-item>
          <el-form-item>
            <button type="button"  @click="submitForm('loginForm')" 
            class="loginBtn" v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在登录...">立即登录</button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="content-right">
        <p class="questions"> <i></i>还没有虚拟地球账号?</p>
        <p class="dec">通过手机扫描下方对应版本的二维码,安装虚拟地球APP立即注册;</p>
        <div class="code-download">
          <img src="~assets/img/download-android.png" alt=""><br>
          <span>安卓版本下载</span><br>
          <img src="~assets/icons/icon-android.png" alt="">
        </div>
        <div class="code-download">
          <img src="~assets/img/download-ios.png" alt=""><br>
          <span>ios版本下载</span><br>
          <img src="~assets/icons/icon-ios.png" alt="">
        </div>
      </div>

     </div> <!--content结束 -->
     <footer>
       <span>关于我们: <a href="http://www.dreamaking.net" target="_blank">www.dreamaking.net</a></span>
     </footer>
  </div>
</template>
<style>

</style>

<script>
import {setCookie,getCookie} from '@/util/util'
export default {
  name: 'Login',
  data () {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value)==false) {
        callback(new Error('请输入合法的手机号'));
      } else {
        callback();
      }
    };
    var validatePasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };  
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };  
    return {
      loginForm:{
        username: '',
        passwd: '',
        code:''
      },
      rules:{
        username:[
          { validator: validateUsername, trigger: 'blur' }
        ],
        passwd:[
          { validator: validatePasswd, trigger: 'blur' }
        ],
        code:[
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      fullscreenLoading: false
    }
  },
  methods:{
    submitForm:function(formName){
      // setCookie('user',JSON.stringify(this.loginForm),1000*60*60*24*365)
      // console.log(document.cookie)
      // console.log(getCookie('user'))
      this.$refs[formName].validate((valid) => {
        if (valid) { //前端验证合法之后
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              message: '啊哦,登录出错了..请稍后重试!',
              type: 'error'
            });
            
          }, 3000);
          
          setTimeout(() => {
            //页面跳转
            this.$router.push({ path: 'index' })
          },5000)
     
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
   
  }
}
</script>

