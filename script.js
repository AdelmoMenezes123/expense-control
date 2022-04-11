const transactionsUl = document.querySelector('#transactions');
const icomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balancelDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTrasactions =
	JSON.parse(localStorage.getItem('transactions'));

let transactions =
	localStorage
		.getItem('transactions') !== null
		? localStorageTrasactions
		: [];

const removeTransaction = ID => {
	transactions =
		transactions
			.filter(({ id }) => id !== ID);
	updateLocalStorage();
	init();
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
	const operation = amount < 0 ? '-' : '+'
	const CSSClass = amount < 0 ? 'minus' : 'plus'
	const amountWithoutOperation = Math.abs(amount)
	const li = document.createElement('li');

	li.classList.add(CSSClass);
	li.innerHTML = `
	${name} <span>${operation} R$ ${amountWithoutOperation}</span>
	<button class="delete-btn" onClick="removeTransaction(${id})">x</button>	
`

		transactionsUl.prepend(li)
}

const getExpense = transactionsAmount => Math.abs(transactionsAmount
	.filter(value => value < 0)
	.reduce((acc, value) => acc + value, 0))
	.toFixed(2);
 

const getTotal = transactionsAmount => transactionsAmount
	.reduce((acc, transaction) => acc + transaction, 0)
	.toFixed(2); 

const getIncome = transactionsAmount => transactionsAmount
	.filter(value => value > 0)
	.reduce((acc, value) => acc + value, 0)
	.toFixed(2); 

const updateBalanceValue = () => {
	const transactionsAmount = transactions.map(({ amount }) => amount);
	const total = getTotal(transactionsAmount)
	const income = getIncome(transactionsAmount)
	const expense = getExpense(transactionsAmount)

	balancelDisplay.textContent = `R$ ${total}`
	icomeDisplay.textContent = `R$ ${income}`
	expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
	transactionsUl.innerHTML = '';
	transactions.forEach(addTransactionIntoDOM)
	updateBalanceValue()
}

init();

const updateLocalStorage = () => {
	localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateId = () => Math.round(Math.random() * 1000);

const addToTransactionArray = (transactionName, transactionAmount) => {
	transactions.push({
		id: generateId(),
		name: transactionName,
		amount: Number(transactionAmount),
	});
}

const handleFormSubmit = event => {
	event.preventDefault();

	const transactionName = inputTransactionName.value.trim();
	const transactionAmount = inputTransactionAmount.value.trim();
	const isSomeInputEmpty = transactionAmount === '' || transactionName === '';

	if (isSomeInputEmpty) {
		alert('Preencha tanto o nome quanto o valor da transação');
		return
	}

	addToTransactionArray(transactionName, transactionAmount)
	init();
	updateLocalStorage();
	form.reset()
 }

form.addEventListener('submit', handleFormSubmit);