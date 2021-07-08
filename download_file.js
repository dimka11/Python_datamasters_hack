const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const path = require('path')
const unzipper = require('unzipper');

// let start_date = '1.4.2020';
// let end_date = '15.4.2020';

let start_date = '1.1.2015';
let end_date = '15.1.2015';
let region = 65;
let csv_url = 'getCardsCSV';
let xml_url = 'getCardsXML';
let file_ext = 'csv';

process.chdir(path.join('D:', 'code', 'Python', 'data'));



(async () => {

      const response = await fetch(`http://stat.gibdd.ru/${csv_url}`, { //use this url http://stat.gibdd.ru/getCardsXML  for XML
      // headers
      "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,ru;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json; charset=UTF-8",
        "pragma": "no-cache",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "JSESSIONID=E62156F8EF6391DAE1474205025AEE07"
      },
      "referrer": "http://stat.gibdd.ru/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": `{\"data\":\"{\\\"date_st\\\":\\\"${start_date}\\\",\\\"date_end\\\":\\\"${end_date}\\\",\\\"ParReg\\\":\\\"877\\\",\\\"order\\\":{\\\"type\\\":1,\\\"fieldName\\\":\\\"dat\\\"},\\\"reg\\\":[\\\"${region}\\\"],\\\"ind\\\":\\\"1\\\",\\\"exportType\\\":1}\"}`,
      "method": "POST",
      "mode": "cors"
    });
      const json = await response.json();
      console.log(json);
      // console.log(json.data);
      id = json.data;
      const file = fs.createWriteStream(`${start_date}.zip`);
      const request = http.get(`http://stat.gibdd.ru/getPDFbyId?data=${id}`, function(response) {
        response.pipe(file);
        file.on('finish', ()=> {
          frs = fs.createReadStream(`${start_date}.zip`).pipe(unzipper.Extract({ path: '.' }));
          frs.on('close', ()=> {
            fs.renameSync('Карточки ДТП.csv',`${start_date}.csv`, (err)=> {});
            fs.unlinkSync(`${start_date}.zip`);
          })
        })
      });

})();













// 


// c  '1.1.2015'


// в csv добавить широту после долготы и исправить остальные заголовки и еще много чего