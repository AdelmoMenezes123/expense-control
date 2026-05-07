const transactionsUl = document.querySelector("#transactions");
const icomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balancelDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");
const inputTransactionDate = document.querySelector("#date");
const errorMessage = document.querySelector("#error-message");
const btnIncome = document.querySelector("#btn-income");
const btnExpense = document.querySelector("#btn-expense");

let transactionType = "plus"; // default

const setType = (type) => {
  transactionType = type;
  if (type === "plus") {
    btnIncome.classList.add("active");
    btnExpense.classList.remove("active");
  } else {
    btnIncome.classList.remove("active");
    btnExpense.classList.add("active");
  }
};

btnIncome.addEventListener("click", () => setType("plus"));
btnExpense.addEventListener("click", () => setType("minus"));

// Set default date to today
const today = new Date().toISOString().split("T")[0];
if (inputTransactionDate) {
  inputTransactionDate.value = today;
}

const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 3000);
};

const localStorageTrasactions = (() => {
  try {
    return JSON.parse(localStorage.getItem("transactions"));
  } catch (e) {
    return [];
  }
})();

let transactions = Array.isArray(localStorageTrasactions)
  ? localStorageTrasactions
      .filter((t) => t !== null && typeof t === "object" && t.name && typeof t.amount === "number" && !isNaN(t.amount))
      .map((t) => ({ ...t, date: t.date || new Date().toISOString() }))
  : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter(({ id }) => id !== ID);
  updateLocalStorage();
  init();
};

const addTransactionIntoDOM = ({ amount, name, id, date }, container, allowDelete = true) => {
  const operation = amount < 0 ? "-" : "+";
  const CSSClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperation = Math.abs(amount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const li = document.createElement("li");

  li.classList.add(CSSClass);

  const deleteBtn = allowDelete ? `<button class="delete-btn" onClick="removeTransaction(${id})">x</button>` : "";

  let dateStr = "";
  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      dateStr = `<small style="color: #999; font-size: 0.85em; display: block; margin-top: 4px;">${d.toLocaleDateString("pt-BR")}</small>`;
    }
  }

  li.innerHTML = `
	<div style="display: flex; flex-direction: column;">
		<span>${name}</span>
		${dateStr}
	</div>
	<span>${operation} R$ ${amountWithoutOperation}</span>
	${deleteBtn}
	`;

  container.prepend(li);
};

const formatCurrencyBR = (num) => Number(num).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getExpense = (transactionsAmount) => formatCurrencyBR(Math.abs(transactionsAmount.filter((value) => value < 0).reduce((acc, value) => acc + value, 0)));

const getTotal = (transactionsAmount) => formatCurrencyBR(transactionsAmount.reduce((acc, transaction) => acc + transaction, 0));

const getIncome = (transactionsAmount) => formatCurrencyBR(transactionsAmount.filter((value) => value > 0).reduce((acc, value) => acc + value, 0));

const updateBalanceValue = (transactionsList) => {
  const transactionsAmount = transactionsList.map(({ amount }) => amount);
  const total = getTotal(transactionsAmount);
  const income = getIncome(transactionsAmount);
  const expense = getExpense(transactionsAmount);

  balancelDisplay.textContent = `R$ ${total}`;
  icomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
};

const init = () => {
  transactionsUl.innerHTML = "";
  const currentYearMonth = new Date().toISOString().slice(0, 7);

  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentYearMonth));

  currentMonthTransactions.forEach((t) => addTransactionIntoDOM(t, transactionsUl, true));
  updateBalanceValue(currentMonthTransactions);
};

init();

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateId = () => Math.round(Math.random() * 1000);

const addToTransactionArray = (transactionName, transactionAmount, transactionDate) => {
  transactions.push({
    id: generateId(),
    name: transactionName,
    amount: Number(transactionAmount),
    date: transactionDate || new Date().toISOString(),
  });
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmountStr = inputTransactionAmount.value.trim();
  const transactionDateStr = inputTransactionDate ? inputTransactionDate.value.trim() : "";

  const cleanAmountStr = transactionAmountStr.replace(/\D/g, "");
  const parsedAmount = (transactionType === "minus" ? -1 : 1) * (Number(cleanAmountStr) / 100);

  const isSomeInputEmpty = transactionAmountStr === "" || transactionName === "";

  if (isSomeInputEmpty || cleanAmountStr === "") {
    showError("Preencha tanto o nome quanto o valor da transação");
    return;
  }

  let transactionDate = new Date().toISOString();
  if (transactionDateStr) {
    const [year, month, day] = transactionDateStr.split("-");
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime())) {
      transactionDate = d.toISOString();
    } else {
      showError("Data inválida.");
      return;
    }
  }

  addToTransactionArray(transactionName, parsedAmount, transactionDate);
  init();
  updateLocalStorage();
  form.reset();
  
  // Restore defaults after reset
  inputTransactionDate.value = today;
  setType("plus");
};

inputTransactionAmount.addEventListener("input", (e) => {
  let value = e.target.value;
  value = value.replace(/\D/g, "");

  if (value === "") {
    e.target.value = "";
    return;
  }

  let numericValue = Number(value) / 100;
  e.target.value = numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});

form.addEventListener("submit", handleFormSubmit);

// --- History Modal Logic ---
const historyModal = document.getElementById("history-modal");
const closeModal = document.querySelector(".close-modal");
const btnHistory = document.getElementById("btn-history");
const historyMonthInput = document.getElementById("history-month");
const modalTransactionsUl = document.getElementById("modal-transactions");
const modalTitle = document.getElementById("modal-title");

btnHistory.addEventListener("click", () => {
  const selectedMonth = historyMonthInput.value;
  if (!selectedMonth) {
    showError("Por favor, selecione um mês no filtro.");
    return;
  }

  const monthNames = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  };

  modalTitle.textContent = `Relatório de ${monthNames[selectedMonth]}`;

  modalTransactionsUl.innerHTML = "";

  // Filtra as transações apenas pelo mês (ignora o ano)
  const pastTransactions = transactions.filter((t) => {
    if (!t.date) return false;
    const transactionMonth = t.date.split("-")[1];
    return transactionMonth === selectedMonth;
  });

  if (pastTransactions.length === 0) {
    modalTransactionsUl.innerHTML = "<p>Nenhuma transação encontrada neste período.</p>";
  } else {
    pastTransactions.forEach((t) => addTransactionIntoDOM(t, modalTransactionsUl, false));
  }

  historyModal.classList.add("active");
});

closeModal.addEventListener("click", () => {
  historyModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === historyModal) {
    historyModal.classList.remove("active");
  }
});

// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggleBtn.textContent = "☀️";
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  let theme = "light";
  if (document.body.classList.contains("dark-mode")) {
    theme = "dark";
    themeToggleBtn.textContent = "☀️";
  } else {
    themeToggleBtn.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
});
