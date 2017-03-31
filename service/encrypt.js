/**
 * Created by zhuangqf on 2017/3/23.
 */
const crypto = require('crypto');

var encryption = "aes-128-cbc";
var iv = new Buffer([0,1,0,2,0,3,0,4,0,5,0,6,0,7,0,8]);

function md5(text) {
    var md5 = crypto.createHash("md5");
    var temp = md5.update(text).digest('hex');
    return new Buffer(temp, "hex");
}

function encrypt(clearText,key) {
    var raw = md5(key);
    var clearBuffer = new Buffer(clearText);
    var cipher = crypto.createCipheriv(encryption,raw,iv);
    cipher.setAutoPadding(true);
    var cipherText = Buffer.concat([cipher.update(clearBuffer), cipher.final()]);
    return cipherText.toString("base64");
}

function decrypt(cipherText,key) {
    var raw = md5(key);
    var cipherBuffer = new Buffer(cipherText, "base64");
    var decipher = crypto.createDecipheriv(encryption, raw, iv);
    decipher.setAutoPadding(true);
    var clearBuffer = Buffer.concat([decipher.update(cipherBuffer), decipher.final()]);
    return clearBuffer.toString();
}

function produceId(username,password,mac,uuid) {
    var produceString = '#'+username+'#'+password+'#'+ uuid;
    return this.encrypt(produceString,mac);
}

exports.md5 = md5;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.produceId = produceId;
