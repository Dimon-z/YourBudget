/* eslint-disable linebreak-style */
import './style.css';
import './reset.css';
import Chart from 'chart.js/auto';

const currencyObjPromise = require('./request.js');
/* require.context('../assets/svg/', false, /\.*\.svg$/); */
const autocolors = window['chartjs-plugin-autocolors'];
Chart.register(autocolors);
let dataColection = [];
const inputForm = document.forms.inputForm1;
let inputSummma;
let inputCurrency;
let inputCurrencyName;
let inputTypeName;
let inputDate;
let inputType;
let inputBaseCurrency;
let baseCurrencyName;
const sendForm = document.getElementById('button1');
const selectExpence = document.getElementById('expence');
const selectCurr = document.getElementById('spentCurrency');
const selectBaseCurr = document.getElementById('baseCurrency');
let expencesSummArr = [];
let expencesTypeArr = [];

class DataObj {
  constructor(summa, currency, date, type, typeName, currencyName) {
    this.currency = currency;
    this.date = date;
    this.summa = summa;
    this.type = type;
    this.typeName = typeName;
    this.currencyName = currencyName;
    this.timeStamp = Date.now();
  }
}

// --------------------вставляем валюты в селекты----------------\\
const valutesArr = [['Рубль', 'RUB', '1']];
async function currencyInjector() {
  await currencyObjPromise;
  currencyObjPromise.then((val) => {
    const arr = Object.values(val);
    arr.forEach((element) => {
      valutesArr.push([element.Name, element.CharCode, element.Value]);
    });
    valutesArr.forEach((element) => {
      selectCurr.appendChild(new Option(element[0], element[1]));
      selectBaseCurr.appendChild(new Option(element[0], element[1]));
    });
  });
}
currencyInjector();
// -----------функция добавления обькта расходов в массив обьектов расходов------------\\
function addDataObj() {
  dataColection.push(new DataObj(inputSummma, inputCurrency, inputDate, inputType, inputTypeName, inputCurrencyName));
}
// ---------------------------функция нормализации валют---------------------------\\
function currencyExchanger(dataColection, baseCurrency) {
  const sameCurrencyDataCollection = [];
  dataColection.forEach((value) => {
    if (value.currency === baseCurrency) {
      sameCurrencyDataCollection.push(value);
    } else {
      value.summa = exchange(value.summa, value.currency, baseCurrency);
      value.currency = baseCurrency;
      value.currencyName = baseCurrencyName;
      sameCurrencyDataCollection.push(value);
    }
  });
  return sameCurrencyDataCollection;
}

// -----------функция обмена валюты---------\\
function exchange(summa, currency, baseCurrency) {
  const bot = valutesArr.find((element) => element[1] == baseCurrency);
  const top = valutesArr.find((element) => element[1] == currency);
  const curs = top[2] / bot[2]; // [2] === currency.value
  const exchangedSumma = summa * curs;
  return exchangedSumma;
}
// ----функция извлекает данные для графика, суммирует одинаковые категории и добавляет их мапу---\\
function getChartDataFromDataCollection(dataColection) {
// функция должна принимать массив обьктов
// выводить массив из двух массивов, один с названиями расходов, второй с суммой,
// порядок данных этих массивов должен совпадать.
  const DataMap = new Map();
  dataColection.forEach((element) => {
    if (DataMap.has(element.typeName)) {
      DataMap.set(element.typeName, (+DataMap.get(element.typeName) + +element.summa));
    } else {
      DataMap.set(element.typeName, +element.summa);
    }
  });
  return DataMap;
}

// --------функция фильтрует данные по заданным временным рамкам------\\
function divideByTime(start, end, dataColection) {
  let timeFilteredDC = [];
  timeFilteredDC = dataColection.filter((element) => {
    if (element.timeStamp >= start && element.timeStamp <= end) {
      return true;
    }
    return false;
  });
  return timeFilteredDC;
}
// ------собственно наш график-------\\
const pieChartContext = document
  .getElementById('diagramm__field')
  .getContext('2d');
const myPieChart = new Chart(pieChartContext, {
  type: 'pie',
  data: {
    labels: expencesTypeArr,
    datasets: [
      {
        data: expencesSummArr,
        label: 'Expence type',
        borderWidth: 0.3,
        borderColor: 'black',
      },
    ],
  },
  options: {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      autocolors: {
        mode: 'data',
      },
    },
  },
});
// --------------функция обновляет график--------------\\
const objlist = document.getElementById('objlist');
function renewChart(dataColection) {
  const data = getChartDataFromDataCollection(dataColection);
  expencesTypeArr = Array.from(data.keys());
  expencesSummArr = Array.from(data.values());
  myPieChart.data.labels = expencesTypeArr[0] ? expencesTypeArr : ['NoData'];
  myPieChart.data.datasets = [
    {
      // Chart data
      data: expencesSummArr[0] ? expencesSummArr : ['0'],
      label: `Категория расходов, ${baseCurrencyName || ''}`,
      borderWidth: 0.3,
      borderColor: 'black',
    },
  ];
  myPieChart.update();
}
// ----------функция выводит карточки расходов------\\
function insertData(dataColection) {
  const dataItem = dataColection[dataColection.length - 1];

  let cardItem = '';
  cardItem
  += `

  <div style="border:2px solid #ccc;width: 300px">
  <p>${dataItem.typeName}</p>
  <p>${dataItem.date} </p>
  <p>${dataItem.summa}<span> ${dataItem.currencyName}</span></p>
  <button class="deleteObj" id = "${dataItem.timeStamp}"
        type="button">
    Delete
</button>
  </div>

  `;
  objlist.insertAdjacentHTML('beforeend', cardItem);
  const button = document.getElementById(`${dataItem.timeStamp}`);
  button.addEventListener('click', expenceNodeRemove);
}
// -----------функция обработчик клика кнопки формы-------------\\
// ps проорал в голосину когда писал название XD
function submitform(e) {
  e.preventDefault();
  inputSummma = inputForm.elements.moneyCount.value;
  inputCurrency = inputForm.elements.spentCurrency.value;
  inputCurrencyName = document.forms.inputForm1.elements.spentCurrency.selectedOptions[0].text;
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
  inputTypeName = inputForm.elements.expence.selectedOptions[0].text;
  addDataObj();
  insertData(dataColection);
  changeBaseCurrency();
  renewChart(dataColection);
}
// -------функция удаляет данные из массива в след за удалением карточки------\\
function deleteExpenceData(deletionOption) {
  dataColection = dataColection.filter((obj) => !(+obj.timeStamp === +deletionOption));
}
// -------функция удаляет узел с карточкой по кнопке удаления-----\\
function expenceNodeRemove(e) {
  const timeStamp = e.target.id;
  const button = document.getElementById(`${timeStamp}`);
  button.removeEventListener('click', expenceNodeRemove);
  button.parentNode.remove();
  deleteExpenceData(timeStamp);
  renewChart(dataColection);
}
// ------функция меняет валюту графика-----\\
function changeBaseCurrency() {
  inputBaseCurrency = inputForm.elements.baseCurrency.value;
  baseCurrencyName = inputForm.elements.baseCurrency.selectedOptions[0].text;
  const chartdata = currencyExchanger(dataColection, inputBaseCurrency);
  renewChart(chartdata);
}

inputForm.baseCurrency.addEventListener('input', changeBaseCurrency);

inputForm.addEventListener('submit', submitform);

// -------------------конец, возвращайтесь, дальше живут драконы---------------//
