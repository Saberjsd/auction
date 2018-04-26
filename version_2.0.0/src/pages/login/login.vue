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
            <el-input type="password" v-model="loginForm.passwd" placeholder="请输入您的助记词" auto-complete="off" clearable></el-input>
          </el-form-item>
          
          <el-form-item  prop="code" v-if="imgCodeShow">
            <img src="~assets/icons/icon-mouse.png" class="icon-input code">
            <el-input type="text" v-model="loginForm.code" @keyup.enter.native="login" class="input-code" placeholder="请输入右侧验证码" auto-complete="off" clearable></el-input>
            <img :src="imgSrc" class="img-code" @click="reCode()">
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="loginBtn" >立即登陆</el-button>
            <a type="button" class="registerBtn" target="_blank" href="http://mainnet.dreamworld.io/">跳转注册</a>            
          </el-form-item>
        </el-form>
      </div>
      
      <div class="content-right">
        <p class="questions"> 
          <i></i>保证金储值账户:
          <span class="addr">AFQz2TMpX6GNrsxRvyYECt4NuRu3hxh4BN <br> (DDC侧链转账)</span></p>
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
      <div id="loginMask"  v-if="loginMask">
          <div class="responsibility">
            <h2>条款与条件</h2>
            <div class="respon">
<p style="text-indent:0;">1、接受条款虚拟地球提供“领地拍卖”作为一个平台，用于管理虚拟地球中的密码所有权，允许用户控制交易，然后交易被记录在虚拟地球链上。领地拍卖，以及任何其他特点，工具，材料或其他服务不时提供的分散和被称为“服务”。请仔细阅读这些使用条款（术语）或“使用条款”之前，使用该服务。通过使用或以其他方式访问服务，您接受并同意受这些条款的约束才能使用该服务。如果您不同意这些条款，那么您就不能访问或使用该服务。
</p>
2、免责声明和使用条款的修改
<p >领地拍卖仍处于测试阶段，可能包含缺陷和软件缺陷。建议您保护重要的数据、财产和内容，谨慎使用，不依赖于服务和领地拍卖的正确或安全的功能或性能。提供约束力仲裁和放弃集体诉讼权利，权力下放者保留权利，酌情修改或替换任何时候的使用条款。最新版本的这些条款将张贴在我们的网站上。你将负责审查和熟悉任何此类修改。在对条款进行任何修改后，使用您的服务构成您接受使用条款的修改。
</p>
3、资格
<p >兹代表并保证，贵方完全有能力履行上述条款所规定的条款、条件、义务、确认、陈述和保证，并遵守并遵守这些条款。虚拟地球是一个全球平台，通过访问内容或服务，你代表和保证，你是合法的年龄在你的司法管辖区，是需要访问这些服务和内容，并进入安排，由服务提供。您进一步表示，您在法律上允许使用您管辖范围内的服务，包括拥有价值的密码令牌，并且以任何方式与服务或内容交互。你还表示你有责任确保遵守你管辖的法律，并承认分权不负责你的遵守或不遵守这些法律。
</p>
4、帐户访问与安全 
<p >通过平台登陆提供对领地拍卖的访问。您需明白，无论何时使用该服务进行交易，您的公开地址都将公开可见。<br>
4.1密码领域的弱点或漏洞的风险
<p >你承认并同意密码学是一个进步的领域。在代码破解或技术进步方面的进步，如量子计算机的发展，可能会给加密技术、服务和领地拍卖带来风险，这可能导致窃取或丢失密码令牌或财产。在可能的范围内，权力下放和打算采取合理的措施来更新服务的协议，以考虑密码学的任何进步，并纳入分散和应该意识到的附加安全措施，但虚拟地球不保证或不允许。通过使用服务和领地拍卖，你承认并同意承担这些风险。
</p>
4.2密码通证的波动性
<p >您承认并同意，由于许多因素（包括但不限于受欢迎程度、采纳、投机、监管、技术和安全风险），虚拟地球、阿希链技术和相关的通证和其他资产非常不稳定。你也承认并同意对这些技术进行交易的成本是可变的，并且可能在任何时候增加，对在阿希链上发生的任何活动造成影响。你承认并同意这些风险，并表示分权不能对价值的变动和波动或增加的成本承担责任。
</p>
4.3应用安全性
<p >您承认并同意该服务和相关应用程序是软件代码，并有缺陷，并承认您完全负责评估由服务或内容提供的任何代码，以及任何第三方网站、产品、智能合同的可信性，或通过服务访问或使用的内容。你还明确承认并同意，以貌取人或疏忽为目的，可以对其进行书面说明，即不能为你与这些应用程序的交互承担责任，并且此类申请可能导致财产损失或身份损失。这一警告和其他事后由权力下放，并没有证据或代表一个持续的职责，提醒您使用的服务的所有潜在风险。
</p>
<p >4.4与使用基于互联网的通证相关的风险包括，但不限于，硬件、软件和互联网连接失败或问题的风险、恶意软件引入的风险以及第三方可能获得未经授权的访问信息的风险。储存在钱包里。你接受并承认，虚拟地球不会对使用阿希网络造成的任何通信故障、中断、错误、失真或延迟负责。
</p>
<p >4.5在分布式生态系统的创造和发展中缺乏使用或公共利益可能会对分散和生态系统的发展产生负面影响，从而可能影响土地地块和DDC的潜在效用或价值。
</p>
5、交易费用 <br>
<p >5.1如果你选择购买，交易，或出售领地，实际产生费用全部以DDC实现，接受竞拍最后产生的价格，并只在虚拟地球区块链上确权。
</p>
<p >5.2在我们之间，如果存在税收，由你将独自负责支付任何和所有销售、使用、增值和其他税、税和评估（除净收入的税）现在或以后声称或强加的任何政府当局（统称“税收”）与你使用的。
</p>
6、变化
<p >我们可以不时地修改条款。当我们进行更改时，我们将通过服务提供最新的条款，并更新这些条款开始时的“最后更新”日期。请定期检查这些条款以便于更改。对这些条款的任何修改都将适用于它们的日期，并且在条款被更新之后，您继续使用或使用该服务将构成您对更新的绑定接受。如果你不同意任何修改的条款，你就不能访问或使用该服务。
</p>
7、成人条款
<p >你肯定你已经满18岁了，因为这项服务并不是针对18岁以下的孩子。如果你是18岁以下，需有监护人指导你执行方具有法律效力。
</p>
8、赔款条款
<p >你将释放和补偿、保护和持有无害的分权及其父母、子公司、分支机构和机构，以及任何前述实体的官员、董事、雇员、股东和代表，免除和免除所有和一切损失、负债、费用。赔偿、费用（包括律师费和法院费用）索赔或诉讼，不论是由你使用的服务所产生或导致的，你违反这些使用条款，以及你的任何行为或遗漏。权力下放并保留权利，自费承担对你方赔偿的任何其他事项的专属防御和控制权，在这种情况下，你同意与虚拟地球合作以防御这一问题。
</p>
9、免责声明
<p >你承认并同意你对网站和服务的使用承担全部责任。您承认并同意您在使用网站和服务期间发送或接收的任何信息可能不安全，可能被未经授权的方截获或事后获取。您承认并同意您使用该网站和服务是您自己的风险。您确认并同意该服务提供“原样”和“可用”，而无任何保证，无论是明示还是默示。认识到这一点，你承认并同意，在适用法律允许的最大范围内，无论是分散的，还是它的供方或许可方都不会对任何直接、间接、附带、特殊、后果、惩罚性、示范性或其他损害承担责任。对利润、商誉、使用、数据或其他有形或无形损失或任何其他损害的限制，基于合同、侵权、严格责任、侵犯知识产权、盗窃或挪用财产或任何其他理论（即使是分散的）告知该损害的可能性），由现场或服务引起；使用或不能使用该网站或服务；未经授权访问或更改您的传输或数据；任何第三方在该网站或服务上的声明或行为；人为错误；技术故障；故障，包括公用事业或电话中断；遗漏、中断、延迟、删除或任何设备或网络、提供者或软件的缺陷（包括但不限于不存在的设备或网络）允许参与服务）；对计算机设备的任何伤害或损坏；不能完全访问该网站或服务或任何其他网站；盗窃、篡改、销毁或未经授权访问任何类型的图像或其他内容；处理晚或不正确的数据或印刷或印刷或其他错误，或其任何组合；或与网站或服务有关的任何其他事项。有些司法管辖区不允许排除某些保证或对附带或间接损害赔偿责任的限制或排除。因此，上述一些限制可能不适用于您。
</p>
10、终止与中止
<p >你有权在任何时候终止这些条款，取消和停止使用和使用该服务。分散和终止或暂停所有或部分服务和您的分散和访问立即，恕不另行通知或责任。你同意任何暂停或终止你的服务可能没有事先通知，我们不会对你或任何第三方承担任何此类中止或终止。如果我们终止这些条款或暂停或终止您的访问或使用服务，因为您违反这些条款或任何涉嫌欺诈、辱骂或非法活动，那么终止这些条款将是除任何其他补救措施，我们可能在法律或衡平法。一旦这些条款终止或到期，无论你或我们，你可能不再有机会访问你在服务上或与你的帐户相关的信息，你承认我们没有义务在我们的数据库或服务中维护任何这样的信息。向你方或任何第三方提供任何此类信息。在您的访问终止后，您使用该服务的权利将立即停止。这些条款的下列条款在这些条款的任何条款中存在：陈述和风险；交易和费用；赔偿；免责声明；责任限制；我们的所有权；链接；终止和中止；没有第三方受益人；豁免；一般信息。</p>

            </div>
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
import { setCookie, getCookie } from "@/util/util";
import Aschjs from "asch-js";  //验证
import Mnemonic from "bitcore-mnemonic"; //钱包地址验证
// import myencrypt from "@/util/secret";  

export default {
  name: "Login",
  data() {
    var validatePasswd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入DDC钱包12位助记词"));
      } else if (!Mnemonic.isValid(value)) {
        callback(new Error("密码格式不符合BIP39安全规范"));
      } else {
        this.imgCodeShow = true;
        //this.reCode();
        // this.imgSrc="/auction/api/user/imgCode/"+value+"?t="+(new Date().getTime());
        callback();
      }
    };
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        passwd: "",
        code: ""
      },
      imgCodeShow: false,
      imgSrc: "",
      rules: {
        passwd: [{ validator: validatePasswd, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }]
      },
      loginMask: false,
      loadingmask: false,
      isLogin: false,
      isActive: true,
      tCount: 9,
      timer: 0,
      userInfo: null,
      encryp: ""
    };
  },
  watch: {
    "loginForm.passwd"(old, news) {
      if(old){
        this.reCode();
      }
      // console.log(this.loginForm);
    }
  },
  mounted() {
    var user = getCookie("userInfo");
    if (user) {
      user = decodeURIComponent(user);
      var userInfo = JSON.parse(user);
      this.$store.dispatch("setUserInfo", userInfo);
      // this.$router.push('/index')
      this.$router.push({ path: "index" });
    }
  },
  methods: {
    reCode() {
      var publicKeyS=Aschjs.crypto.getKeys(this.loginForm.passwd);
      var publicKey=publicKeyS.publicKey;
      // var str = myencrypt(this.loginForm.passwd);
      this.encryp = publicKey;
      this.imgSrc =
        "/auction/api/user/imgCode?keys=" +
        this.encryp +
        "&t=" +
        new Date().getTime();
    },
    submitForm: function(formName) {
      // setCookie('user',JSON.stringify(this.loginForm),1000*60*60*24*365)
      // console.log(document.cookie)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //前端验证合法之后

          // 开始登陆验证
          this.login();
        } else {
          // 前端验证不通过
          return false;
        }
      });
    },
    agree: function() {
      if (this.isActive) {
        return false;
      } else {

        this.$store.dispatch("setUserInfo", this.userInfo);
            setCookie(
              "userInfo",
              JSON.stringify(this.userInfo),
              1000 * 60 * 60 * 24
            );
        //页面跳转
        this.$http.get(
          "/auction/api/user/userAggree",
          {
            params:{
              userId:this.$store.state.userInfo.id,
            },
            timeOut:5000
          }
        );
        // this.$store.dispatch("setUser",this.loginForm)
        this.$router.push({ path: "index" });
      }
    },
    disagree: function() {
      this.reCode();
      if (this.timer != 0) {
        clearInterval(this.timer);
      }
      this.tCount = 9;
      this.isActive = true;
      this.loginMask = false;
    },
    login() {
      //var publicKey =
      this.loadingmask = true;
      // var publicKeyS=Aschjs.crypto.getKeys(this.loginForm.passwd);
      // var publicKey=publicKeyS.publicKey;
      var str = this.encryp;
      this.$http
        .post(
          "/auction/api/user/login",
          {
              keys:str,
              validateCode:this.loginForm.code
          },
          {
            timeOut: 5000,
             headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          // console.log(res.data)
          this.loadingmask = false;
          if (res.data.code==1) {
            //登录成功
            var data = res.data.data.user;
            this.userInfo = {
              //用户登录信息
              id: data.id,
              walletAddr: data.walletAddr,
              token: data.token,
              loginCount: data.loginCount,
              allDdc: data.allDdc,
              ableDdc: data.ableDdc,
              freezeDdc: data.freezeDdc
            };
            
            // console.log('验证成功')

            if (!data.isAggree) {
              //没有同意过
              this.loginMask = true;
              //阅读免责声明定时器
              if (this.timer != 0) {
                clearInterval(this.timer);
              }
              this.timer = setInterval(() => {
                this.tCount -= 1;
                if (this.tCount == 0) {
                  clearInterval(this.timer);
                  this.isActive = false;
                }
              }, 1000);
            } else {
              setCookie(
                "userInfo",
                JSON.stringify(this.userInfo),
                1000 * 60 * 60 * 24
              );
              this.$http.get(
                "/auction/api/user/craeteTransactionByUserId" ,
                {
                  params:{
                    userId:this.$store.state.userInfo.id
                  },
                  timeOut:5000
                }
              );
              this.$router.push({ path: "index" });
            }
          } else {
            this.loadingmask = false;
            //登录验证失败
            this.encryp = "";
            this.loginForm.passwd = ''
            this.loginForm.code = ''
            // debugger;

            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }

          // setCookie('user',JSON.stringify(user),1000*60*60*24*7)
          // this.dispatch('setUser',user)
          // console.log(getCookie('user'))
        })
        .catch((err) => {
          this.loadingmask = false;
          this.encryp = "";
          // debugger;
          console.error(err)
          console.error(err)
          this.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    },
  }
};
</script>

