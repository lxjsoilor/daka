const request = require('request');
const logFileUrl = 'C:/Users/09064172/Desktop/daka/';
const currentDate = require('moment')().format('YYYY-MM-DD hh:mm:ss');
const fs = require('fs');

function appendFileLog(fileName, message) {
    fs.appendFile(`${logFileUrl}${fileName}.txt`,message, function(err) {
        if(err)
            console.log('写文件出错了，错误是：' + err);
        else
            console.log('ok');
    });
}

exports.http = function (url, Cookie='') {
    return new Promise((resolve, reject) => {
        request({
            url,
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Cookie
            },
        }, (err, res, body) => {
            err && appendFileLog('error', `${currentDate}\r\n${url}\r\n${JSON.stringify(err)}`);
            appendFileLog('response', `${currentDate}\r\n${url}\r\n${JSON.stringify(res)}`);
            resolve({res, body});
        })
    })
}

exports.isDuringDate = function (begin, end, current='') {
    let currentDate = current ? +new Date(current) : +new Date(),
        beginDate = +new Date(begin),
        endDate = +new Date(end);
    return (currentDate >= beginDate && currentDate <= endDate);
}

