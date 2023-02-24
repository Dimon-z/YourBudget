let currencyObj = {};
async function getCurrData() {
  const currencyDataResponse = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
  const answer = await currencyDataResponse.json();
  return answer.Valute;
}
module.exports = currencyObj = getCurrData();
