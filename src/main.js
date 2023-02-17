/* eslint-disable linebreak-style */
import './style.css';
import Chart from 'chart.js/auto';

const autocolors = window['chartjs-plugin-autocolors'];
Chart.register(autocolors);
class DataObj {
  constructor(summa, currency, date, type) {
    this.currency = currency;
    this.date = date;
    this.summa = summa;
    this.type = type;
    this.timeStamp = Date.now();
  }
}
/* currency: "бакинских"

date: Date Fri Feb 03 2023 03:00:00 GMT+0300 (GMT+03:00)

summa: "100500"

timeStamp: 1676469292193

type: "learning" */

let dataColection = [];
const inputForm = document.forms.inputForm1;
let inputSummma;
let inputCurrency;
let inputDate;
let inputType;
const sendForm = document.getElementById('button1');
const select = document.getElementById('expence');
/* function getSelectArr(select){
  let newarr = [];
  for (let i = 0; i < select.options.length; i++) {
     newarr[i] = select[i].value;

  }
  return newarr;
}
const selectArr = getSelectArr(select);
console.log(selectArr) */
function addDataObj() {
  dataColection.push(new DataObj(inputSummma, inputCurrency, inputDate, inputType));
}
let expencesSummArr = [];
let expencesTypeArr = [];

function getChartDataFromDataCollection(dataColection) {
// функция должна принимать массив обьктов
// выводить массив из двух массивов, один с названиями расходов, второй с суммой,
// порядок данных этих массивов должен совпадать.
let DataMap = new Map();
dataColection.forEach(element => {
if (DataMap.has(element.type)) {
  DataMap.set(element.type,(+DataMap.get(element.type) + +element.summa))
} else {
DataMap.set(element.type, +element.summa)
}
});
return DataMap;
}

function divideByTime(start, end, dataColection) {
// функция принимает два таймстампа и массив обьктов данных,
// возвращает новый массив обьектов данных который содержат все обькты за заданый промежуток времени
}

/* function getdataFromdataObj() {
  expencesTypeArr = [...new Set(dataColection.map(((el) => el.type)))];
   for (let i = 0; i < dataColection.length; i++) {
    switch (dataColection[i].type) {
      case 'food':
        var food = 0;
        food = food + +dataColection[i].summa;
        break;
      case 'health':
        var health = 0;
        health = health + +dataColection[i].summa;
        break;
      case 'hobby':
        var hobby = 0;
        hobby = hobby + +dataColection[i].summa;
        break;
      case 'work':
        var work = 0;
        work = work + +dataColection[i].summa;
        break;
      case 'learning':
        var learning = 0;
        learning = learning + +dataColection[i].summa;
        break;
      case 'house':
        var house = 0;
        house = house + +dataColection[i].summa;
        break;
      case 'logistic':
        var logistic = 0;
        logistic = logistic + +dataColection[i].summa;
        break;
      case 'fun':
        var fun = 0;
        fun = fun + +dataColection[i].summa;
        break;
      case 'subscr':
        var subscr = 0;
        subscr = subscr + +dataColection[i].summa;
        break;
      case 'travel':
        var travel = 0;
        travel = travel + +dataColection[i].summa;
        break;
      case 'taxes':
        var taxes = 0;
        taxes = taxes + +dataColection[i].summa;
        break;
      case 'other':
        var other = 0;
        other = other + +dataColection[i].summa;
        break;
      default: throw new Error('guf RIP');
    }
    expencesSummArr = [food, health, hobby, work, learning, house, logistic, fun, subscr, travel, taxes, other];
    console.log(expencesSummArr)
     expencesSummArr = dataColection.forEach((el) => {
      if (el.type){
        el.summa
      }
    });
  }
} */
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
  <p>${dataItem.type}</p>
  <p>${dataItem.date} </p>
  <p>${dataItem.summa}<span> ${dataItem.currency}</span></p>
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
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
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
