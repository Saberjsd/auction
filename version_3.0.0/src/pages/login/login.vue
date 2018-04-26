<template>
  <div class="container" v-loading="loadingmask"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)"> 
     
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
          
          <el-form-item  prop="passwd">
            <img src="~assets/icons/icon-passwd.png" class="icon-input passwd">
            <el-input type="password" v-model="loginForm.passwd"  placeholder="请输入您的助记词" auto-complete="off" clearable></el-input>
          </el-form-item>
          
          <el-form-item  prop="code" v-if="imgCode">
            <img src="~assets/icons/icon-mouse.png" class="icon-input code">
            <el-input type="text" v-model="loginForm.code" class="input-code" placeholder="请输入右侧验证码" auto-complete="off" clearable></el-input>
            <img :src="imgSrc" class="img-code" @click="reCode()">
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="loginBtn" >立即登陆</el-button>
            <a type="button" class="registerBtn" target="_blank" href="http://mainnet.dreamworld.io/">跳转注册</a>            
          </el-form-item>
        </el-form>
      </div>
      
      <div class="content-right">
        <p class="questions"> <i></i>DDC余额不够?</p>
        <p class="dec">通过手机扫描下方对应版本的二维码,安装虚拟地球APP立即注册挖宝;</p>
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

      <!-- 免责遮罩层 -->
      <div id="loginMask" v-if="loginMask">
          <div class="responsibility">
            <h2>相关条款</h2>
            <p>
              虚拟地球官网在此特别提醒您在注册成为用户之前，请认真阅读本《信息安全协议》（以下简称“本协议”），
              阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与虚拟地球官网达成一致，
              成为虚拟地球官网“用户”。
              与大多数货币不同，
              比特币不依靠特定货币机构发行，它依据特定算法，通过大量的计算产生，比特币经济使用整个P2P网络中众多节点构成的分布式数据库来确认并
              记录所有的交易行为，并使用密码学的设计来确保货币流通各个环节安全性。P2P的去中心化特性与算法本身可以确保无法通过大量制造比特币来
              人为操控币值。基于密码学的设计可以使比特币只能被真实的拥有者转移或支付。这同样确保了货币所有权与流通交易的匿名性。比特币与其他虚
              拟货币最大的不同，是其总数量非常有限，具有极强的稀缺性。该货币系统曾在4年内只有不超过1050万个，之后的总数量将被永久限制在2100万个
            </p>
            <div class="btns">
              <button class="disagree" @click="disagree">不同意</button>
              <button class="agree" @click="agree" :class="{active:isActive}">同意<span v-show="isActive">({{tCount}}s)</span></button>
            </div>
            
          </div>
      </div>
  </div>
</template>
<style>

</style>

<script>
import {setCookie,getCookie} from '@/util/util'
import Aschjs from "asch-js";
import Mnemonic from 'bitcore-mnemonic';

export default {
  name: 'Login',
  data () {
    var validatePasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入DDC钱包12位助记词'));
      } else if(!Mnemonic.isValid(value)){
        callback(new Error('密码格式不符合BIP39安全规范'));
      }else{
        this.imgCode=true;
        this.imgSrc="/auction/api/user/imgCode/"+value+"?t="+(new Date().getTime());
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
        passwd: '',
        code:''
      },
      imgCode:false,
      imgSrc:"",
      rules:{
        passwd:[
          { validator: validatePasswd, trigger: 'blur' }
        ],
        code:[
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      loginMask: false,
      loadingmask:false,
      isLogin:false,
      isActive:true,
      tCount:9,
      timer:0,
      userInfo:null,
    }
  }, 
  mounted(){
    var user = getCookie('userInfo');
    if(user) {
      user = decodeURIComponent(user)  
      var userInfo = JSON.parse(user)
      this.$store.dispatch('setUserInfo',userInfo);
      // this.$router.push('/index')
      this.$router.push({ path: 'index' })
    }
  },
  methods:{
    reCode(){
      this.imgSrc="/auction/api/user/imgCode/"+this.loginForm.passwd+"?t="+ new Date().getTime();
    },
    submitForm:function(formName){
      // setCookie('user',JSON.stringify(this.loginForm),1000*60*60*24*365)
      // console.log(document.cookie)
      this.$refs[formName].validate((valid) => {
        if (valid) { //前端验证合法之后

          // 开始登陆验证
          this.login()
          
        } else {
          // 前端验证不通过
          return false;
        }
      });
    },
    agree:function(){
      if(this.isActive){
        return false;
      }else{
        //页面跳转
        this.$http.get('/auction/api/user/userAggree/'+this.$store.state.userInfo.id)
        // this.$store.dispatch("setUser",this.loginForm)
        this.$router.push({ path: 'index' })
      }
    },
    disagree:function(){
      this.imgSrc="/auction/api/user/imgCode/"+this.loginForm.passwd+"?t="+ new Date().getTime();
      if(this.timer != 0){
        clearInterval(this.timer)
      }
      this.tCount = 9;
      this.isActive = true;
      this.loginMask = false;
    },
    login(){
      //var publicKey = 
      var vthis = this;
      this.loadingmask = true;
      var publicKeyS=Aschjs.crypto.getKeys(this.loginForm.passwd);
      var publicKey=publicKeyS.publicKey;
      this.$http
          .post("/auction/api/user/login/"+this.loginForm.passwd+'/'+this.loginForm.code,{},{
            timeOut:10000
          })
          .then(res => {
              // console.log(res.data)
              this.loadingmask = false;
              if(res.data.code){   //登录成功

                var data = res.data.data.user;
                this.userInfo = {   //用户登录信息
                              id:data.id,
                              walletAddr:data.walletAddr,
                              token:data.token,
                              loginCount:data.loginCount,
                              allDdc:data.allDdc,
                              ableDdc:data.ableDdc,
                              freezeDdc:data.freezeDdc,
                          };
                this.$store.dispatch('setUserInfo',this.userInfo);
                setCookie('userInfo',JSON.stringify(this.userInfo),1000*60*60*24)
                // console.log('验证成功')

                if(!data.isAggree){    //没有同意过
                    this.loginMask = true;
                    //阅读免责声明定时器
                    if(this.timer != 0){
                      clearInterval(this.timer)
                    }
                    this.timer = setInterval(() => {
                      this.tCount -= 1
                      if(this.tCount==0){
                        clearInterval(this.timer)
                        this.isActive = false;
                      }
                    },1000)
                }else{
                  this.$http.get('/auction/api/user/craeteTransactionByUserId/'+this.$store.state.userInfo.id)
                  this.$router.push({ path: 'index' })
                }
              }else{  //登录验证失败
                  this.$message({
                      showClose: true,
                      message: '登陆失败,请确认助记词是否正确',
                      type: 'error'
                  });
              }

              // setCookie('user',JSON.stringify(user),1000*60*60*24*7)
              // vthis.dispatch('setUser',user)
              // console.log(getCookie('user'))
              
          })
          .catch(function (err) {
              vthis.loadingmask = false;
              vthis.$message({
                showClose: true,
                message: err.message,
                type: 'error'
              });
          });
    },
    readeResponsibility(){
      
    }
   
  }
}
</script>

