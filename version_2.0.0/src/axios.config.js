import Config from "./config"
import { getCookie, nihao } from "./util/util"
import decrpt from "./util/decry"

function MyCr(str, key) {

  var keyhex = CryptoJS.enc.Utf8.parse(key);
  var encryped = CryptoJS.DES.encrypt(str, keyhex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encryped.ciphertext.toString();
}

// 拦截响应response，并做一些错误处理


function  install (sue,obj){
  axios.interceptors.request.use((config) => {
    var time = new Date().getTime() + "";

    var key = nihao + Config.ku + decrpt.hei
    key = decrpt.decrypt(key)
    var str = MyCr(time, key)
    if (config.url.indexOf("?") >= 0) {

      config.url += "&_secret=" + str;
    } else {
      // console.log(str)
      config.url += "?_secret=" + str;
    }

    var cookie = getCookie("userInfo");
    if (cookie) {
      var cokieStr = decodeURIComponent(cookie);
      var userInfo = JSON.parse(cokieStr);
      var token = userInfo.token;
      config.url += "&_token=" + token;
    }
    // console.log(config)
    return config;
  })
  axios.interceptors.response.use((response) => {
    // const data = response.data
    // debugger;
    if (response.data.code == 0 || response.data.code == 1) {
      return response
    } else if (response.data.code == 110) {  //没登录

      obj.$message.error("请重新登录");
      return response
    } else if (response.data.code == 119) {  //非法访问
      obj.$message.error("请求超时");
      return response
    }

  }, (err) => { // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break

        case 401:
          err.message = '未授权，请登录'
          break

        case 403:
          err.message = '拒绝访问'
          break

        case 404:
          err.message = `请求地址出错`
          // err.message = `请求地址出错: ${err.response.config.url}`
          break

        case 408:
          err.message = '请求超时'
          break

        case 500:
          err.message = '服务器内部错误'
          break

        case 501:
          err.message = '服务未实现'
          break

        case 502:
          err.message = '网关错误'
          break

        case 503:
          err.message = '服务不可用'
          break

        case 504:
          err.message = '网关超时'
          break

        case 505:
          err.message = 'HTTP版本不受支持'
          break

        default:
      }
    }
    return Promise.reject(err)
  })
  sue.prototype.$http = axios;
}

export default install