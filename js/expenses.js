storageManager.checkAuth();

let currentEditId = null;

function loadExpenses() {
    const expenses = storageManager.getExpenses();
    const searchTerm = document.getElementById('searchExpenses').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;
    const paymentMethodFilter = document.getElementById('paymentMethodFilter').value;
    
    let filtered = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        const matchesMonth = !monthFilter || expense.date.startsWith(monthFilter);
        const matchesPayment = paymentMethodFilter === 'all' || expense.paymentMethod === paymentMethodFilter;
        
        return matchesSearch && matchesCategory && matchesMonth && matchesPayment;
    });
    
    const tbody = document.querySelector('#expensesTable tbody');
    const container = document.querySelector('.table-container');
    tbody.innerHTML = '';
    
    // Remove existing mobile cards
    const existingCards = container.querySelectorAll('.expense-card');
    existingCards.forEach(card => card.remove());
    
    if (filtered.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.setAttribute('colspan', '7');
        cell.className = 'no-data';
        cell.textContent = 'No expenses found.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    
    filtered.forEach(expense => {
        // Create table row
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = storageManager.formatDate(expense.date);
        row.appendChild(dateCell);
        
        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        row.appendChild(categoryCell);
        
        const descCell = document.createElement('td');
        descCell.textContent = expense.description;
        row.appendChild(descCell);
        
        const amountCell = document.createElement('td');
        amountCell.textContent = storageManager.formatCurrency(expense.amount);
        row.appendChild(amountCell);
        
        const methodCell = document.createElement('td');
        methodCell.textContent = expense.paymentMethod;
        row.appendChild(methodCell);
        
        const addedByCell = document.createElement('td');
        addedByCell.textContent = expense.addedBy;
        row.appendChild(addedByCell);
        
        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-btns';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-sm btn-edit';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editExpense(expense.id);
        actionsDiv.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-sm btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteExpense(expense.id);
        actionsDiv.appendChild(deleteBtn);
        
        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
        
        // Create mobile card
        const card = createExpenseCard(expense);
        container.appendChild(card);
    });
    
    updateStats();
}

function createExpenseCard(expense) {
    const card = document.createElement('div');
    card.className = 'expense-card';
    
    card.innerHTML = `
        <div class="expense-card-header">
            <div class="expense-card-left">
                <div class="expense-card-category">${expense.category}</div>
                <div class="expense-card-date">${storageManager.formatDate(expense.date)}</div>
            </div>
            <div class="expense-card-amount">${storageManager.formatCurrency(expense.amount)}</div>
        </div>
        <div class="expense-card-description">${expense.description}</div>
        <div class="expense-card-footer">
            <div class="expense-card-method">
                <strong>Payment:</strong> ${expense.paymentMethod}<br>
                <strong>By:</strong> ${expense.addedBy}
            </div>
            <div class="expense-card-actions">
                <button class="btn-secondary" onclick="editExpense('${expense.id}')">Edit</button>
                <button class="btn-danger" onclick="deleteExpense('${expense.id}')">Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

function updateStats() {
    const expenses = storageManager.getExpenses();
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const currentYear = now.getFullYear().toString();
    
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const yearlyExpenses = expenses.filter(e => e.date.startsWith(currentYear));
    
    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const yearlyTotal = yearlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    document.getElementById('monthlyExpense').textContent = storageManager.formatCurrency(monthlyTotal);
    document.getElementById('yearlyExpense').textContent = storageManager.formatCurrency(yearlyTotal);
    document.getElementById('totalExpenses').textContent = storageManager.formatCurrency(totalExpenses);
    document.getElementById('transactionCount').textContent = expenses.length;
    
    const categories = ['General', 'Utilities', 'Maintenance', 'Rent', 'Others'];
    categories.forEach(cat => {
        const catExpenses = monthlyExpenses.filter(e => e.category === cat);
        const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
        document.getElementById(`cat${cat}`).textContent = storageManager.formatCurrency(catTotal);
    });
}

function populateMonthFilter() {
    const expenses = storageManager.getExpenses();
    const months = [...new Set(expenses.map(e => e.date.slice(0, 7)))].sort().reverse();
    
    const select = document.getElementById('monthFilter');
    select.innerHTML = '';
    
    const allTimeOption = document.createElement('option');
    allTimeOption.value = '';
    allTimeOption.textContent = 'All Time';
    select.appendChild(allTimeOption);
    
    months.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        select.appendChild(option);
    });
}

document.getElementById('addExpenseBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add Expense';
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseDate').valueAsDate = new Date();
    showModal('expenseModal');
});

document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const expense = {
        date: document.getElementById('expenseDate').value,
        category: document.getElementById('expenseCategory').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        paymentMethod: document.getElementById('expenseMethod').value,
        description: document.getElementById('expenseDescription').value
    };
    
    if (currentEditId) {
        storageManager.updateExpense(currentEditId, expense);
    } else {
        storageManager.addExpense(expense);
    }
    
    hideModal('expenseModal');
    populateMonthFilter();
    loadExpenses();
});

function editExpense(id) {
    const expenses = storageManager.getExpenses();
    const expense = expenses.find(e => e.id === id);
    
    if (expense) {
        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Expense';
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseMethod').value = expense.paymentMethod;
        document.getElementById('expenseDescription').value = expense.description;
        showModal('expenseModal');
    }
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        storageManager.deleteExpense(id);
        populateMonthFilter();
        loadExpenses();
    }
}

document.getElementById('exportExpensesBtn').addEventListener('click', () => {
    const expenses = storageManager.getExpenses();
    const exportData = expenses.map(e => ({
        Date: e.date,
        Category: e.category,
        Description: e.description,
        Amount: e.amount,
        'Payment Method': e.paymentMethod,
        'Added By': e.addedBy
    }));
    
    storageManager.exportToCSV(exportData, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
});

document.getElementById('searchExpenses').addEventListener('input', loadExpenses);
document.getElementById('categoryFilter').addEventListener('change', loadExpenses);
document.getElementById('monthFilter').addEventListener('change', loadExpenses);
document.getElementById('paymentMethodFilter').addEventListener('change', loadExpenses);

populateMonthFilter();
loadExpenses();