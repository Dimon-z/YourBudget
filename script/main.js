
class DataObj {
  constructor(summa, currency, date, type) {
    this.currency = currency;
    this.date = date;
    this.summa = summa;
    this.type = type;
  }
}

const dataColection = [];
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

function click(e) {
  e.preventDefault();
  inputSummma = inputForm.elements.moneyCount.value;
  inputCurrency = inputForm.elements.spentCurrency.value;
  inputDate = new Date(inputForm.elements.spentDate.value);
  inputType = inputForm.elements.expence.value;
  addDataObj();
  console.log(dataColection);
}

inputForm.addEventListener('submit', click);
