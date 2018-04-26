function decrypt(str) {if (str == null || str.length < 8) {return;}var deStr="ACDI2LU1F89MN";var prand = "";for (var i = 0; i < deStr.length; i++) {prand += deStr.charCodeAt(i).toString();};var sPos = Math.floor(prand.length / 5);var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));var incr = Math.round(deStr.length / 2);var modu = Math.pow(2, 31) - 1;var salt = parseInt(str.substring(str.length - 8, str.length), 16);str = str.substring(0, str.length - 8);prand += salt;while (prand.length > 10) {prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();}prand = (mult * prand + incr) % modu;var enc_chr = "";var enc_str = "";for (var i = 0; i < str.length; i += 2) {enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));enc_str += String.fromCharCode(enc_chr); prand = (mult * prand + incr) % modu;}return enc_str;}
export default {
    decrypt,
    hei:'67d2af4203511dbc'
};