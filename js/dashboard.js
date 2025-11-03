storageManager.checkAuth();

function loadDashboardStats() {
    const members = storageManager.getMembers();
    const books = storageManager.getBooks();
    const issuedBooks = storageManager.getIssuedBooks();
    const fees = storageManager.getFees();
    const expenses = storageManager.getExpenses();
    const settings = storageManager.getSettings();
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const inactiveMembers = totalMembers - activeMembers;
    
    const occupiedSeats = members.filter(m => m.status === 'active').length;
    const totalSeats = settings.totalSeats || 50;
    
    const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
    const issuedCount = issuedBooks.filter(ib => !ib.returned).length;
    const availableBooks = totalBooks - issuedCount;
    
    const monthlyFees = fees.filter(f => f.month === currentMonth);
    const paidFees = monthlyFees.filter(f => f.status === 'paid');
    const pendingFees = monthlyFees.filter(f => storageManager.isFeeOverdue(f));
    const monthlyRevenue = paidFees.reduce((sum, f) => sum + f.amount, 0);
    
    const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const monthlyExpense = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const monthlyProfit = monthlyRevenue - monthlyExpense;
    
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('activeMembers').textContent = activeMembers;
    document.getElementById('inactiveMembers').textContent = inactiveMembers;
    
    document.getElementById('occupiedSeats').textContent = occupiedSeats;
    document.getElementById('totalSeats').textContent = totalSeats;
    
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('issuedBooks').textContent = issuedCount;
    document.getElementById('availableBooks').textContent = availableBooks;
    
    document.getElementById('monthlyRevenue').textContent = storageManager.formatCurrency(monthlyRevenue);
    document.getElementById('paidMembers').textContent = paidFees.length;
    document.getElementById('pendingMembers').textContent = pendingFees.length;
    
    document.getElementById('monthlyExpense').textContent = storageManager.formatCurrency(monthlyExpense);
    document.getElementById('expenseDetail').textContent = `${monthlyExpenses.length} transactions`;
    
    document.getElementById('monthlyProfit').textContent = storageManager.formatCurrency(monthlyProfit);
    const profitDetail = monthlyRevenue > 0 ? 
        `${((monthlyProfit / monthlyRevenue) * 100).toFixed(1)}% margin` : 
        'Revenue - Expenses';
    document.getElementById('profitDetail').textContent = profitDetail;
    
    loadRecentMembers();
    loadOverdueBooks();
    loadPendingPayments();
    loadRecentActivity();
}

function loadRecentMembers() {
    const members = storageManager.getMembers().slice(0, 5);
    const tbody = document.querySelector('#recentMembersTable tbody');
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No members yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>Seat ${member.seat}</td>
            <td><span class="badge ${member.status === 'active' ? 'success' : 'danger'}">${member.status}</span></td>
            <td>${storageManager.formatDate(member.joiningDate)}</td>
        </tr>
    `).join('');
}

function loadOverdueBooks() {
    const issuedBooks = storageManager.getIssuedBooks().filter(ib => !ib.returned);
    const today = new Date().toISOString().split('T')[0];
    const overdueBooks = issuedBooks.filter(ib => ib.dueDate < today);
    
    const tbody = document.querySelector('#overdueTable tbody');
    
    if (overdueBooks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No overdue books</td></tr>';
        return;
    }
    
    tbody.innerHTML = overdueBooks.slice(0, 5).map(ib => {
        const fine = storageManager.calculateFine(ib.dueDate);
        return `
            <tr>
                <td>${ib.bookTitle}</td>
                <td>${ib.memberName}</td>
                <td>${storageManager.formatDate(ib.dueDate)}</td>
                <td class="fine-amount">${storageManager.formatCurrency(fine)}</td>
            </tr>
        `;
    }).join('');
}

function loadPendingPayments() {
    const fees = storageManager.getFees().filter(f => storageManager.isFeeOverdue(f));
    const tbody = document.querySelector('#pendingPaymentsTable tbody');
    
    if (fees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No pending payments</td></tr>';
        return;
    }
    
    tbody.innerHTML = fees.slice(0, 5).map(fee => `
        <tr>
            <td>${fee.memberName}</td>
            <td>${fee.month}</td>
            <td>${storageManager.formatCurrency(fee.amount)}</td>
        </tr>
    `).join('');
}

function loadRecentActivity() {
    const activities = storageManager.getActivities().slice(0, 5);
    const container = document.getElementById('recentActivity');
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-text">${activity.text}</div>
            <div class="activity-time">${storageManager.formatDateTime(activity.timestamp)}</div>
        </div>
    `).join('');
}

loadDashboardStats();