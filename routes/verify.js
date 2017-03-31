var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');

var encryptService = require('../service/encrypt');
var userService = require('../service/user');
var fileService = require('../service/file');
var sequelizeService = require('../service/sequelize');
var app = require('../app');

router.post('/',function (req,res) {
    console.log("~/verify");
    console.log("post data:");
    try {
        console.log(req.body.data);
        var username = req.body.data.username;
        var password = req.body.data.password;
        var mac = req.body.data.mac;

        sequelizeService.authenticate(username,password,function (clientRecord,state) {
            if(state!=0){
                var info = {"error_code":state};
                res.send(info);
            } else{
                var myUUID = uuid.v1();
                var produceId = encryptService.produceId(username,password,mac,myUUID);
                console.log("produceId:"+produceId);
                sequelizeService.effective(clientRecord.id,clientRecord.remark-1,mac,produceId,function () {

                    var temp1 = fs.readFileSync(app.srcPath);
                    var temp2 = encryptService.encrypt(temp1,produceId);
                    var temp3 = encryptService.encrypt(temp2,mac);
                    console.log("temp1:"+temp1);
                    console.log("temp2:"+temp2);
                    console.log("temp3:"+temp3);

                    var fileName = myUUID+'.zip';
                    var filePath = path.join(app.dstPath,fileName);
                    var options = userService.fileOptions(produceId);
                    fileService.writeZip(temp3  ,filePath,function () {
                        res.sendFile(filePath,options,function(err) {
                            if (err) {
                                var info = {"error_code": -4};
                                res.send(info);
                                console.error("SendFile error:", err, " (status: " + err.status + ")");
                            } else console.log('Sent:',filePath);
                            fileService.delete(filePath);
                        });
                    });
                });
            }
        });
    }catch(err){
        var info = {"error_code":-4};
        res.send(info);
    }
});

module.exports = router;
