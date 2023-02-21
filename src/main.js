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
let inputBaseCurrency;
const sendForm = document.getElementById('button1');
const selectExpence = document.getElementById('expence');
const selectCurr = document.getElementById('spentCurrency');
const selectBaseCurr = document.getElementById('baseCurrency');
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

//--------------------вставляем валюты в селекты----------------\\
async function currencyInjector() {
  await currencyObjPromise;
  currencyObjPromise.then((val)=>{
    let valutesArr = [['Рубль','RUB','1']];
    let arr = Object.values(val)
    arr.forEach((element)=>{
        valutesArr.push([element.Name,element.CharCode, element.Value])
    })
    valutesArr.forEach((element)=>{
      selectCurr.appendChild( new Option(element[0],element[1]))
      selectBaseCurr.appendChild( new Option(element[0],element[1]))
    })
  })
};
currencyInjector();
//-----------функция добавления обькта расходов в массив обьектов расходов------------\\
function addDataObj() {
  dataColection.push(new DataObj(inputSummma, inputCurrency, inputDate, inputType, inputTypeName ,inputCurrencyName));
}
//---------------------------функция нормализации валют---------------------------\\
/* function currencyExchanger(dataColection,base){
  let sameCurrencyDataCollection = [];
  dataColection.forEach((value)=>{
    value.
  }
  )

  return sameCurrencyDataCollection;
}
 */
//----функция извлекает данные для графика, суммирует одинаковые категории и добавляет их мапу-----\\
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

//--------функция фильтрует данные по заданным временным рамкам------\\
function divideByTime(start, end, dataColection) {
// функция принимает два таймстампа и массив обьктов данных,
// возвращает новый массив обьектов данных который содержат все обькты за заданый промежуток времени
}
//------собственно наш график-------\\
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
//--------------функция обновляет график--------------\\
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
      label: 'Expence type' /* + baseCurrency */,
      borderWidth: 0.3,
      borderColor: 'black',
    },
  ];
  myPieChart.update();
}
//----------функция выводит карточки расходов------\\
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
//-----------функция обработчик клика кнопки формы-------------\\
// ps проорал в голосину когда писал название XD
function submitform(e) {
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
//-------функция удаляет данные из массива в след за удалением карточки------\\
function deleteExpenceData(deletionOption) {
  dataColection = dataColection.filter((obj) => !(+obj.timeStamp === +deletionOption));
}
//-------функция удаляет узел с карточкой по кнопке удаления-----\\
function expenceNodeRemove(e) {
  const timeStamp = e.target.id;
  const button = document.getElementById(`${timeStamp}`);
  button.removeEventListener('click', expenceNodeRemove);
  button.parentNode.remove();
  deleteExpenceData(timeStamp);
  renewChart();
}
//------функция меняет валюту графика-----\\
function changeBaseCurrency() {
  inputBaseCurrency = inputForm.elements.baseCurrency.value

}

inputForm.baseCurrency.addEventListener('input',changeBaseCurrency)

inputForm.addEventListener('submit', submitform);

//-------------------конец, возвращайтесь, дальше живут драконы---------------//


