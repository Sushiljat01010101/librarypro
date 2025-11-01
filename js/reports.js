storageManager.checkAuth();

let revenueExpenseChart, expenseCategoryChart, booksStatusChart, paymentCollectionChart, monthlyComparisonChart;

function loadReports() {
    updateOverviewStats();
    createRevenueExpenseChart();
    createExpenseCategoryChart();
    createBooksStatusChart();
    createPaymentCollectionChart();
    createMonthlyComparisonChart();
    loadComparison();
}

function updateOverviewStats() {
    const fees = storageManager.getFees();
    const expenses = storageManager.getExpenses();
    
    const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    document.getElementById('totalRevenue').textContent = storageManager.formatCurrency(totalRevenue);
    document.getElementById('totalExpensesOverview').textContent = storageManager.formatCurrency(totalExpenses);
    document.getElementById('totalProfit').textContent = storageManager.formatCurrency(totalProfit);
    
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    document.getElementById('profitMargin').textContent = `${profitMargin}% profit margin`;
}

function createRevenueExpenseChart() {
    const fees = storageManager.getFees().filter(f => f.status === 'paid');
    const expenses = storageManager.getExpenses();
    
    const last6Months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);
        const monthLabel = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        
        const revenue = fees.filter(f => f.month === monthKey).reduce((sum, f) => sum + f.amount, 0);
        const expense = expenses.filter(e => e.date.startsWith(monthKey)).reduce((sum, e) => sum + e.amount, 0);
        
        last6Months.push({ label: monthLabel, revenue, expense });
    }
    
    const ctx = document.getElementById('revenueExpenseChart').getContext('2d');
    
    if (revenueExpenseChart) {
        revenueExpenseChart.destroy();
    }
    
    revenueExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last6Months.map(m => m.label),
            datasets: [
                {
                    label: 'Revenue',
                    data: last6Months.map(m => m.revenue),
                    borderColor: '#f4c430',
                    backgroundColor: 'rgba(244, 196, 48, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Expense',
                    data: last6Months.map(m => m.expense),
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#ffffff' } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cccccc' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function createExpenseCategoryChart() {
    const expenses = storageManager.getExpenses();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    
    const categories = ['General', 'Utilities', 'Maintenance', 'Rent', 'Others'];
    const data = categories.map(cat => {
        return monthlyExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    });
    
    const ctx = document.getElementById('expenseCategoryChart').getContext('2d');
    
    if (expenseCategoryChart) {
        expenseCategoryChart.destroy();
    }
    
    expenseCategoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#f4c430',
                    '#ff9800',
                    '#4caf50',
                    '#2196f3',
                    '#9c27b0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function createBooksStatusChart() {
    const books = storageManager.getBooks();
    const issuedBooks = storageManager.getIssuedBooks().filter(ib => !ib.returned);
    
    const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
    const issued = issuedBooks.length;
    const available = totalBooks - issued;
    
    const ctx = document.getElementById('booksStatusChart').getContext('2d');
    
    if (booksStatusChart) {
        booksStatusChart.destroy();
    }
    
    booksStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Available', 'Issued'],
            datasets: [{
                data: [available, issued],
                backgroundColor: ['#4caf50', '#ff9800']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function createPaymentCollectionChart() {
    const fees = storageManager.getFees();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyFees = fees.filter(f => f.month === currentMonth);
    
    const paid = monthlyFees.filter(f => f.status === 'paid').length;
    const pending = monthlyFees.filter(f => f.status === 'pending').length;
    
    const ctx = document.getElementById('paymentCollectionChart').getContext('2d');
    
    if (paymentCollectionChart) {
        paymentCollectionChart.destroy();
    }
    
    paymentCollectionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                label: 'Payment Status',
                data: [paid, pending],
                backgroundColor: ['#4caf50', '#ff9800']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#cccccc',
                        stepSize: 1
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function createMonthlyComparisonChart() {
    const fees = storageManager.getFees().filter(f => f.status === 'paid');
    
    const last12Months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7);
        const monthLabel = date.toLocaleDateString('en-IN', { month: 'short' });
        
        const revenue = fees.filter(f => f.month === monthKey).reduce((sum, f) => sum + f.amount, 0);
        
        last12Months.push({ label: monthLabel, revenue });
    }
    
    const ctx = document.getElementById('monthlyComparisonChart').getContext('2d');
    
    if (monthlyComparisonChart) {
        monthlyComparisonChart.destroy();
    }
    
    monthlyComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last12Months.map(m => m.label),
            datasets: [{
                label: 'Monthly Revenue',
                data: last12Months.map(m => m.revenue),
                backgroundColor: '#f4c430'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { labels: { color: '#ffffff' } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cccccc' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#cccccc' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function loadComparison() {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = prevMonthDate.toISOString().slice(0, 7);
    
    const fees = storageManager.getFees().filter(f => f.status === 'paid');
    const expenses = storageManager.getExpenses();
    const members = storageManager.getMembers();
    
    const currentRevenue = fees.filter(f => f.month === currentMonth).reduce((sum, f) => sum + f.amount, 0);
    const currentExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.amount, 0);
    const currentProfit = currentRevenue - currentExpenses;
    const currentMembers = members.filter(m => m.joiningDate.startsWith(currentMonth)).length;
    
    const prevRevenue = fees.filter(f => f.month === prevMonth).reduce((sum, f) => sum + f.amount, 0);
    const prevExpenses = expenses.filter(e => e.date.startsWith(prevMonth)).reduce((sum, e) => sum + e.amount, 0);
    const prevProfit = prevRevenue - prevExpenses;
    const prevMembers = members.filter(m => m.joiningDate.startsWith(prevMonth)).length;
    
    document.getElementById('currentRevenue').textContent = storageManager.formatCurrency(currentRevenue);
    document.getElementById('currentExpenses').textContent = storageManager.formatCurrency(currentExpenses);
    document.getElementById('currentProfit').textContent = storageManager.formatCurrency(currentProfit);
    document.getElementById('currentMembers').textContent = currentMembers;
    
    document.getElementById('prevRevenue').textContent = storageManager.formatCurrency(prevRevenue);
    document.getElementById('prevExpenses').textContent = storageManager.formatCurrency(prevExpenses);
    document.getElementById('prevProfit').textContent = storageManager.formatCurrency(prevProfit);
    document.getElementById('prevMembers').textContent = prevMembers;
}

loadReports();