<template>
  <div class="container" style="margin-top:100px;">  

    <el-form :model="loginForm"  ref="loginForm" :rules="rules" label-width="100px" class="loginForm">
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input type="password" v-model="loginForm.passwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')" 
        class="loginBtn" v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="正在登录...">登录</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    var validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      } else if (/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(value)==false) {
        callback(new Error('请输入合法的用户名,如手机号'));
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loginForm{
  width: 60%;
  margin: auto;
}
.loginBtn{
  width: 100px;
}

</style>
