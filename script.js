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
	const operation = amount < 0 ? '-' : '+';
	const CSSClass = amount < 0 ? 'minus' : 'plus';
	const amountWithoutOperation = Math.abs(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	const li = document.createElement('li');

	li.classList.add(CSSClass);
	li.innerHTML = `
	${name} <span>${operation} R$ ${amountWithoutOperation}</span>
	<button class="delete-btn" onClick="removeTransaction(${id})">x</button>	
`

		transactionsUl.prepend(li)
}

const formatCurrencyBR = num => Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getExpense = transactionsAmount => formatCurrencyBR(Math.abs(transactionsAmount
	.filter(value => value < 0)
	.reduce((acc, value) => acc + value, 0)));
 

const getTotal = transactionsAmount => formatCurrencyBR(transactionsAmount
	.reduce((acc, transaction) => acc + transaction, 0)); 

const getIncome = transactionsAmount => formatCurrencyBR(transactionsAmount
	.filter(value => value > 0)
	.reduce((acc, value) => acc + value, 0)); 

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
	const transactionAmountStr = inputTransactionAmount.value.trim();
	
	const isNegative = transactionAmountStr.indexOf('-') > -1;
	const cleanAmountStr = transactionAmountStr.replace(/\D/g, "");
	const parsedAmount = (isNegative ? -1 : 1) * (Number(cleanAmountStr) / 100);

	const isSomeInputEmpty = transactionAmountStr === '' || transactionName === '';

	if (isSomeInputEmpty || cleanAmountStr === '') {
		alert('Preencha tanto o nome quanto o valor da transação');
		return
	}

	addToTransactionArray(transactionName, parsedAmount)
	init();
	updateLocalStorage();
	form.reset();
}

inputTransactionAmount.addEventListener('input', (e) => {
	let value = e.target.value;
	const isNegative = value.indexOf('-') > -1;
	
	value = value.replace(/\D/g, "");

	if (value === "") {
		e.target.value = isNegative ? '-' : '';
		return;
	}

	let numericValue = Number(value) / 100;
	e.target.value = (isNegative ? '-' : '') + numericValue.toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
});

form.addEventListener('submit', handleFormSubmit);