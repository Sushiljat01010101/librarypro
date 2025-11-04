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
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No fee records found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(fee => {
        const nextDue = storageManager.getNextMonthFromFeeMonth(fee.month, fee.memberId);
        const member = storageManager.getMembers().find(m => m.id === fee.memberId);
        
        return `<tr>
            <td>${fee.memberName}</td>
            <td>Seat ${member?.seat || '-'}</td>
            <td>${fee.month}</td>
            <td>${storageManager.formatCurrency(fee.amount)}</td>
            <td>
                ${fee.status === 'paid' ? 
                    '<span class="status-paid">Paid</span>' : 
                    '<span class="status-pending">Pending</span>'}
            </td>
            <td>${fee.paymentDate ? storageManager.formatDate(fee.paymentDate) : '-'}</td>
            <td>${fee.paymentMethod || '-'}</td>
            <td>${nextDue ? storageManager.formatDate(nextDue) : '-'}</td>
            <td>
                ${fee.status === 'pending' ? 
                    `<button class="btn-sm btn-success" onclick="markAsPaid('${fee.id}')">Mark Paid</button>` : 
                    '<span class="badge success">✓ Paid</span>'}
            </td>
        </tr>`;
    }).join('');
    
    updateStats();
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
    select.innerHTML = '<option value="">All Months</option>' + 
        months.map(m => `<option value="${m}">${m}</option>`).join('');
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
    select.innerHTML = '<option value="">-- Select Member --</option>' + 
        members.map(m => `<option value="${m.id}">${m.name} (Seat ${m.seat})</option>`).join('');
    
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