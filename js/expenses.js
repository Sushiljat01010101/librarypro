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
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No expenses found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(expense => `
        <tr>
            <td>${storageManager.formatDate(expense.date)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>${storageManager.formatCurrency(expense.amount)}</td>
            <td>${expense.paymentMethod}</td>
            <td>${expense.addedBy}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-sm btn-edit" onclick="editExpense('${expense.id}')">Edit</button>
                    <button class="btn-sm btn-delete" onclick="deleteExpense('${expense.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updateStats();
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
    select.innerHTML = '<option value="">All Time</option>' + 
        months.map(m => `<option value="${m}">${m}</option>`).join('');
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