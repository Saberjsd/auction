<template>
  <div class="container">  
    <header class="header">
      <div class="header-logo">
        <img src="~img/logo.png" alt="">
        <span>DREAM WORLD</span>
      </div>
    </header>
    <el-form :model="loginForm"  ref="loginForm" :rules="rules" class="loginForm">
      <el-form-item  prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  prop="passwd">
        <el-input type="password" v-model="loginForm.passwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  prop="code">
        <el-input type="text" v-model="loginForm.code" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" 
        class="loginBtn" v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="正在登录...">立即登录</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<style scoped>
.header{
  height: 60px;width: 100%;background: #1253fc;line-height: 60px;color: #ffffff;
}
.header-logo{
  height: 60px;width: 522px;margin: 0 auto;
}
.header-logo img{
  float: left;
  margin: 9px;
}
.header-logo span{
  float: left;
  font-family: Arial-Black;font-size: 18px;font-weight: bold;
}


.loginForm{
  width: 60%;
  margin: auto;
}
.loginBtn{
  width: 100px;
}
.el-input__inner{
  height: 73px;

}
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


