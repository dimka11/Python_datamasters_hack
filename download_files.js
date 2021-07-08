const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const path = require('path')
const unzipper = require('unzipper');

let start_date = '01.04.2020';
let end_date = '15.04.2020';
let region = 65;
let csv_url = 'getCardsCSV';
let xml_url = 'getCardsXML';
let file_ext = 'csv';

process.chdir(path.join('D:', 'code', 'Python', 'data'));

// let years = [2015, 2016, 2017, 2018, 2019, 2020];
let years = [2020];
let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let day_rng = [0,1];


(async () => {

  for (let year of years) {
    for (let month of months) {
        for (let r of day_rng) {
           await download_file(year, month, r);
          }
    }
  }

})();





// async function download_file(year, month, r) {

  
//   start_date = get_start_date(year, month, r);
//   end_date = get_end_date(year, month, r);

//   console.log (`downloading data from ${start_date} to ${end_date}`)

//   const response = await fetch(`http://stat.gibdd.ru/${csv_url}`, { //use this url http://stat.gibdd.ru/getCardsXML  for XML
//   // headers
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,ru;q=0.7",
//     "cache-control": "no-cache",
//     "content-type": "application/json; charset=UTF-8",
//     "pragma": "no-cache",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "JSESSIONID=E62156F8EF6391DAE1474205025AEE07"
//   },
//   "referrer": "http://stat.gibdd.ru/",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": `{\"data\":\"{\\\"date_st\\\":\\\"${start_date}\\\",\\\"date_end\\\":\\\"${end_date}\\\",\\\"ParReg\\\":\\\"877\\\",\\\"order\\\":{\\\"type\\\":1,\\\"fieldName\\\":\\\"dat\\\"},\\\"reg\\\":[\\\"${region}\\\"],\\\"ind\\\":\\\"1\\\",\\\"exportType\\\":1}\"}`,
//   "method": "POST",
//   "mode": "cors"
// });
//   const json = await response.json();
//   console.log(json);
//   id = json.data;
//   const file = fs.createWriteStream(`${start_date}.zip`);
//   const request = http.get(`http://stat.gibdd.ru/getPDFbyId?data=${id}`, function(response) {
//     console.log('Next already iteration started?! WHY?')
//     response.pipe(file);
//     file.on('close', ()=> {
//       frs = fs.createReadStream(`${start_date}.zip`).pipe(unzipper.Extract({ path: '.' }));
//       frs.on('close', ()=> {
//         fs.renameSync('Карточки ДТП.csv',`${start_date}.csv`, (err)=> {});
//         fs.unlinkSync(`${start_date}.zip`);
//       })
//     })
//   });
// }



async function download_file(year, month, r) {

  
  start_date = get_start_date(year, month, r);
  end_date = get_end_date(year, month, r);

  console.log (`downloading data from ${start_date} to ${end_date}`)

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
  id = json.data;
  const file = fs.createWriteStream(`${start_date}.zip`);
  const res = await fetch(`http://stat.gibdd.ru/getPDFbyId?data=${id}`);

  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(`${start_date}.zip`);
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
    
      frs = fs.createReadStream(`${start_date}.zip`).pipe(unzipper.Extract({ path: '.' }));
      frs.on('close', ()=> {
        fs.rename('Карточки ДТП.csv',`${start_date}.csv`, ()=> {
          fs.unlink(`${start_date}.zip`, ()=>{
            resolve();
          });
        });
        
      })
    });
  });





}


function get_start_date(year, month, r) {
  let day;
  if (r == 0) {
    day = 1
  } else {
    day = 16
  }
  return `${day}.${month}.${year}`;
};

function get_end_date(year, month, r) {
  let day;
  if (r == 0) {day = 15} else {
    day = LastDayOfMonth(year, month) }
  return `${day}.${month}.${year}`;
};

function LastDayOfMonth(Year, Month) {
  return new Date((new Date(Year, Month, 1)) - 1).getDate();;
};
// в csv добавить широту после долготы и исправить остальные заголовки и еще много чего