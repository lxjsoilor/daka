const request=require('request');

function isDuringDate(begin, end, current='') {
    let currentDate = current ? +new Date(current) : +new Date(),
        beginDate = +new Date(begin),
        endDate = +new Date(end);
    return (currentDate >= beginDate && currentDate <= endDate);
}
const currentDateString = new Date().toLocaleDateString();
let tempArr = [
    [`${currentDateString} 07:00:00`, `${currentDateString} 08:00:00`],
    [`${currentDateString} 12:00:00`, `${currentDateString} 13:30:00`],
    [`${currentDateString} 17:30:00`, `${currentDateString} 23:00:00`]
]
let flagArr = [0, 0, 0]
request({
    // url: `http://moa.hucais.com:89/client.do?method=postjson&operation=getList&sessionkey=${body.sessionkey}=17&scope=10&pageindex=1&pagesize=&beginQueryDate=2020-03-11+00%3A00%3A00&endQueryDate=2020-03-11+23%3A59%3A59&operaterId=&signType=`,
    url: `http://moa.hucais.com:89/client.do?method=postjson&operation=getList&sessionkey=abc0KhpBBFSrjewKMQmex=17&scope=10&pageindex=1&pagesize=&beginQueryDate=2020-03-24+00%3A00%3A00&endQueryDate=2020-03-24+23%3A59%3A59&operaterId=&signType=`,
    method: "POST",
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Cookie": 'userid=1929;userKey=dfd01294-deb8-4c48-8cc7-9cc64d79d708;JSESSIONID=abc0KhpBBFSrjewKMQmex;ClientUDID=0a84fac33fb3065e;ClientToken=;ClientVer=6.6.0.1;ClientType=android;ClientLanguage=zh;ClientCountry=CN;ClientMobile=;setClientOS=HUAWEIVOG-AL00;setClientOSVer=10;Pad=false;JSESSIONID=abc0KhpBBFSrjewKMQmex'
    },
}, (printListErr, printListRes, printListBody) => {
    let printList = JSON.parse(printListBody || '{}').list || [];
    printList = printList.map(item => {
        return `${item.operateDate} ${item.operateTime}`
    })
    let currentIndex = '';
    printList.forEach(item => {
        tempArr.forEach((date, i) => {
            if(isDuringDate(date[0], date[1], item)) {
                flagArr[i] += 1
            }
            if(isDuringDate(date[0], date[1])) {
                currentIndex = i;
            }
        })
    });
    if((flagArr[currentIndex] <= 0 && currentIndex != 1) || (flagArr[currentIndex] <= 1 && currentIndex === 1)) {
        console.log('打卡')
    }
})