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
    container.textContent = '';
    
    if (filtered.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.className = 'no-data';
        noDataMsg.textContent = 'No seats found. Click "Initialize Seats" to set up the seating arrangement.';
        container.appendChild(noDataMsg);
        updateStats();
        return;
    }
    
    filtered.forEach(seat => {
        const icon = seat.status === 'occupied' ? '👤' : 
                     seat.status === 'reserved' ? '🔒' : '🪑';
        
        const statusText = seat.status.charAt(0).toUpperCase() + seat.status.slice(1);
        
        const seatCard = document.createElement('div');
        seatCard.className = 'seat-card ' + seat.status;
        seatCard.addEventListener('click', () => handleSeatClick(seat.id, seat.status));
        
        const seatIcon = document.createElement('div');
        seatIcon.className = 'seat-icon';
        seatIcon.textContent = icon;
        
        const seatNumber = document.createElement('div');
        seatNumber.className = 'seat-number';
        seatNumber.textContent = seat.id;
        
        const seatStatus = document.createElement('span');
        seatStatus.className = 'seat-status ' + seat.status;
        seatStatus.textContent = statusText;
        
        seatCard.appendChild(seatIcon);
        seatCard.appendChild(seatNumber);
        seatCard.appendChild(seatStatus);
        
        if (seat.memberName) {
            const memberInfo = document.createElement('div');
            memberInfo.className = 'seat-member';
            memberInfo.textContent = seat.memberName;
            seatCard.appendChild(memberInfo);
        }
        
        container.appendChild(seatCard);
    });
    
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
    select.textContent = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Member --';
    select.appendChild(defaultOption);
    
    availableMembers.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `${m.name} (Seat: ${m.seat || 'Not Assigned'})`;
        select.appendChild(option);
    });
    
    showModal('assignModal');
}

function showSeatDetail(seatId) {
    const seats = storageManager.getSeats();
    const seat = seats.find(s => s.id === seatId);
    
    if (seat) {
        document.getElementById('detailSeatNumber').textContent = seat.id;
        document.getElementById('detailMemberName').textContent = seat.memberName || '-';
        document.getElementById('detailAssignedDate').textContent = 
            seat.assignedDate ? storageManager.formatDate(seat.assignedDate) : '-';
        
        const statusContainer = document.getElementById('detailStatus');
        statusContainer.textContent = '';
        const statusSpan = document.createElement('span');
        statusSpan.className = 'seat-status ' + seat.status;
        statusSpan.textContent = seat.status.toUpperCase();
        statusContainer.appendChild(statusSpan);
        
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
