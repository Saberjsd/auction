(function () {
    try {
        var $_console$$ = console;
        Object.defineProperty(window, "console", {
            get: function () {
                if ($_console$$._commandLineAPI)
                    throw "抱歉, 为了用户安全, 本网站已禁用console脚本功能";
                return $_console$$
            },
            set: function ($val$_$) {
                $_console$$ = $val$_$
            }
        })
    } catch ($ignore$$) {
    }
})();

document.oncontextmenu = function () {
    event.returnValue = false;
};



document.onkeydown = function (event) {
    if

    (  (event.keyCode == 123) //屏蔽 F12

        || (event.keyCode == 123)
    ) {
        return false;
    }
}
window.onhelp = function () { return false; }
