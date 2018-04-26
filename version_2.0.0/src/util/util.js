//获取cookie、
export function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
     return (arr[2]);
    else
     return null;
}
    
//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value, expires) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expires);
    document.cookie = c_name + "=" + escape(value) + ((expires == null) ? "" : ";expires=" + exdate.toGMTString());
    // console.log(c_name + "=" + escape(value) + ((expires == null) ? "" : ";expires=" + exdate.toGMTString()))
};

//删除cookie
export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

export const nihao ="0080cdfa4b1"