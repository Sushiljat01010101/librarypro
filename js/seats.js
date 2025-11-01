storageManager.checkAuth();

let selectedSeatId = null;
let isSelectionMode = false;
let returnPage = null;

function checkSelectionMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    returnPage = urlParams.get('return');
    
    if (mode === 'select' && returnPage) {
        isSelectionMode = true;
        document.getElementById('selectionModeAlert').style.display = 'block';
        document.getElementById('statusFilter').value = 'available';
        loadSeats();
    }
}

document.getElementById('cancelSelectionBtn').addEventListener('click', () => {
    if (returnPage === 'members') {
        window.location.href = 'members.html';
    }
});

window.addEventListener('DOMContentLoaded', checkSelectionMode);

function loadSeats() {
    const seats = storageManager.getSeats();
    const searchTerm = document.getElementById('searchSeats').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = seats.filter(seat => {
        const matchesSearch = 
            seat.id.toLowerCase().includes(searchTerm) ||
            (seat.memberName && seat.memberName.toLowerCase().includes(searchTerm));
        
        const matchesStatus = statusFilter === 'all' || seat.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    const container = document.getElementById('seatsGrid');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No seats found. Click "Initialize Seats" to set up the seating arrangement.</p>';
        updateStats();
        return;
    }
    
    container.innerHTML = filtered.map(seat => {
        const icon = seat.status === 'occupied' ? '👤' : 
                     seat.status === 'reserved' ? '🔒' : '🪑';
        
        const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
        
        const memberInfo = seat.memberName ? 
            `<div class="seat-member">${seat.memberName}</div>` : '';
        
        return `
            <div class="seat-card ${seat.status}" onclick="handleSeatClick('${seat.id}', '${seat.status}')">
                <div class="seat-icon">${icon}</div>
                <div class="seat-number">${seat.id}</div>
                <span class="seat-status ${seat.status}">${statusText}</span>
                ${memberInfo}
            </div>
        `;
    }).join('');
    
    updateStats();
}

function updateStats() {
    const stats = storageManager.getSeatStats();
    
    document.getElementById('totalSeats').textContent = stats.total;
    document.getElementById('availableSeats').textContent = stats.available;
    document.getElementById('occupiedSeats').textContent = stats.occupied;
    document.getElementById('reservedSeats').textContent = stats.reserved;
    document.getElementById('occupancyRate').textContent = `${stats.occupancyRate}%`;
}

function handleSeatClick(seatId, status) {
    selectedSeatId = seatId;
    
    if (isSelectionMode && status === 'available') {
        const seatNumber = seatId.replace('S', '');
        if (returnPage === 'members') {
            window.location.href = `members.html?seat=${seatNumber}`;
        }
        return;
    }
    
    if (status === 'available') {
        showAssignModal(seatId);
    } else if (status === 'occupied') {
        showSeatDetail(seatId);
    } else if (status === 'reserved') {
        showReserveModal(seatId, true);
    }
}

function showAssignModal(seatId) {
    document.getElementById('seatNumber').textContent = seatId;
    document.getElementById('selectedSeatId').value = seatId;
    
    const members = storageManager.getMembers().filter(m => m.status === 'active');
    const seats = storageManager.getSeats();
    const occupiedMemberIds = seats
        .filter(s => s.status === 'occupied')
        .map(s => s.memberId);
    
    const availableMembers = members.filter(m => !occupiedMemberIds.includes(m.id));
    
    const select = document.getElementById('assignMember');
    select.innerHTML = '<option value="">-- Select Member --</option>' + 
        availableMembers.map(m => 
            `<option value="${m.id}">${m.name} (Seat: ${m.seat || 'Not Assigned'})</option>`
        ).join('');
    
    showModal('assignModal');
}

function showSeatDetail(seatId) {
    const seats = storageManager.getSeats();
    const seat = seats.find(s => s.id === seatId);
    
    if (seat) {
        document.getElementById('detailSeatNumber').textContent = seat.id;
        document.getElementById('detailStatus').textContent = 
            `<span class="seat-status ${seat.status}">${seat.status.toUpperCase()}</span>`;
        document.getElementById('detailMemberName').textContent = seat.memberName || '-';
        document.getElementById('detailAssignedDate').textContent = 
            seat.assignedDate ? storageManager.formatDate(seat.assignedDate) : '-';
        
        document.getElementById('detailStatus').innerHTML = 
            `<span class="seat-status ${seat.status}">${seat.status.toUpperCase()}</span>`;
        
        showModal('seatDetailModal');
    }
}

function showReserveModal(seatId, isReserved) {
    document.getElementById('reserveSeatNumber').textContent = seatId;
    selectedSeatId = seatId;
    
    if (isReserved) {
        document.getElementById('confirmReserveBtn').style.display = 'none';
        document.getElementById('unreserveBtn').style.display = 'inline-block';
    } else {
        document.getElementById('confirmReserveBtn').style.display = 'inline-block';
        document.getElementById('unreserveBtn').style.display = 'none';
    }
    
    showModal('reserveModal');
}

document.getElementById('initializeSeatsBtn').addEventListener('click', () => {
    if (confirm('This will initialize or reset all seats. Continue?')) {
        storageManager.initializeSeats();
        loadSeats();
        alert('Seats initialized successfully!');
    }
});

document.getElementById('assignForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const seatId = document.getElementById('selectedSeatId').value;
    const memberId = document.getElementById('assignMember').value;
    
    if (storageManager.assignSeat(seatId, memberId)) {
        hideModal('assignModal');
        loadSeats();
        alert('Seat assigned successfully!');
    } else {
        alert('Failed to assign seat. Please try again.');
    }
});

document.getElementById('freeSeatBtn').addEventListener('click', () => {
    if (selectedSeatId && confirm('Are you sure you want to free this seat?')) {
        if (storageManager.freeSeat(selectedSeatId)) {
            hideModal('seatDetailModal');
            loadSeats();
            alert('Seat freed successfully!');
        } else {
            alert('Failed to free seat. Please try again.');
        }
    }
});

document.getElementById('confirmReserveBtn').addEventListener('click', () => {
    if (selectedSeatId) {
        if (storageManager.reserveSeat(selectedSeatId)) {
            hideModal('reserveModal');
            loadSeats();
            alert('Seat reserved successfully!');
        } else {
            alert('Failed to reserve seat. Please try again.');
        }
    }
});

document.getElementById('unreserveBtn').addEventListener('click', () => {
    if (selectedSeatId && confirm('Are you sure you want to unreserve this seat?')) {
        if (storageManager.unreserveSeat(selectedSeatId)) {
            hideModal('reserveModal');
            loadSeats();
            alert('Seat unreserved successfully!');
        } else {
            alert('Failed to unreserve seat. Please try again.');
        }
    }
});

document.getElementById('searchSeats').addEventListener('input', loadSeats);
document.getElementById('statusFilter').addEventListener('change', loadSeats);

const seats = storageManager.getSeats();
if (seats.length === 0) {
    storageManager.initializeSeats();
}

loadSeats();
