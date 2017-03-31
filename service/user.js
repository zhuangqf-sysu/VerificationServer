/**
 * Created by zq on 2017/1/22.
 */
var file = require('../service/file');
var encrypt = require('../service/encrypt');
var app = require('../app');

var uuid = require('node-uuid');
var path = require('path');

function fileOptions(produceId) {
    var options = {
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'x-produceId': produceId,
            'Content-Encoding': 'gzip',
        }
    };
    return options;
}


exports.fileOptions = fileOptions;