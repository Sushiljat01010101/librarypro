storageManager.checkAuth();

let currentEditId = null;
let currentIdProofData = null;

function updateSeatDisplay(seatValue) {
    const seatDisplay = document.getElementById('seatDisplay');
    const seatInput = document.getElementById('memberSeat');
    
    if (!seatValue || seatValue === '0' || seatValue === 0) {
        seatDisplay.innerHTML = '<span class="seat-placeholder">No seat selected</span>';
        seatDisplay.classList.remove('has-seat');
        seatInput.value = '';
    } else {
        seatDisplay.textContent = '';
        const span = document.createElement('span');
        span.className = 'seat-selected';
        span.textContent = `🪑 Seat ${seatValue}`;
        seatDisplay.appendChild(span);
        seatDisplay.classList.add('has-seat');
        seatInput.value = seatValue;
    }
}

function createDetailRow(label, value, isHtml = false) {
    const row = document.createElement('div');
    row.className = 'detail-row';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'detail-label';
    labelSpan.textContent = label;
    row.appendChild(labelSpan);
    
    const valueSpan = document.createElement('span');
    valueSpan.className = 'detail-value';
    if (isHtml) {
        valueSpan.innerHTML = value;
    } else {
        valueSpan.textContent = value;
    }
    row.appendChild(valueSpan);
    
    return row;
}

function loadMembers() {
    const members = storageManager.getMembers();
    const searchTerm = document.getElementById('searchMembers').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const membershipFilter = document.getElementById('membershipFilter').value;
    
    let filtered = members.filter(member => {
        const seatValue = member.seat ? member.seat.toString() : '';
        const matchesSearch = 
            member.name.toLowerCase().includes(searchTerm) ||
            member.contact.includes(searchTerm) ||
            seatValue.includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        const matchesMembership = membershipFilter === 'all' || member.membershipType === membershipFilter;
        
        return matchesSearch && matchesStatus && matchesMembership;
    });
    
    const container = document.getElementById('membersGrid');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-data">No members found. Click "Add Member" to get started.</p>';
        return;
    }
    
    container.textContent = '';
    filtered.forEach(member => {
        const card = document.createElement('div');
        card.className = 'member-card';
        
        const header = document.createElement('div');
        header.className = 'member-header';
        
        const photo = document.createElement('div');
        photo.className = 'member-photo';
        if (member.photo) {
            const img = document.createElement('img');
            img.src = member.photo;
            img.alt = member.name;
            photo.appendChild(img);
        } else {
            photo.textContent = '👤';
        }
        header.appendChild(photo);
        
        const basic = document.createElement('div');
        basic.className = 'member-basic';
        const nameH3 = document.createElement('h3');
        nameH3.textContent = member.name;
        basic.appendChild(nameH3);
        const contactP = document.createElement('p');
        contactP.textContent = member.contact;
        basic.appendChild(contactP);
        header.appendChild(basic);
        
        card.appendChild(header);
        
        const details = document.createElement('div');
        details.className = 'member-details';
        
        details.appendChild(createDetailRow('Seat Number', member.seat ? member.seat : 'No Seat'));
        
        const aadharValue = member.aadhar ? 
            `XXXX XXXX ${member.aadhar.slice(-4)}` : 
            'Not Provided';
        const aadharRow = createDetailRow('Aadhar Number', '');
        const aadharSpan = aadharRow.querySelector('.detail-value');
        aadharSpan.textContent = aadharValue;
        if (!member.aadhar) {
            aadharSpan.classList.add('text-muted');
        }
        details.appendChild(aadharRow);
        
        const idProofRow = createDetailRow('ID Proof', '', true);
        const idProofSpan = idProofRow.querySelector('.detail-value');
        if (member.idProofTelegramFileId) {
            idProofSpan.innerHTML = '<span style="color: var(--success); font-size: 13px;">✅ Stored on Telegram</span>';
        } else {
            idProofSpan.innerHTML = '<span class="detail-value text-muted">Not Uploaded</span>';
        }
        details.appendChild(idProofRow);
        
        details.appendChild(createDetailRow('Membership', member.membershipType));
        details.appendChild(createDetailRow('Monthly Fee', storageManager.formatCurrency(member.fee)));
        details.appendChild(createDetailRow('Joining Date', storageManager.formatDate(member.joiningDate)));
        details.appendChild(createDetailRow('Next Payment Date', member.nextPaymentDate ? storageManager.formatDate(member.nextPaymentDate) : '-'));
        
        const statusRow = document.createElement('div');
        statusRow.className = 'detail-row';
        const statusLabel = document.createElement('span');
        statusLabel.className = 'detail-label';
        statusLabel.textContent = 'Status';
        statusRow.appendChild(statusLabel);
        const statusValue = document.createElement('span');
        statusValue.className = 'detail-value';
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${member.status === 'active' ? 'success' : 'danger'}`;
        statusBadge.textContent = member.status;
        statusValue.appendChild(statusBadge);
        statusRow.appendChild(statusValue);
        details.appendChild(statusRow);
        
        card.appendChild(details);
        
        const actions = document.createElement('div');
        actions.className = 'member-actions';
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon';
        editBtn.textContent = '✏️ Edit';
        editBtn.onclick = () => editMember(member.id);
        actions.appendChild(editBtn);
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon delete';
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.onclick = () => deleteMember(member.id);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
        
        container.appendChild(card);
    });
}

function resetIdProofDisplay() {
    currentIdProofData = null;
    const preview = document.getElementById('idProofPreview');
    const placeholder = document.querySelector('.id-proof-placeholder');
    const image = document.getElementById('idProofImage');
    const removeBtn = document.getElementById('removeIdProofBtn');
    
    preview.classList.remove('has-image');
    placeholder.style.display = 'block';
    placeholder.innerHTML = '📸 Upload ID Proof (Aadhar, License, etc.)';
    image.style.display = 'none';
    image.src = '';
    removeBtn.style.display = 'none';
}

function displayIdProof(dataUrl) {
    currentIdProofData = dataUrl;
    const preview = document.getElementById('idProofPreview');
    const placeholder = document.querySelector('.id-proof-placeholder');
    const image = document.getElementById('idProofImage');
    const removeBtn = document.getElementById('removeIdProofBtn');
    
    preview.classList.add('has-image');
    placeholder.style.display = 'none';
    image.src = dataUrl;
    image.style.display = 'block';
    removeBtn.style.display = 'inline-block';
}

function displayTelegramIdProofReference(member) {
    currentIdProofData = null;
    const preview = document.getElementById('idProofPreview');
    const placeholder = document.querySelector('.id-proof-placeholder');
    const image = document.getElementById('idProofImage');
    const removeBtn = document.getElementById('removeIdProofBtn');
    
    preview.classList.add('has-image');
    placeholder.style.display = 'block';
    
    placeholder.textContent = '';
    placeholder.innerHTML = '✅ ID Proof stored securely on Telegram<br><small style="opacity: 0.7; font-size: 12px;">Upload a new photo to replace it</small>';
    
    const infoSmall = document.createElement('small');
    infoSmall.style.cssText = 'opacity: 0.7; font-size: 11px; display: block; margin-top: 8px; line-height: 1.4;';
    
    if (member && member.idProofTelegramMessageId) {
        infoSmall.textContent = `💡 Message ID: #${member.idProofTelegramMessageId} - View this photo in your Telegram bot chat`;
    } else {
        infoSmall.textContent = '💡 To view ID proof, open your Telegram app and check the bot chat where photos are sent';
    }
    
    placeholder.appendChild(document.createElement('br'));
    placeholder.appendChild(infoSmall);
    
    image.style.display = 'none';
    image.src = '';
    removeBtn.style.display = 'none';
}

document.getElementById('uploadIdProofBtn').addEventListener('click', () => {
    document.getElementById('memberIdProof').click();
});

document.getElementById('memberIdProof').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            displayIdProof(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('captureIdProofBtn').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; max-width: 90%; max-height: 90%; border-radius: 12px; box-shadow: 0 10px 50px rgba(0,0,0,0.5);';
        
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;';
        
        const captureBtn = document.createElement('button');
        captureBtn.textContent = '📸 Capture Photo';
        captureBtn.style.cssText = 'margin-top: 20px; padding: 15px 30px; font-size: 16px; background: var(--primary-gold); color: var(--bg-primary); border: none; border-radius: 8px; cursor: pointer; z-index: 10002; position: relative;';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Cancel';
        cancelBtn.style.cssText = 'margin-top: 10px; padding: 12px 25px; font-size: 14px; background: var(--danger); color: white; border: none; border-radius: 8px; cursor: pointer; z-index: 10002; position: relative;';
        
        overlay.appendChild(video);
        overlay.appendChild(captureBtn);
        overlay.appendChild(cancelBtn);
        document.body.appendChild(overlay);
        
        captureBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            displayIdProof(dataUrl);
            
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(overlay);
        });
        
        cancelBtn.addEventListener('click', () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(overlay);
        });
        
    } catch (error) {
        console.error('Camera access error:', error);
        alert('Camera access denied or not available. Please use file upload instead.');
    }
});

document.getElementById('removeIdProofBtn').addEventListener('click', () => {
    resetIdProofDisplay();
    document.getElementById('memberIdProof').value = '';
});

document.getElementById('addMemberBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add Member';
    document.getElementById('memberForm').reset();
    document.getElementById('joiningDate').valueAsDate = new Date();
    document.getElementById('paymentDate').valueAsDate = new Date();
    document.getElementById('monthsPaidInAdvance').value = 1;
    document.getElementById('paymentMethod').value = 'cash';
    updateSeatDisplay(null);
    resetIdProofDisplay();
    showModal('memberModal');
});

document.getElementById('selectSeatBtn').addEventListener('click', () => {
    const formData = {
        name: document.getElementById('memberName').value,
        contact: document.getElementById('memberContact').value,
        email: document.getElementById('memberEmail').value,
        aadhar: document.getElementById('memberAadhar').value,
        membershipType: document.getElementById('membershipType').value,
        fee: document.getElementById('memberFee').value,
        joiningDate: document.getElementById('joiningDate').value,
        monthsPaidInAdvance: document.getElementById('monthsPaidInAdvance').value,
        paymentDate: document.getElementById('paymentDate').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        status: document.getElementById('memberStatus').value,
        photo: document.getElementById('memberPhoto').value,
        address: document.getElementById('memberAddress').value,
        editId: currentEditId
    };
    
    sessionStorage.setItem('memberFormData', JSON.stringify(formData));
    window.location.href = 'seats.html?mode=select&return=members';
});

document.getElementById('noSeatBtn').addEventListener('click', () => {
    updateSeatDisplay(null);
    document.getElementById('noSeatBtn').classList.add('active');
    setTimeout(() => {
        document.getElementById('noSeatBtn').classList.remove('active');
    }, 1000);
});

function checkForSeatSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSeat = urlParams.get('seat');
    const formData = sessionStorage.getItem('memberFormData');
    
    if (formData) {
        const data = JSON.parse(formData);
        
        currentEditId = data.editId;
        document.getElementById('modalTitle').textContent = currentEditId ? 'Edit Member' : 'Add Member';
        document.getElementById('memberName').value = data.name || '';
        document.getElementById('memberContact').value = data.contact || '';
        document.getElementById('memberEmail').value = data.email || '';
        document.getElementById('memberAadhar').value = data.aadhar || '';
        document.getElementById('membershipType').value = data.membershipType || 'monthly';
        document.getElementById('memberFee').value = data.fee || '';
        document.getElementById('joiningDate').value = data.joiningDate || new Date().toISOString().split('T')[0];
        document.getElementById('monthsPaidInAdvance').value = data.monthsPaidInAdvance || 1;
        document.getElementById('paymentDate').value = data.paymentDate || new Date().toISOString().split('T')[0];
        document.getElementById('paymentMethod').value = data.paymentMethod || 'cash';
        document.getElementById('memberStatus').value = data.status || 'active';
        document.getElementById('memberPhoto').value = data.photo || '';
        document.getElementById('memberAddress').value = data.address || '';
        
        if (selectedSeat) {
            updateSeatDisplay(selectedSeat);
        } else {
            updateSeatDisplay(null);
        }
        
        sessionStorage.removeItem('memberFormData');
        
        showModal('memberModal');
        
        if (selectedSeat) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

window.addEventListener('DOMContentLoaded', checkForSeatSelection);

document.getElementById('memberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const seatValue = document.getElementById('memberSeat').value;
    
    const member = {
        name: document.getElementById('memberName').value,
        contact: document.getElementById('memberContact').value,
        email: document.getElementById('memberEmail').value,
        aadhar: document.getElementById('memberAadhar').value,
        seat: seatValue ? parseInt(seatValue) : 0,
        membershipType: document.getElementById('membershipType').value,
        fee: parseFloat(document.getElementById('memberFee').value),
        joiningDate: document.getElementById('joiningDate').value,
        monthsPaidInAdvance: parseInt(document.getElementById('monthsPaidInAdvance').value) || 1,
        paymentDate: document.getElementById('paymentDate').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        status: document.getElementById('memberStatus').value,
        photo: document.getElementById('memberPhoto').value,
        address: document.getElementById('memberAddress').value,
        idProof: currentIdProofData || null
    };
    
    if (currentEditId) {
        await storageManager.updateMember(currentEditId, member);
    } else {
        await storageManager.addMember(member);
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
        document.getElementById('memberAadhar').value = member.aadhar || '';
        updateSeatDisplay(member.seat);
        document.getElementById('membershipType').value = member.membershipType;
        document.getElementById('memberFee').value = member.fee;
        document.getElementById('joiningDate').value = member.joiningDate;
        document.getElementById('monthsPaidInAdvance').value = member.monthsPaidInAdvance || 1;
        document.getElementById('paymentDate').value = member.paymentDate || new Date().toISOString().split('T')[0];
        document.getElementById('paymentMethod').value = member.paymentMethod || 'cash';
        document.getElementById('memberStatus').value = member.status;
        document.getElementById('memberPhoto').value = member.photo || '';
        document.getElementById('memberAddress').value = member.address || '';
        
        if (member.idProof) {
            displayIdProof(member.idProof);
        } else if (member.idProofTelegramFileId) {
            displayTelegramIdProofReference(member);
        } else {
            resetIdProofDisplay();
        }
        
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
        'Aadhar Number': m.aadhar || '',
        Seat: m.seat,
        Membership: m.membershipType,
        Fee: m.fee,
        'Joining Date': m.joiningDate,
        'Next Payment Date': m.nextPaymentDate || '',
        Status: m.status,
        Address: m.address || ''
    }));
    
    storageManager.exportToCSV(exportData, `members-${new Date().toISOString().split('T')[0]}.csv`);
});

document.getElementById('searchMembers').addEventListener('input', loadMembers);
document.getElementById('statusFilter').addEventListener('change', loadMembers);
document.getElementById('membershipFilter').addEventListener('change', loadMembers);

loadMembers();