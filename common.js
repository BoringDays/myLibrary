var Common = function () {

};

/*
 * 判断当前浏览器是否为微信浏览器
 */
Common.prototype.isWeChatBrowser = function () {
    return navigator.userAgent.indexOf('MicroMessenger') !== -1;
};

/*
 * 判断是否空对象
 * @param obj {Object}     需要判断的对象
 */
Common.prototype.isEmptyObject = function (obj) {
    var key;
    for (key in obj){
        return false;
    }
    return true;
};

/*
 * 将类数组转换成数组
 * @param param {Array}     需要转换的类数组
 */
Common.prototype.toArray = function (param) {
    return [].slice.call(param);
};

/*
 * 获取指定元素的兄弟元素
 * @param elem {DOMNode} 指定DOM元素
 */
Common.prototype.siblings = function (elem) {
    var arr = [];
    var p = elem.previousSibling;
    var n = elem.nextSibling;

    while(p){
        if(p.nodeType === 1){
            arr.push(p);
        }
        p = p.previousSibling;
    }

    arr = arr.reverse();

    while (n){
        if(n.nodeType === 1){
            arr.push(n);
        }
        n = n.nextSibling;
    }

    return arr;
};

/*
 * 获取URL里面的参数
 * @param url {String} 需要解析的URL，不传的话就默认为当前页面URL
 */
Common.prototype.getUrlParam = function (url) {
    var str = url || window.location.href; //取得整个地址栏
    str = str.substr(str.indexOf('?') + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split('&'); //各个参数放到数组里
    var knv, obj = {};
    for (var i = 0; i < arr.length; i++) {
        knv = arr[i].split("=");
        if ('true' === knv[1])
            obj[knv[0]] = !0;
        else if ('false' === knv[1])
            obj[knv[0]] = !1;
        else if (knv[1])
            obj[knv[0]] = knv[1];
    }
    return obj;
};

/*
 * 获取cookie的值
 * @param c_name {String} 需要获取cookie的名称
 */
Common.prototype.getCookie = function (c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=');
        var c_end;
        if (c_start !== -1) {
            c_start += c_name.length + 1;
            c_end = document.cookie.indexOf(';', c_start);
            if (c_end === -1) c_end = document.cookie.length;
            return JSON.parse(document.cookie.slice(c_start, c_end));
        }
    }
    return '';
};

/*
 * 设置cookie的值
 * @param c_name {String} 需要设置的cookie的名称
 * @param value {String} 需要设置的cookie的值
 * @param expireDays {Number} 有效天数；可以考虑重构下，支持更多日期
 */
Common.prototype.setCookie = function (c_name, value, expireDays) {
    var exDate = new Date();
    exDate.setDate(exDate.getDate() + expireDays);
    document.cookie = c_name + '=' + JSON.stringify(value) + ((expireDays == null) ? '' : ';expires=' + exDate.toUTCString());
};

/*
 * 删除cookie的值
 * @param c_name {String} 需要删除的cookie的名称
 */
Common.prototype.removeCookie = function (c_name) {
    var exDate = new Date();
    var val = owner.getCookie(c_name);
    if (val) {
        exDate.setTime(exDate.getTime() - 1);
        document.cookie = c_name + '=' + val + ';expires=' + exDate.toUTCString();
    }
};

/*
 * 添加千分号
 * @param num {Number} 需要添加的数字
 * @param digits {Number} 保留几位小数
 */
Common.prototype.addThousandSign = function (num, digits) {
    if (num === num) {
        num = (typeof digits !== 'undefined' ? num.toFixed(digits) : ('' + num));
        return num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
    } else {
        //NaN
        return false;
    }
};

/*
 * 格式化日期
 * @param fmt {String} 目标格式，如：(new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 */
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    return fmt;
};

// polyfill
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

if (!Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}