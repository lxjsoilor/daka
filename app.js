const request=require('request');
const fs = require('fs');
let startMsg = `开始打卡-----------${new Date().toLocaleString()}\r\n`
const loginUrl = `http://moa.hucais.com:89/client.do?method=login&loginid=09064172&password=123456&isneedmoulds=1&client=1&clientver=6.6.0.1&udid=0a84fac33fb3065e&token=&clientos=HUAWEIVOG-AL00&clientosver=10&clienttype=android&language=zh&country=CN&authcode=&dynapass=&tokenpass=&relogin=0&clientuserid=&tokenFromThird=&signatureValue=&signAlg=&randomNumber=&cert=`

function appendFileLog(fileName, message) {
    fs.appendFile(`C:/Users/09064172/Desktop/daka/${fileName}.txt`,message, function(err) {
        if(err)
            console.log('写文件出错了，错误是：' + err);
        else
            console.log('ok');
    });
}

appendFileLog('log', startMsg)

request({
    url: loginUrl,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    }
}, function(error, response, body) {
    appendFileLog('response', `登录-----------${new Date().toLocaleString()}\r\n${JSON.stringify(response)}\r\n`)
    error && appendFileLog('error', `登录-----------${new Date().toLocaleString()}\r\n${JSON.stringify(error)}\r\n`)
    if (!error && response.statusCode == 200) {
        let tempArr = response.headers['set-cookie'];
        let str = '';
        let arr = [];
        tempArr.forEach(item => {
        	arr.push(item.replace(';Max-Age=604800;HTTPOnly;', ''))
        })
        arr[arr.length - 1] = arr[arr.length - 1].replace('; path=/', '')
        str = arr.join(';');
      	request({
			url: `http://moa.hucais.com:89/client.do?method=postjson&module=17&scope=10&operation=create&sessionkey=${body.sessionkey}&latitudeLongitude=22.849974999999986,113.72192599999997&address=${encodeURIComponent('广东省东莞市沙河路49号靠近虎彩印艺工厂区')}&remark=${encodeURIComponent('无')}&attachmentIds=`,
			method: "POST",
			headers: {
		        "content-type": "application/x-www-form-urlencoded",
				"Cookie": str
		    },

		}, (err, res, bd) => {
            appendFileLog('response', `打卡-----------${new Date().toLocaleString()}\r\n${JSON.stringify(res)}\r\n`)
            appendFileLog('log', `打卡结束\r\n`)
            err && appendFileLog('error', `打卡-----------${new Date().toLocaleString()}\r\n${JSON.stringify(err)}\r\n`)
		})
    }
});