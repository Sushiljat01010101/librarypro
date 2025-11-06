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
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#f4c430',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Expense',
                    data: last6Months.map(m => m.expense),
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#ff9800',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { 
                    labels: { 
                        color: '#ffffff',
                        font: { size: 13, weight: 'bold' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f4c430',
                    bodyColor: '#ffffff',
                    borderColor: '#f4c430',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#cccccc',
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
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

function createExpenseCategoryChart() {
    const expenses = storageManager.getExpenses();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    
    const categories = ['General', 'Utilities', 'Maintenance', 'Rent', 'Others'];
    const data = categories.map(cat => {
        return monthlyExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    });
    
    const totalExpense = data.reduce((sum, val) => sum + val, 0);
    
    const ctx = document.getElementById('expenseCategoryChart');
    const parentElement = ctx ? ctx.parentElement : null;
    
    if (expenseCategoryChart) {
        expenseCategoryChart.destroy();
        expenseCategoryChart = null;
    }
    
    // Check if there's no data
    if (totalExpense === 0 && parentElement) {
        ctx.style.display = 'none';
        let emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-chart-msg';
            emptyMsg.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:300px;color:#888;text-align:center;';
            emptyMsg.innerHTML = '<div><p style="font-size:48px;margin:0;">📊</p><p style="margin:10px 0 0 0;font-size:16px;">No expense data for current month</p></div>';
            parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'flex';
        return;
    }
    
    // Remove empty message and show canvas
    if (parentElement) {
        const emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (emptyMsg) emptyMsg.style.display = 'none';
        if (ctx) ctx.style.display = 'block';
    }
    
    if (!ctx) return;
    
    expenseCategoryChart = new Chart(ctx.getContext('2d'), {
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
                ],
                borderWidth: 3,
                borderColor: '#1a1a1a',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        color: '#ffffff',
                        font: { size: 12, weight: 'bold' },
                        padding: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f4c430',
                    bodyColor: '#ffffff',
                    borderColor: '#f4c430',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = totalExpense > 0 ? ((value / totalExpense) * 100).toFixed(1) : 0;
                            return context.label + ': ₹' + value.toLocaleString('en-IN') + ' (' + percentage + '%)';
                        }
                    }
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
    
    const ctx = document.getElementById('booksStatusChart');
    const parentElement = ctx ? ctx.parentElement : null;
    
    if (booksStatusChart) {
        booksStatusChart.destroy();
        booksStatusChart = null;
    }
    
    // Check if there's no data
    if (totalBooks === 0 && parentElement) {
        ctx.style.display = 'none';
        let emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-chart-msg';
            emptyMsg.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:300px;color:#888;text-align:center;';
            emptyMsg.innerHTML = '<div><p style="font-size:48px;margin:0;">📚</p><p style="margin:10px 0 0 0;font-size:16px;">No books in library inventory</p></div>';
            parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'flex';
        return;
    }
    
    // Remove empty message and show canvas
    if (parentElement) {
        const emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (emptyMsg) emptyMsg.style.display = 'none';
        if (ctx) ctx.style.display = 'block';
    }
    
    if (!ctx) return;
    
    booksStatusChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Available', 'Issued'],
            datasets: [{
                data: [available, issued],
                backgroundColor: ['#4caf50', '#ff9800'],
                borderWidth: 3,
                borderColor: '#1a1a1a',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        color: '#ffffff',
                        font: { size: 12, weight: 'bold' },
                        padding: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f4c430',
                    bodyColor: '#ffffff',
                    borderColor: '#f4c430',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return context.label + ': ' + value + ' books (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

function createPaymentCollectionChart() {
    const members = storageManager.getMembers();
    const activeMembers = members.filter(m => m.status === 'active');
    const activeMemberIds = new Set(activeMembers.map(m => m.id));
    
    const fees = storageManager.getFees();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyFees = fees.filter(f => f.month === currentMonth);
    
    const paid = monthlyFees.filter(f => f.status === 'paid').length;
    const pending = monthlyFees.filter(f => f.status === 'pending' && activeMemberIds.has(f.memberId)).length;
    
    const ctx = document.getElementById('paymentCollectionChart');
    const parentElement = ctx ? ctx.parentElement : null;
    
    if (paymentCollectionChart) {
        paymentCollectionChart.destroy();
        paymentCollectionChart = null;
    }
    
    // Check if there's no data
    if (monthlyFees.length === 0 && parentElement) {
        ctx.style.display = 'none';
        let emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (!emptyMsg) {
            emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-chart-msg';
            emptyMsg.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:300px;color:#888;text-align:center;';
            emptyMsg.innerHTML = '<div><p style="font-size:48px;margin:0;">💰</p><p style="margin:10px 0 0 0;font-size:16px;">No payment data for current month</p></div>';
            parentElement.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'flex';
        return;
    }
    
    // Remove empty message and show canvas
    if (parentElement) {
        const emptyMsg = parentElement.querySelector('.empty-chart-msg');
        if (emptyMsg) emptyMsg.style.display = 'none';
        if (ctx) ctx.style.display = 'block';
    }
    
    if (!ctx) return;
    
    paymentCollectionChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Paid', 'Pending'],
            datasets: [{
                label: 'Payment Status',
                data: [paid, pending],
                backgroundColor: ['#4caf50', '#ff9800'],
                borderWidth: 2,
                borderColor: ['#4caf50', '#ff9800'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f4c430',
                    bodyColor: '#ffffff',
                    borderColor: '#f4c430',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.y + ' members';
                        }
                    }
                }
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
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
                backgroundColor: '#f4c430',
                borderWidth: 2,
                borderColor: '#f4c430',
                borderRadius: 8,
                hoverBackgroundColor: '#d4a017'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    labels: { 
                        color: '#ffffff',
                        font: { size: 13, weight: 'bold' },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#f4c430',
                    bodyColor: '#ffffff',
                    borderColor: '#f4c430',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: '#cccccc',
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
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

function loadComparison() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
    
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

function exportReport() {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const fees = storageManager.getFees();
    const expenses = storageManager.getExpenses();
    const members = storageManager.getMembers();
    const books = storageManager.getBooks();
    const issuedBooks = storageManager.getIssuedBooks().filter(ib => !ib.returned);
    
    const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    const monthlyRevenue = fees.filter(f => f.status === 'paid' && f.month === currentMonth).reduce((sum, f) => sum + f.amount, 0);
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.amount, 0);
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    
    const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
    const activeMembers = members.filter(m => m.status === 'active').length;
    
    const csvContent = [
        ['Library Management System - Reports Summary'],
        ['Generated on:', new Date().toLocaleString('en-IN')],
        [''],
        ['=== Overall Statistics ==='],
        ['Total Revenue (All Time)', storageManager.formatCurrency(totalRevenue)],
        ['Total Expenses (All Time)', storageManager.formatCurrency(totalExpenses)],
        ['Net Profit (All Time)', storageManager.formatCurrency(totalProfit)],
        ['Profit Margin', totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) + '%' : '0%'],
        [''],
        ['=== Current Month Statistics ==='],
        ['Month', currentMonth],
        ['Monthly Revenue', storageManager.formatCurrency(monthlyRevenue)],
        ['Monthly Expenses', storageManager.formatCurrency(monthlyExpenses)],
        ['Monthly Profit', storageManager.formatCurrency(monthlyProfit)],
        [''],
        ['=== Library Statistics ==='],
        ['Total Members', members.length],
        ['Active Members', activeMembers],
        ['Inactive Members', members.length - activeMembers],
        ['Total Books', totalBooks],
        ['Books Issued', issuedBooks.length],
        ['Books Available', totalBooks - issuedBooks.length],
        ['']
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const filename = `library-report-${currentMonth}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    storageManager.addActivity('Report exported successfully', 'system');
}

document.getElementById('exportReportBtn')?.addEventListener('click', exportReport);

loadReports();