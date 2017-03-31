/**
 * Created by zhuangqf on 2/17/17.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('verityDB', 'verity', 'myVerity', {
    host: "112.74.22.182",
    dialect: "mysql",
    port:    3306,
    options: {
        dialectOptions: {
            timeout: 10000
        },
        pool:{
            minConnections:2,
            maxConnections:20,
            maxIdleTime:10000
        },
        retry:{
            max:10
        }
    }
});


var Client = sequelize.define('client', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email:    Sequelize.STRING,
    company:  Sequelize.STRING,
    remark:   Sequelize.INTEGER
},{
    underscored:true
});

var Purchase = sequelize.define('purchase',{
    clientId: Sequelize.INTEGER,
    quantity: Sequelize.INTEGER
},{
    underscored:true
});

var Active = sequelize.define('active',{
    clientId: Sequelize.INTEGER,
    mac:      Sequelize.STRING,
    uuid:     Sequelize.STRING,
    state:    Sequelize.INTEGER
},{
    underscored:true
});

function auth(callback) {
    sequelize
        .authenticate()
        .then(function () {
            console.log("Mysql CONNECTED! ");
            sequelize.sync().then(function () {
                console.log("Database Sync Success!");
                callback();
            }).catch(function (err) {
                console.error("Database Sync Failure!");
                console.error(err);
            }).done();
        }).catch(function (err) {
        console.log("Mysql Failure");
        console.error(err);
    }).done();
}

// 0 成功, -1 无用户, -2 密码错误, -3 remark<=0, -4 其他错误
function authenticate(username,password,callback) {
    Client.findOne({
        where:{username:username}
    }).then(function (user) {
        if(!user){
            callback(null,-1);
        } else if(user.password != password){
            callback(user,-2);
        } else if(user.remark <= 0){
            callback(user,-3)
        } else callback(user,0);
    }).catch (function (err) {
        console.error(err);
        callback(null,-4);
    });
}

function effective(clientId,remark,mac,uuid,callback) {
    console.log("effective");
    return sequelize.transaction( function (t) {
        return Client.update(
            {remark: remark},
            {
                where: {id: clientId},
                transaction: t
            }
        ).then(function (clientRecrd) {
            console.log("update client record" + clientRecrd);
            return Active.create(
                {
                    clientId: clientId,
                    mac: mac,
                    uuid: uuid,
                    state: 1
                }, {
                    transaction: t
                }
            ).then(function (activeRecord) {
                console.log("create active record:" + activeRecord);
            });
        });
    }).then(function (result) {
        console.log("transaction result:"+result);
        callback();
    }).catch(function (err) {
        console.error(err);
        throw err;
    });
}

exports.sequelize = sequelize;

exports.authenticate = authenticate;
exports.auth = auth;
exports.effective = effective;