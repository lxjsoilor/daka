const moment = require('moment');
const { http, isDuringDate } = require('./util')
const loginUrl = `http://moa.hucais.com:89/client.do?method=login&loginid=09064172&password=123456&isneedmoulds=1&client=1&clientver=6.6.0.1&udid=0a84fac33fb3065e&token=&clientos=HUAWEIVOG-AL00&clientosver=10&clienttype=android&language=zh&country=CN&authcode=&dynapass=&tokenpass=&relogin=0&clientuserid=&tokenFromThird=&signatureValue=&signAlg=&randomNumber=&cert=`
const currentDateString = moment().format('YYYY-MM-DD');
let timeRangeArr = [
    [`${currentDateString} 07:00:00`, `${currentDateString} 08:00:00`],
    [`${currentDateString} 12:00:00`, `${currentDateString} 13:30:00`],
    [`${currentDateString} 17:30:00`, `${currentDateString} 23:00:00`]
]
let flagArr = [0, 0, 0]
async function handlerClock() {
    const { res: loginResponse, body: loginBody } = await http(
        loginUrl
    );
    let tempArr = loginResponse.headers['set-cookie'];
    let str = '';
    let arr = [];
    tempArr.forEach(item => {
        arr.push(item.replace(';Max-Age=604800;HTTPOnly;', ''))
    });
    arr[arr.length - 1] = arr[arr.length - 1].replace('; path=/', '')
    str = arr.join(';');
    const { res: listResponse, body: listBody } = await http(
        `http://moa.hucais.com:89/client.do?method=postjson&operation=getList&sessionkey=${loginBody.sessionkey}&scope=10&pageindex=1&pagesize=&beginQueryDate=${currentDateString}+00%3A00%3A00&endQueryDate=${currentDateString}+23%3A59%3A59&operaterId=&signType=`,
        str
    );
    let printList = JSON.parse(listBody || '{}').list || [];
    printList = printList.map(item => {
        return `${item.operateDate} ${item.operateTime}`
    })
    let currentIndex = '';
    printList.forEach(item => {
        timeRangeArr.forEach((date, i) => {
            if (isDuringDate(date[0], date[1], item)) {
                flagArr[i] += 1
            }
            if (isDuringDate(date[0], date[1])) {
                currentIndex = i;
            }
        })
    });
    if ((flagArr[currentIndex] <= 0 && currentIndex != 1) || (flagArr[currentIndex] <= 1 && currentIndex === 1)) {
        console.log('daka')
        await http(
            `http://moa.hucais.com:89/client.do?method=postjson&module=17&scope=10&operation=create&sessionkey=${body.sessionkey}&latitudeLongitude=22.849974999999986,113.72192599999997&address=${encodeURIComponent('广东省东莞市沙河路49号靠近虎彩印艺工厂区')}&remark=${encodeURIComponent('无')}&attachmentIds=`,
            str
        )
    }
};

handlerClock();