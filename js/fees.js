storageManager.checkAuth();

let currentEditId = null;

function loadFees() {
    const fees = storageManager.getFees();
    const members = storageManager.getMembers();
    const searchTerm = document.getElementById('searchFees').value.toLowerCase();
    const monthFilter = document.getElementById('monthFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = fees.filter(fee => {
        const matchesSearch = fee.memberName.toLowerCase().includes(searchTerm);
        const matchesMonth = !monthFilter || fee.month === monthFilter;
        const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
        
        const member = members.find(m => m.id === fee.memberId);
        const isInactiveMemberWithPendingPayment = member && member.status === 'inactive' && fee.status === 'pending';
        
        return matchesSearch && matchesMonth && matchesStatus && !isInactiveMemberWithPendingPayment;
    });
    
    const tbody = document.querySelector('#feesTable tbody');
    const container = document.querySelector('.table-container');
    tbody.innerHTML = '';
    
    // Remove existing mobile cards
    const existingCards = container.querySelectorAll('.fee-card');
    existingCards.forEach(card => card.remove());
    
    if (filtered.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.setAttribute('colspan', '9');
        td.className = 'no-data';
        td.textContent = 'No fee records found.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    filtered.forEach(fee => {
        const nextDue = storageManager.getNextMonthFromFeeMonth(fee.month, fee.memberId);
        const member = storageManager.getMembers().find(m => m.id === fee.memberId);
        
        // Create table row
        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.textContent = fee.memberName;
        tr.appendChild(tdName);
        
        const tdSeat = document.createElement('td');
        tdSeat.textContent = `Seat ${member?.seat || '-'}`;
        tr.appendChild(tdSeat);
        
        const tdMonth = document.createElement('td');
        tdMonth.textContent = fee.month;
        tr.appendChild(tdMonth);
        
        const tdAmount = document.createElement('td');
        tdAmount.textContent = storageManager.formatCurrency(fee.amount);
        tr.appendChild(tdAmount);
        
        const tdStatus = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = fee.status === 'paid' ? 'status-paid' : 'status-pending';
        statusSpan.textContent = fee.status === 'paid' ? 'Paid' : 'Pending';
        tdStatus.appendChild(statusSpan);
        tr.appendChild(tdStatus);
        
        const tdPaymentDate = document.createElement('td');
        tdPaymentDate.textContent = fee.paymentDate ? storageManager.formatDate(fee.paymentDate) : '-';
        tr.appendChild(tdPaymentDate);
        
        const tdPaymentMethod = document.createElement('td');
        tdPaymentMethod.textContent = fee.paymentMethod || '-';
        tr.appendChild(tdPaymentMethod);
        
        const tdNextDue = document.createElement('td');
        tdNextDue.textContent = nextDue ? storageManager.formatDate(nextDue) : '-';
        tr.appendChild(tdNextDue);
        
        const tdAction = document.createElement('td');
        if (fee.status === 'pending') {
            const btn = document.createElement('button');
            btn.className = 'btn-sm btn-success';
            btn.textContent = 'Mark Paid';
            btn.addEventListener('click', () => markAsPaid(fee.id));
            tdAction.appendChild(btn);
        } else {
            const badge = document.createElement('span');
            badge.className = 'badge success';
            badge.textContent = '✓ Paid';
            tdAction.appendChild(badge);
        }
        tr.appendChild(tdAction);
        
        tbody.appendChild(tr);
        
        // Create mobile card
        const card = createFeeCard(fee, member, nextDue);
        container.appendChild(card);
    });
    
    updateStats();
}

function createFeeCard(fee, member, nextDue) {
    const card = document.createElement('div');
    card.className = 'fee-card';
    
    card.innerHTML = `
        <div class="fee-card-header">
            <div class="fee-card-name">${fee.memberName}</div>
            <div class="fee-card-amount">${storageManager.formatCurrency(fee.amount)}</div>
        </div>
        <div class="fee-card-body">
            <div class="fee-card-item">
                <span class="fee-card-label">Seat</span>
                <span class="fee-card-value">Seat ${member?.seat || '-'}</span>
            </div>
            <div class="fee-card-item">
                <span class="fee-card-label">Month</span>
                <span class="fee-card-value">${fee.month}</span>
            </div>
            <div class="fee-card-item">
                <span class="fee-card-label">Status</span>
                <span class="fee-card-value">
                    <span class="${fee.status === 'paid' ? 'status-paid' : 'status-pending'}">
                        ${fee.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                </span>
            </div>
            <div class="fee-card-item">
                <span class="fee-card-label">Payment Date</span>
                <span class="fee-card-value">${fee.paymentDate ? storageManager.formatDate(fee.paymentDate) : '-'}</span>
            </div>
            <div class="fee-card-item">
                <span class="fee-card-label">Payment Method</span>
                <span class="fee-card-value">${fee.paymentMethod || '-'}</span>
            </div>
            <div class="fee-card-item">
                <span class="fee-card-label">Next Due</span>
                <span class="fee-card-value">${nextDue ? storageManager.formatDate(nextDue) : '-'}</span>
            </div>
        </div>
        <div class="fee-card-footer">
            ${fee.status === 'pending' ? 
                `<button class="btn-primary" onclick="markAsPaid('${fee.id}')">Mark as Paid</button>` :
                `<span class="badge success" style="flex: 1; text-align: center; padding: 10px;">✓ Paid</span>`
            }
        </div>
    `;
    
    return card;
}

function updateStats() {
    const fees = storageManager.getFees();
    const members = storageManager.getMembers();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyFees = fees.filter(f => {
        const member = members.find(m => m.id === f.memberId);
        const isInactiveMemberWithPendingPayment = member && member.status === 'inactive' && f.status === 'pending';
        return f.month === currentMonth && !isInactiveMemberWithPendingPayment;
    });
    
    const expected = monthlyFees.reduce((sum, f) => sum + f.amount, 0);
    const collected = monthlyFees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const overdueFees = monthlyFees.filter(f => storageManager.isFeeOverdue(f));
    const pending = overdueFees.reduce((sum, f) => sum + f.amount, 0);
    const rate = expected > 0 ? ((collected / expected) * 100).toFixed(1) : 0;
    
    document.getElementById('expectedAmount').textContent = storageManager.formatCurrency(expected);
    document.getElementById('collectedAmount').textContent = storageManager.formatCurrency(collected);
    document.getElementById('pendingAmount').textContent = storageManager.formatCurrency(pending);
    document.getElementById('collectionRate').textContent = `${rate}%`;
}

function populateMonthFilter() {
    const fees = storageManager.getFees();
    const months = [...new Set(fees.map(f => f.month))].sort().reverse();
    
    const select = document.getElementById('monthFilter');
    select.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Months';
    select.appendChild(defaultOption);
    
    months.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m;
        select.appendChild(option);
    });
}

function autoGenerateFees() {
    const generated = storageManager.autoGenerateMembershipFees();
    return generated;
}

document.getElementById('recordPaymentBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('paymentForm').reset();
    loadPaymentForm();
    document.getElementById('paymentDate').valueAsDate = new Date();
    showModal('paymentModal');
});

function loadPaymentForm() {
    const members = storageManager.getMembers().filter(m => m.status === 'active');
    const select = document.getElementById('paymentMember');
    select.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Member --';
    select.appendChild(defaultOption);
    
    members.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `${m.name} (Seat ${m.seat})`;
        select.appendChild(option);
    });
    
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('paymentMonth').value = currentMonth;
}

document.getElementById('paymentMember').addEventListener('change', (e) => {
    const memberId = e.target.value;
    if (memberId) {
        const member = storageManager.getMembers().find(m => m.id === memberId);
        if (member) {
            document.getElementById('paymentAmount').value = member.fee || 0;
        }
    }
});

document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const memberId = document.getElementById('paymentMember').value;
    const member = storageManager.getMembers().find(m => m.id === memberId);
    
    const fee = {
        memberId,
        memberName: member.name,
        month: document.getElementById('paymentMonth').value,
        amount: parseFloat(document.getElementById('paymentAmount').value),
        status: 'paid',
        paymentDate: document.getElementById('paymentDate').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        notes: document.getElementById('paymentNotes').value
    };
    
    const fees = storageManager.getFees();
    const existing = fees.find(f => 
        f.memberId === memberId && 
        f.month === fee.month
    );
    
    if (existing && existing.status === 'pending') {
        storageManager.updateFee(existing.id, {
            status: 'paid',
            paymentDate: fee.paymentDate,
            paymentMethod: fee.paymentMethod,
            notes: fee.notes
        });
    } else if (!existing) {
        storageManager.addFee(fee);
    } else {
        alert('Payment already recorded for this month!');
        return;
    }
    
    hideModal('paymentModal');
    populateMonthFilter();
    loadFees();
});

function markAsPaid(id) {
    showModal('paymentModal');
    currentEditId = id;
    
    const fee = storageManager.getFees().find(f => f.id === id);
    if (fee) {
        document.getElementById('feeId').value = id;
        
        const member = storageManager.getMembers().find(m => m.id === fee.memberId);
        if (member) {
            const select = document.getElementById('paymentMember');
            loadPaymentForm();
            select.value = fee.memberId;
            select.disabled = true;
        }
        
        document.getElementById('paymentMonth').value = fee.month;
        document.getElementById('paymentMonth').disabled = true;
        document.getElementById('paymentAmount').value = fee.amount;
        document.getElementById('paymentDate').valueAsDate = new Date();
    }
}

document.getElementById('searchFees').addEventListener('input', loadFees);
document.getElementById('monthFilter').addEventListener('change', loadFees);
document.getElementById('statusFilter').addEventListener('change', loadFees);

autoGenerateFees();
populateMonthFilter();
loadFees();