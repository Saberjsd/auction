<template>
  <div class="container"> 
     
    <header class="header">
      <div class="header-logo">
        <a href="">
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
            <el-button type="primary" @click="submitForm('loginForm')" 
            class="loginBtn" v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在登录...">立即登录</el-button>
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
       <span>关于我们: <a href="">www.dreamaking.net</a></span>
     </footer>
  </div>
</template>
<style>

</style>

<script>
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
    return {
      loginForm:{
        username: '',
        passwd: ''
      },
      rules:{
        username:[
          { validator: validateUsername, trigger: 'blur' }
        ],
        passwd:[
          { validator: validatePasswd, trigger: 'blur' }
        ]
      },
      fullscreenLoading: false
    }
  },
  methods:{
    submitForm:function(formName){
      console.log(this);
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
   
          // this.$http.get('/index').then((res) => {

          // }).then((err) => {
          //   alert('登录出错!')
          // })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
   
  }
}
</script>

<style>
body{font-size:18px;}
.header{
  height: 60px;width: 100%;background: #1253fc;line-height: 60px;color: #ffffff;
}
.header-logo{
height: 60px;width: 1200px;margin: 0 auto;
}
.header-logo img{
float: left;
margin: 9px;
}
.header-logo a{color:#ffffff;}
.header-logo span{
float: left;
font-family: Arial-Black;font-size: 18px;font-weight: bold;
}
/* content */
.content,footer{
width: 1200px;margin: 0 auto;
}
.content::after{
  content: '';display: table;width: 0;height: 0;clear: both;
}
.login-text{
font-family: MicrosoftYaHeiUI-Bold;font-size: 40px;color: #2f2f2f;
text-align: left;padding: 80px 0 61px 0;
}

.loginForm{
width: 522px;
float: left;
}
.loginBtn{
width: 522px;height: 73px;border-radius: 5px;
font-size: 32px;color: #ffffff;font-family: MicrosoftYaHeiUI;
background: url('~assets/img/login-btn-bg.png') no-repeat;
}
.loginBtn:link{background: url('~assets/img/login-btn-bg.png') no-repeat}
.loginBtn:visited{background: url('~assets/img/login-btn-bg.png') no-repeat}
.loginBtn:hover{background: url('~assets/img/login-btn-bg.png') no-repeat}
.loginBtn:active{background: url('~assets/img/login-btn-bg.png') no-repeat}
/* 间距 */
.el-form-item{
  height: 73px;margin-bottom: 40px;
}
.el-form-item__error{
  font-size: 18px;padding-top: 8px;
}
.el-input__inner{
height: 73px;line-height: 73px;font-size: 18px;border-radius: 5px;
border: 1px solid #a5a5a5;text-indent: 2em;
}
.input-code{width: 300px;float: left;}
.img-code{width: 206px;height: 73px;border-radius: 5px;float: right;}
.el-form-item{
  position: relative;
}
.icon-input{
  position: absolute;height: 28px;top: 22px;left: 20px;z-index: 30;
}
.icon-input.username{
  width: 23px;
}
.icon-input.passwd{
  width: 24px;
}
.icon-input.code{
  width: 20px;left: 22px;
}
/* 左边结束 */
/* 右边开始 */
.content-right{
  float: right;width: 384px;
}
.content-right::after{
  content: '';display: table;width: 0;height: 0;clear: both;
}
.content-right p{
  text-align: left;
}
.content-right .questions{
  font-size: 24px;color: #868686;font-family: MicrosoftYaHeiUI;height: 24px;
  line-height: 24px;margin-bottom: 20px;
}
.content-right .questions i{
  width: 10px;height: 10px;background: #ff966d;border-radius: 50%;
  margin-right: 15px;display: inline-block;
}
.content-right .dec{
  font-size: 22px;color: #a5a5a5;font-family: MicrosoftYaHeiUI;font-weight: 200;
  padding-left: 25px;
}
.code-download{
  width: 160px;float: left;margin-top: 60px;
}
.code-download span{
  font-family: MicrosoftYaHeiUI;font-weight: 200;color: #a5a5a5;
  position: relative;top: 10px;
}
.code-download img:last-child{
  position: relative;top: 15px;
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


footer{
  margin-top:40px;padding-top:11px;text-align:right;color:#a5a5a5;
  background: url('~assets/img/login-bottom.png') left top no-repeat;
}
footer a{
  color:#a5a5a5;text-decoration:none;
}
</style>