// 拦截响应response，并做一些错误处理
axios.interceptors.response.use((response) => {
    // const data = response.data
    if(response.data.code==1 ||response.data.code ==0){
        return response
    }
    // }else{
            // 若不是正确的返回code，且已经登录，就抛出错误
    // const err = new Error(data.msg)
  
    // err.data = data;
    // err.response = response
  
    // throw err
    // }

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
          err.message = `请求地址出错: ${err.response.config.url}`
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
  
//   axios.install = (sue) => {
//     sue.prototype.$axios = axios
//   }
  
  export default axios