import './style.css';
import './reset.css'
import Chart from 'chart.js/auto';
let currencyObjPromise = require( `./script.js`)
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
const sendForm = document.getElementById('button1');
const selectExpence = document.getElementById('expence');
const selectCurr = document.getElementById('spentCurrency');
let expencesSummArr = [];
let expencesTypeArr = [];
let labelsMAp = new Map();

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
/* currency: "бакинских"

date: Date Fri Feb 03 2023 03:00:00 GMT+0300 (GMT+03:00)

summa: "100500"

timeStamp: 1676469292193

type: "learning" */

async function currencyInjector() {
  await currencyObjPromise;
  currencyObjPromise.then((val)=>{
    let valutesArr = [['Рубль','RUB','1']];
    let arr = Object.values(val)
    arr.forEach((element)=>{
        valutesArr.push([element.Name,element.CharCode, element.Value])
    })
    console.log(valutesArr)
    valutesArr.forEach((element)=>{
      selectCurr.appendChild( new Option(element[0],element[1]))
    })
  })
};
currencyInjector();
function addDataObj() {
  dataColection.push(new DataObj(inputSummma, inputCurrency, inputDate, inputType, inputTypeName ,inputCurrencyName));
}


function getChartDataFromDataCollection(dataColection) {
// функция должна принимать массив обьктов
// выводить массив из двух массивов, один с названиями расходов, второй с суммой,
// порядок данных этих массивов должен совпадать.
  let DataMap = new Map();
  dataColection.forEach(element => {
   if (DataMap.has(element.typeName)) {
    DataMap.set(element.typeName,(+DataMap.get(element.typeName) + +element.summa))
    } else {
    DataMap.set(element.typeName, +element.summa)
    }
  });
  return DataMap;
}

function labelProxy() {

}

function divideByTime(start, end, dataColection) {
// функция принимает два таймстампа и массив обьктов данных,
// возвращает новый массив обьектов данных который содержат все обькты за заданый промежуток времени
}

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

const objlist = document.getElementById('objlist');
function renewChart() {
  let data = getChartDataFromDataCollection(dataColection);
  expencesTypeArr = Array.from(data.keys())
  expencesSummArr = Array.from(data.values())
  myPieChart.data.labels = expencesTypeArr[0] ? expencesTypeArr : ['NoData'];
  myPieChart.data.datasets = [
    {
      // Chart data
      data: expencesSummArr[0] ? expencesSummArr : ['1'],
      label: 'Expence type',
      borderWidth: 0.3,
      borderColor: 'black',
    },
  ];
  myPieChart.update();
}

function insertData() {
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

function click(e) {
  e.preventDefault();
  inputSummma = inputForm.elements.moneyCount.value;
  inputCurrency = inputForm.elements.spentCurrency.value;
  inputCurrencyName = document.forms.inputForm1.elements.spentCurrency.selectedOptions[0].text ;
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
  inputTypeName = inputForm.elements.expence.selectedOptions[0].text;
  addDataObj();
  insertData();
  renewChart();
}

function deleteExpenceData(deletionOption) {
  dataColection = dataColection.filter((obj) => !(+obj.timeStamp === +deletionOption));
}

function expenceNodeRemove(e) {
  const timeStamp = e.target.id;
  const button = document.getElementById(`${timeStamp}`);
  button.removeEventListener('click', expenceNodeRemove);
  button.parentNode.remove();
  deleteExpenceData(timeStamp);
  renewChart();
}

inputForm.addEventListener('submit', click);

//-------------------конец, дальше не смотреть XD ---------------//


