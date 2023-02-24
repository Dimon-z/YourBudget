let currencyObj = {};
async function getCurrData() {
    let currencyDataResponse = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`)
    let answer = await currencyDataResponse.json()
    return answer.Valute;
  }
  module.exports = currencyObj = getCurrData()
