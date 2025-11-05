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
    const allMembers = storageManager.getMembers();
    
    const members = allMembers
        .sort((a, b) => {
            const dateA = a.joiningDate ? new Date(a.joiningDate) : new Date(0);
            const dateB = b.joiningDate ? new Date(b.joiningDate) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 5);
    
    const tbody = document.querySelector('#recentMembersTable tbody');
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="no-data">No members yet</td></tr>';
        return;
    }
    
    tbody.textContent = '';
    members.forEach(member => {
        const tr = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = member.name;
        tr.appendChild(nameCell);
        
        const seatCell = document.createElement('td');
        seatCell.textContent = member.seat ? `Seat ${member.seat}` : 'No Seat';
        tr.appendChild(seatCell);
        
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${member.status === 'active' ? 'success' : 'danger'}`;
        statusBadge.textContent = member.status;
        statusCell.appendChild(statusBadge);
        tr.appendChild(statusCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = storageManager.formatDate(member.joiningDate);
        tr.appendChild(dateCell);
        
        tbody.appendChild(tr);
    });
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
    
    tbody.textContent = '';
    overdueBooks.slice(0, 5).forEach(ib => {
        const fine = storageManager.calculateFine(ib.dueDate);
        const tr = document.createElement('tr');
        
        const bookCell = document.createElement('td');
        bookCell.textContent = ib.bookTitle;
        tr.appendChild(bookCell);
        
        const memberCell = document.createElement('td');
        memberCell.textContent = ib.memberName;
        tr.appendChild(memberCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = storageManager.formatDate(ib.dueDate);
        tr.appendChild(dateCell);
        
        const fineCell = document.createElement('td');
        fineCell.className = 'fine-amount';
        fineCell.textContent = storageManager.formatCurrency(fine);
        tr.appendChild(fineCell);
        
        tbody.appendChild(tr);
    });
}

function loadPendingPayments() {
    const members = storageManager.getMembers();
    const activeMembers = members.filter(m => m.status === 'active');
    const activeMemberIds = new Set(activeMembers.map(m => m.id));
    
    const fees = storageManager.getFees()
        .filter(f => activeMemberIds.has(f.memberId))
        .filter(f => storageManager.isFeeOverdue(f));
    
    const tbody = document.querySelector('#pendingPaymentsTable tbody');
    
    if (fees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="no-data">No pending payments</td></tr>';
        return;
    }
    
    tbody.textContent = '';
    fees.slice(0, 5).forEach(fee => {
        const tr = document.createElement('tr');
        
        const memberCell = document.createElement('td');
        memberCell.textContent = fee.memberName;
        tr.appendChild(memberCell);
        
        const monthCell = document.createElement('td');
        monthCell.textContent = fee.month;
        tr.appendChild(monthCell);
        
        const amountCell = document.createElement('td');
        amountCell.textContent = storageManager.formatCurrency(fee.amount);
        tr.appendChild(amountCell);
        
        tbody.appendChild(tr);
    });
}

function loadRecentActivity() {
    const activities = storageManager.getActivities().slice(0, 5);
    const container = document.getElementById('recentActivity');
    
    if (activities.length === 0) {
        container.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    container.textContent = '';
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const activityText = document.createElement('div');
        activityText.className = 'activity-text';
        activityText.textContent = activity.text;
        activityItem.appendChild(activityText);
        
        const activityTime = document.createElement('div');
        activityTime.className = 'activity-time';
        activityTime.textContent = storageManager.formatDateTime(activity.timestamp);
        activityItem.appendChild(activityTime);
        
        container.appendChild(activityItem);
    });
}

loadDashboardStats();