/* import * as d3 from 'd3';

console.log(d3); */
class DataObj {
  constructor(summa, currency, date, type) {
    this.currency = currency;
    this.date = date;
    this.summa = summa;
    this.type = type;
    this.timeStamp = Date.now();
  }
}

let dataColection = [];
const inputForm = document.forms.inputForm1;
let inputSummma;
let inputCurrency;
let inputDate;
let inputType;
const sendForm = document.getElementById('button1');

function addDataObj() {
  dataColection.push(new DataObj(inputSummma, inputCurrency, inputDate, inputType));
}

function buildGraph() {

}

const objlist = document.getElementById('objlist');

function showData() {
  const dataItem = dataColection;

  let cardItem = '';
  const clearItem = '';

  dataItem.forEach((data) => {
    cardItem
  += `

  <div style="border:2px solid #ccc;width: 300px">
  <p>${data.type}</p>
  <p>${data.date} </p>
  <p>${data.summa}<span> ${data.currency}</span></p>
  <button class="deleteObj" id = "${data.timeStamp}"
        type="button">
    Delete
</button>
  </div>

  `;
  });
  objlist.innerHTML = '';
  objlist.insertAdjacentHTML('afterbegin', cardItem);
}

function click(e) {
  e.preventDefault();
  inputSummma = inputForm.elements.moneyCount.value;
  inputCurrency = inputForm.elements.spentCurrency.value;
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
  addDataObj();
  showData();
}

function deleteDataObj(e) {
  let timeStamp = e.target.id;
  dataColection = dataColection.filter((obj) => !(obj.timeStamp == timeStamp));
  showData();
}

inputForm.addEventListener('submit', click);
objlist.addEventListener('click', deleteDataObj)