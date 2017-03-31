var fs = require('fs');
var zlib = require('zlib');

function gunzip(data, callback) {
    zlib.gunzip(data,function(err,result){
        if(err) throw err;
        // console.log("unzip file success!");
        else callback(result.toString('utf-8'));
    })
}

function readZip(src,callback) {
    fs.readFile(src,function(err,data) {
        if(err) throw err;
        // console.log("read file success!");
        // console.log(data.toString());
        else gunzip(data,callback);
    });
}

function writeFile(data,dst,callback) {
    var options = {
        encoding:'utf-8'
    };
    fs.writeFile(dst,data,options,function(err){
        if(err) throw err;
        else {
            console.log("write file success!");
            callback();
        }
    });
}
function writeZip(data,dst,callback) {
    zlib.gzip(data,function(err,result){
        if(err) throw err;
        else {
            console.log("zip file success!");
            writeFile(result, dst, callback);
        }
    })
}
function readFile(src,callback) {
    fs.readFile(src,"utf8",function(err,data){
        if(err) throw err;
        else callback(data);
    });
}

function deleteFile(src) {
    fs.unlinkSync(src);
}

exports.read = readFile;
exports.write = writeFile;
exports.delete = deleteFile;
exports.readZip = readZip;
exports.writeZip = writeZip;