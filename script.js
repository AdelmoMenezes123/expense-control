

export class Backend {	

	constructor() {
		this.transactionsUl = document.querySelector('#transactions');
		this.icomeDisplay = document.querySelector('#money-plus');
		this.expanseDisplay = document.querySelector('#money-minus');
		this.balancelDisplay = document.querySelector('#balance');
	
		this.dummyTransactions = [
			{ id: 1, name: 'Bolo de brigadeiro', amount: -20 },
			{ id: 2, name: 'Salario', amount: 300 },
			{ id: 3, name: 'Torta de frango', amount: -10 },
			{ id: 4, name: 'Violao', amount: 150 },
		];
	}

	init() {
		const me = this;
		this.dummyTransactions.forEach(me.addTransactionIntoDOM)
		me.updateBalanceValue(this.dummyTransactions)
	}

	updateBalanceValue = (dummyTransactions) => {
		const me = this;
		const transactionsAmount = dummyTransactions.map(transaction => transaction.amount);
		const total = transactionsAmount.reduce((acc, transaction) => acc + transaction, 0).toFixed(2);
		const income = transactionsAmount.filter(value=> value > 0).reduce((acc, value) => acc + value, 0).toFixed(2);
		const expanse =Math.abs( transactionsAmount.filter(value => value < 0).reduce((acc, value) => acc + value, 0)).toFixed(2);
	
		me.balancelDisplay.textContent = `R$ ${total}`
		me.icomeDisplay.textContent = `R$ ${income}`
		me.expanseDisplay.textContent = `R$ ${expanse}`
	}

	addTransactionIntoDOM = ({ amount, name, id }) => {
		const operation = amount < 0 ? '-' : '+'
		const CSSClass = amount < 0 ? 'minus' : 'plus'
		const amountWithoutOperation = Math.abs(amount)
		const li = document.createElement('li');

		li.classList.add(CSSClass);
		li.innerHTML = `
		${name} <span>${operation} R$ ${amountWithoutOperation}</span><button class="delete-btn">x</button>	
	`

		this.transactionsUl.prepend(li)
	}
}

let backend = new Backend();
backend.init()