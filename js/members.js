storageManager.checkAuth();

let currentEditId = null;

function loadMembers() {
    const members = storageManager.getMembers();
    const searchTerm = document.getElementById('searchMembers').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const membershipFilter = document.getElementById('membershipFilter').value;
    
    let filtered = members.filter(member => {
        const matchesSearch = 
            member.name.toLowerCase().includes(searchTerm) ||
            member.contact.includes(searchTerm) ||
            member.seat.toString().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        const matchesMembership = membershipFilter === 'all' || member.membershipType === membershipFilter;
        
        return matchesSearch && matchesStatus && matchesMembership;
    });
    
    const container = document.getElementById('membersGrid');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No members found. Click "Add Member" to get started.</p>';
        return;
    }
    
    container.innerHTML = filtered.map(member => {
        const photoHtml = member.photo ? 
            `<img src="${member.photo}" alt="${member.name}">` : 
            '👤';
        
        return `
            <div class="member-card">
                <div class="member-header">
                    <div class="member-photo">${photoHtml}</div>
                    <div class="member-basic">
                        <h3>${member.name}</h3>
                        <p>${member.contact}</p>
                    </div>
                </div>
                <div class="member-details">
                    <div class="detail-row">
                        <span class="detail-label">Seat Number</span>
                        <span class="detail-value">${member.seat}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Membership</span>
                        <span class="detail-value">${member.membershipType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Monthly Fee</span>
                        <span class="detail-value">${storageManager.formatCurrency(member.fee)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Joining Date</span>
                        <span class="detail-value">${storageManager.formatDate(member.joiningDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">
                            <span class="badge ${member.status === 'active' ? 'success' : 'danger'}">
                                ${member.status}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn-icon" onclick="editMember('${member.id}')">✏️ Edit</button>
                    <button class="btn-icon delete" onclick="deleteMember('${member.id}')">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('addMemberBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add Member';
    document.getElementById('memberForm').reset();
    document.getElementById('joiningDate').valueAsDate = new Date();
    showModal('memberModal');
});

document.getElementById('memberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const member = {
        name: document.getElementById('memberName').value,
        contact: document.getElementById('memberContact').value,
        email: document.getElementById('memberEmail').value,
        seat: parseInt(document.getElementById('memberSeat').value),
        membershipType: document.getElementById('membershipType').value,
        fee: parseFloat(document.getElementById('memberFee').value),
        joiningDate: document.getElementById('joiningDate').value,
        status: document.getElementById('memberStatus').value,
        photo: document.getElementById('memberPhoto').value,
        address: document.getElementById('memberAddress').value
    };
    
    if (currentEditId) {
        storageManager.updateMember(currentEditId, member);
    } else {
        storageManager.addMember(member);
    }
    
    hideModal('memberModal');
    loadMembers();
});

function editMember(id) {
    const members = storageManager.getMembers();
    const member = members.find(m => m.id === id);
    
    if (member) {
        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Member';
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberContact').value = member.contact;
        document.getElementById('memberEmail').value = member.email || '';
        document.getElementById('memberSeat').value = member.seat;
        document.getElementById('membershipType').value = member.membershipType;
        document.getElementById('memberFee').value = member.fee;
        document.getElementById('joiningDate').value = member.joiningDate;
        document.getElementById('memberStatus').value = member.status;
        document.getElementById('memberPhoto').value = member.photo || '';
        document.getElementById('memberAddress').value = member.address || '';
        showModal('memberModal');
    }
}

function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        storageManager.deleteMember(id);
        loadMembers();
    }
}

document.getElementById('exportMembersBtn').addEventListener('click', () => {
    const members = storageManager.getMembers();
    const exportData = members.map(m => ({
        Name: m.name,
        Contact: m.contact,
        Email: m.email || '',
        Seat: m.seat,
        Membership: m.membershipType,
        Fee: m.fee,
        'Joining Date': m.joiningDate,
        Status: m.status,
        Address: m.address || ''
    }));
    
    storageManager.exportToCSV(exportData, `members-${new Date().toISOString().split('T')[0]}.csv`);
});

document.getElementById('searchMembers').addEventListener('input', loadMembers);
document.getElementById('statusFilter').addEventListener('change', loadMembers);
document.getElementById('membershipFilter').addEventListener('change', loadMembers);

loadMembers();