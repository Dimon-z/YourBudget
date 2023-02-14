import './style.css';


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

function insertData() {
  const dataItem = dataColection[dataColection.length-1];

  let cardItem = '';
  const clearItem = '';

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
  const button = document.getElementById(`${dataItem.timeStamp}`)
  button.addEventListener('click', deleteDataObj);
}

function click(e) {
  e.preventDefault();
  inputSummma = inputForm.elements.moneyCount.value;
  inputCurrency = inputForm.elements.spentCurrency.value;
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
  addDataObj();
  insertData();
}

function deleteDataObj(e) {
  const timeStamp = e.target.id;
  const button = document.getElementById(`${timeStamp}`);
  button.removeEventListener('click', deleteDataObj);
  button.parentNode.remove();
}

inputForm.addEventListener('submit', click);

