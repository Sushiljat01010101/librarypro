storageManager.checkAuth();

let currentEditId = null;
let currentIdProofData = null;
let currentPhotoData = null;
let pendingMemberData = null;

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-size: 14px;
        font-weight: 600;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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
        if (member.photoTelegramFileId) {
            photo.textContent = '👨';
        } else {
            photo.textContent = '👤';
        }
        
        // Add photo badge icon
        const photoBadge = document.createElement('div');
        photoBadge.className = 'member-photo-badge';
        if (member.status === 'active') {
            photoBadge.textContent = '✓';
            photoBadge.title = 'Active Member';
        } else {
            photoBadge.textContent = '⏸';
            photoBadge.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
            photoBadge.title = 'Inactive Member';
        }
        photo.appendChild(photoBadge);
        
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

document.getElementById('captureIdProofBtn').addEventListener('click', () => {
    showCameraCapture('idProof');
});

document.getElementById('removeIdProofBtn').addEventListener('click', () => {
    resetIdProofDisplay();
    document.getElementById('memberIdProof').value = '';
});

function resetPhotoDisplay() {
    currentPhotoData = null;
    const preview = document.getElementById('photoPreview');
    const placeholder = preview.querySelector('.photo-placeholder');
    const image = document.getElementById('photoImage');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    preview.classList.remove('has-image');
    if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = '📷 No photo captured';
    }
    image.style.display = 'none';
    image.src = '';
    removeBtn.style.display = 'none';
}

function displayTelegramPhotoReference(member) {
    currentPhotoData = null;
    const preview = document.getElementById('photoPreview');
    const placeholder = preview.querySelector('.photo-placeholder');
    const image = document.getElementById('photoImage');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    preview.classList.add('has-image');
    if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.textContent = '';
        placeholder.innerHTML = '✅ Photo stored securely on Telegram<br><small style="opacity: 0.7; font-size: 12px;">Capture a new photo to replace it</small>';
        
        if (member && member.photoTelegramMessageId) {
            const infoSmall = document.createElement('small');
            infoSmall.style.cssText = 'opacity: 0.7; font-size: 11px; display: block; margin-top: 8px; line-height: 1.4;';
            infoSmall.textContent = `💡 Message ID: #${member.photoTelegramMessageId} - View this photo in your Telegram bot chat`;
            placeholder.appendChild(document.createElement('br'));
            placeholder.appendChild(infoSmall);
        }
    }
    image.style.display = 'none';
    image.src = '';
    removeBtn.style.display = 'none';
}

function displayPhoto(dataUrl) {
    currentPhotoData = dataUrl;
    const preview = document.getElementById('photoPreview');
    const placeholder = document.querySelector('.photo-placeholder');
    const image = document.getElementById('photoImage');
    const removeBtn = document.getElementById('removePhotoBtn');
    
    preview.classList.add('has-image');
    if (placeholder) placeholder.style.display = 'none';
    image.src = dataUrl;
    image.style.display = 'block';
    removeBtn.style.display = 'inline-block';
    document.getElementById('memberPhoto').value = dataUrl;
}

function showCameraCapture(targetType = 'photo') {
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
    }).then(stream => {
        const overlay = document.createElement('div');
        overlay.className = 'camera-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeIn 0.3s ease-out;';
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = 'max-width: 90%; max-height: 70vh; border-radius: 16px; box-shadow: 0 20px 60px rgba(244, 196, 48, 0.3); animation: zoomIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);';
        
        const instructions = document.createElement('div');
        instructions.style.cssText = 'color: white; margin-top: 20px; text-align: center; font-size: 16px; opacity: 0.9;';
        instructions.innerHTML = `<p>📸 Position ${targetType === 'photo' ? 'yourself' : 'the ID proof'} in the frame</p>`;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 15px; margin-top: 25px;';
        
        const captureBtn = document.createElement('button');
        captureBtn.textContent = '📸 Capture';
        captureBtn.className = 'btn-camera-capture';
        captureBtn.style.cssText = 'padding: 15px 35px; font-size: 18px; background: linear-gradient(135deg, var(--primary-gold), #f4d060); color: var(--bg-primary); border: none; border-radius: 12px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(244, 196, 48, 0.4); transition: all 0.3s; animation: bounceIn 0.5s ease-out 0.3s backwards;';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '❌ Cancel';
        cancelBtn.style.cssText = 'padding: 15px 35px; font-size: 18px; background: rgba(255, 255, 255, 0.1); color: white; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; cursor: pointer; font-weight: 600; backdrop-filter: blur(10px); transition: all 0.3s; animation: bounceIn 0.5s ease-out 0.4s backwards;';
        
        captureBtn.addEventListener('mouseenter', () => {
            captureBtn.style.transform = 'scale(1.05)';
            captureBtn.style.boxShadow = '0 6px 20px rgba(244, 196, 48, 0.6)';
        });
        
        captureBtn.addEventListener('mouseleave', () => {
            captureBtn.style.transform = 'scale(1)';
            captureBtn.style.boxShadow = '0 4px 15px rgba(244, 196, 48, 0.4)';
        });
        
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = 'rgba(255, 59, 48, 0.2)';
            cancelBtn.style.borderColor = 'rgba(255, 59, 48, 0.5)';
        });
        
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
        
        const cleanupOverlay = () => {
            stream.getTracks().forEach(track => track.stop());
            overlay.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 200);
        };
        
        captureBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            
            if (targetType === 'photo') {
                displayPhoto(dataUrl);
            } else {
                displayIdProof(dataUrl);
            }
            
            cleanupOverlay();
        });
        
        cancelBtn.addEventListener('click', () => {
            cleanupOverlay();
        });
        
        buttonContainer.appendChild(captureBtn);
        buttonContainer.appendChild(cancelBtn);
        
        overlay.appendChild(video);
        overlay.appendChild(instructions);
        overlay.appendChild(buttonContainer);
        document.body.appendChild(overlay);
        
    }).catch(error => {
        console.error('Camera access error:', error);
        showToast('❌ Camera access denied or not available. Please use file upload instead.', 'error');
        alert('Camera access was denied or is not available on this device. Please use the file upload option instead.');
    });
}

document.getElementById('capturePhotoBtn').addEventListener('click', () => {
    showCameraCapture('photo');
});

document.getElementById('uploadPhotoBtn').addEventListener('click', () => {
    document.getElementById('memberPhotoFile').click();
});

document.getElementById('memberPhotoFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            displayPhoto(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('removePhotoBtn').addEventListener('click', () => {
    resetPhotoDisplay();
    document.getElementById('memberPhotoFile').value = '';
});

async function generateMemberPDF(member) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    
    const settings = storageManager.getSettings();
    const libraryName = settings.libraryName || 'My Library';
    
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    pdf.setFillColor(244, 196, 48);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    pdf.setDrawColor(212, 160, 23);
    pdf.setLineWidth(0.5);
    pdf.line(0, 35, pageWidth, 35);
    
    pdf.setTextColor(26, 26, 26);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text(libraryName.toUpperCase(), pageWidth / 2, 12, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('MEMBER REGISTRATION FORM', pageWidth / 2, 21, { align: 'center' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    const regDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    pdf.text(`Registration Date: ${regDate}`, pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFillColor(250, 250, 250);
    pdf.setDrawColor(244, 196, 48);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, 45, pageWidth - 2 * margin, 50, 4, 4, 'FD');
    
    pdf.setTextColor(212, 160, 23);
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.text(member.name, pageWidth / 2, 62, { align: 'center' });
    
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`📱 ${member.contact}`, pageWidth / 2, 73, { align: 'center' });
    if (member.email) {
        pdf.text(`📧 ${member.email}`, pageWidth / 2, 82, { align: 'center' });
    }
    
    if (member.seat && member.seat > 0) {
        pdf.setFillColor(244, 196, 48);
        pdf.roundedRect(pageWidth / 2 - 18, 87, 36, 6, 2, 2, 'F');
        pdf.setTextColor(26, 26, 26);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`🪑 SEAT ${member.seat}`, pageWidth / 2, 91, { align: 'center' });
    }
    
    let yPos = 110;
    
    const addSection = (title, details) => {
        pdf.setFillColor(244, 196, 48);
        pdf.roundedRect(margin, yPos, pageWidth - 2 * margin, 10, 2, 2, 'F');
        
        pdf.setTextColor(26, 26, 26);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 5, yPos + 7);
        yPos += 15;
        
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.3);
        
        details.forEach((detail, index) => {
            if (yPos > pageHeight - 40) {
                pdf.addPage();
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');
                
                pdf.setFillColor(244, 196, 48);
                pdf.rect(0, 0, pageWidth, 8, 'F');
                pdf.setTextColor(26, 26, 26);
                pdf.setFontSize(10);
                pdf.text(`${libraryName} - ${member.name}`, pageWidth / 2, 5, { align: 'center' });
                
                yPos = 20;
            }
            
            if (index % 2 === 0) {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');
            }
            
            pdf.setTextColor(80, 80, 80);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`${detail.label}:`, margin + 5, yPos);
            
            pdf.setTextColor(26, 26, 26);
            pdf.setFont('helvetica', 'bold');
            pdf.text(detail.value, margin + 65, yPos);
            
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
            
            pdf.setFont('helvetica', 'normal');
            yPos += 8;
        });
        
        yPos += 8;
    };
    
    addSection('📋 PERSONAL INFORMATION', [
        { label: 'Full Name', value: member.name },
        { label: 'Contact Number', value: member.contact },
        { label: 'Email Address', value: member.email || 'Not Provided' },
        { label: 'Aadhar Number', value: member.aadhar || 'Not Provided' },
        { label: 'Address', value: member.address || 'Not Provided' }
    ]);
    
    addSection('🪑 MEMBERSHIP DETAILS', [
        { label: 'Seat Number', value: member.seat ? `Seat ${member.seat}` : 'No Seat Assigned' },
        { label: 'Membership Type', value: member.membershipType || 'Monthly' },
        { label: 'Monthly Fee', value: `₹${member.fee}` },
        { label: 'Status', value: member.status === 'active' ? 'Active ✅' : 'Inactive ❌' }
    ]);
    
    addSection('📅 PAYMENT INFORMATION', [
        { label: 'Joining Date', value: new Date(member.joiningDate).toLocaleDateString('en-IN') },
        { label: 'Payment Date', value: new Date(member.paymentDate).toLocaleDateString('en-IN') },
        { label: 'Months Paid', value: `${member.monthsPaidInAdvance} month(s)` },
        { label: 'Payment Method', value: member.paymentMethod || 'Cash' },
        { label: 'Next Payment', value: member.nextPaymentDate ? new Date(member.nextPaymentDate).toLocaleDateString('en-IN') : 'Not Set' }
    ]);
    
    pdf.setDrawColor(244, 196, 48);
    pdf.setLineWidth(0.8);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    pdf.setFillColor(250, 250, 250);
    pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Page 1 of 3 - Member Details', pageWidth / 2, pageHeight - 11, { align: 'center' });
    
    pdf.setTextColor(120, 120, 120);
    pdf.setFontSize(7);
    const timestamp = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString('en-IN');
    pdf.text(`Generated: ${timestamp}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    pdf.setTextColor(212, 160, 23);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(libraryName, pageWidth / 2, pageHeight - 2, { align: 'center' });
    
    if (currentIdProofData || member.idProofTelegramFileId) {
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        pdf.setFillColor(244, 196, 48);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        
        pdf.setDrawColor(212, 160, 23);
        pdf.setLineWidth(0.5);
        pdf.line(0, 15, pageWidth, 15);
        
        pdf.setTextColor(26, 26, 26);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(`${libraryName.toUpperCase()} - ID PROOF`, pageWidth / 2, 6, { align: 'center' });
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`🆔 ${member.name}`, pageWidth / 2, 11, { align: 'center' });
        
        if (currentIdProofData) {
            try {
                const headerHeight = 15;
                const footerHeight = 18;
                const availableHeight = pageHeight - headerHeight - footerHeight;
                const imgWidth = availableHeight * (9 / 16);
                const imgHeight = availableHeight;
                const imgX = (pageWidth - imgWidth) / 2;
                const imgY = headerHeight;
                
                pdf.setFillColor(245, 245, 245);
                pdf.rect(0, imgY, pageWidth, imgHeight, 'F');
                
                pdf.setDrawColor(244, 196, 48);
                pdf.setLineWidth(4);
                pdf.rect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 'D');
                
                pdf.addImage(currentIdProofData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            } catch (error) {
                console.error('Error adding ID proof to PDF:', error);
                pdf.setTextColor(200, 80, 80);
                pdf.setFontSize(12);
                pdf.text('⚠️ ID Proof image could not be embedded', pageWidth / 2, pageHeight / 2, { align: 'center' });
            }
        } else if (member.idProofTelegramFileId) {
            pdf.setFillColor(250, 250, 250);
            pdf.roundedRect(margin, 60, pageWidth - 2 * margin, 60, 4, 4, 'F');
            
            pdf.setTextColor(76, 175, 80);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('✅ ID Proof Stored Securely', pageWidth / 2, 80, { align: 'center' });
            
            pdf.setTextColor(80, 80, 80);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.text('ID proof is securely stored on Telegram cloud.', pageWidth / 2, 95, { align: 'center' });
            pdf.text('Access it anytime from your Telegram account.', pageWidth / 2, 105, { align: 'center' });
            
            if (member.idProofTelegramLink) {
                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(9);
                pdf.text('View in Telegram:', pageWidth / 2, 115, { align: 'center' });
            }
        }
        
        pdf.setDrawColor(244, 196, 48);
        pdf.setLineWidth(0.8);
        pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        pdf.setFillColor(250, 250, 250);
        pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Page 2 of 3 - ID Proof Document', pageWidth / 2, pageHeight - 11, { align: 'center' });
        
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(7);
        pdf.text(`Member: ${member.name} | Contact: ${member.contact}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        
        pdf.setTextColor(212, 160, 23);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(libraryName, pageWidth / 2, pageHeight - 2, { align: 'center' });
    }
    
    if (currentPhotoData || member.photoTelegramFileId) {
        pdf.addPage();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        pdf.setFillColor(244, 196, 48);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        
        pdf.setDrawColor(212, 160, 23);
        pdf.setLineWidth(0.5);
        pdf.line(0, 15, pageWidth, 15);
        
        pdf.setTextColor(26, 26, 26);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(`${libraryName.toUpperCase()} - MEMBER PHOTO`, pageWidth / 2, 6, { align: 'center' });
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`📸 ${member.name}`, pageWidth / 2, 11, { align: 'center' });
        
        if (currentPhotoData) {
            try {
                const headerHeight = 15;
                const footerHeight = 18;
                const availableHeight = pageHeight - headerHeight - footerHeight;
                const imgWidth = availableHeight * (9 / 16);
                const imgHeight = availableHeight;
                const imgX = (pageWidth - imgWidth) / 2;
                const imgY = headerHeight;
                
                pdf.setFillColor(245, 245, 245);
                pdf.rect(0, imgY, pageWidth, imgHeight, 'F');
                
                pdf.setDrawColor(244, 196, 48);
                pdf.setLineWidth(4);
                pdf.rect(imgX - 3, imgY - 3, imgWidth + 6, imgHeight + 6, 'D');
                
                pdf.addImage(currentPhotoData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            } catch (error) {
                console.error('Error adding photo to PDF:', error);
                pdf.setTextColor(200, 80, 80);
                pdf.setFontSize(12);
                pdf.text('⚠️ Member photo could not be embedded', pageWidth / 2, pageHeight / 2, { align: 'center' });
            }
        } else if (member.photoTelegramFileId) {
            pdf.setFillColor(250, 250, 250);
            pdf.roundedRect(margin, 60, pageWidth - 2 * margin, 60, 4, 4, 'F');
            
            pdf.setTextColor(76, 175, 80);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text('✅ Photo Stored Securely', pageWidth / 2, 80, { align: 'center' });
            
            pdf.setTextColor(80, 80, 80);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Member photo is securely stored on Telegram cloud.', pageWidth / 2, 95, { align: 'center' });
            pdf.text('Access it anytime from your Telegram account.', pageWidth / 2, 105, { align: 'center' });
            
            if (member.photoTelegramLink) {
                pdf.setTextColor(100, 100, 100);
                pdf.setFontSize(9);
                pdf.text('View in Telegram:', pageWidth / 2, 115, { align: 'center' });
            }
        }
        
        pdf.setDrawColor(244, 196, 48);
        pdf.setLineWidth(0.8);
        pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        pdf.setFillColor(250, 250, 250);
        pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Page 3 of 3 - Member Photograph', pageWidth / 2, pageHeight - 11, { align: 'center' });
        
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(7);
        pdf.text(`Member: ${member.name} | Contact: ${member.contact}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        
        pdf.setTextColor(212, 160, 23);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.text(libraryName, pageWidth / 2, pageHeight - 2, { align: 'center' });
    }
    
    return pdf;
}

function showPreviewModal(memberData) {
    pendingMemberData = memberData;
    
    const photoDisplay = document.getElementById('previewPhotoDisplay');
    if (currentPhotoData) {
        photoDisplay.innerHTML = `<img src="${currentPhotoData}" style="max-width: 100%; max-height: 250px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">`;
    } else {
        photoDisplay.innerHTML = '<span class="photo-placeholder">📷 No photo captured</span>';
    }
    
    const detailsContent = document.getElementById('previewDetailsContent');
    detailsContent.innerHTML = `
        <div class="preview-detail-row">
            <span class="preview-label">👤 Name:</span>
            <span class="preview-value">${memberData.name}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">📱 Contact:</span>
            <span class="preview-value">${memberData.contact}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">📧 Email:</span>
            <span class="preview-value">${memberData.email || 'Not Provided'}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">🆔 Aadhar:</span>
            <span class="preview-value">${memberData.aadhar || 'Not Provided'}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">🪑 Seat:</span>
            <span class="preview-value">${memberData.seat ? `Seat ${memberData.seat}` : 'No Seat'}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">💳 Membership:</span>
            <span class="preview-value">${memberData.membershipType}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">💰 Fee:</span>
            <span class="preview-value">₹${memberData.fee}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">📅 Joining Date:</span>
            <span class="preview-value">${new Date(memberData.joiningDate).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">📊 Status:</span>
            <span class="preview-value">${memberData.status === 'active' ? '✅ Active' : '❌ Inactive'}</span>
        </div>
        <div class="preview-detail-row">
            <span class="preview-label">🏠 Address:</span>
            <span class="preview-value">${memberData.address || 'Not Provided'}</span>
        </div>
    `;
    
    hideModal('memberModal');
    showModal('previewModal');
}

document.getElementById('closePreviewBtn').addEventListener('click', () => {
    hideModal('previewModal');
    showModal('memberModal');
});

document.getElementById('cancelPreviewBtn').addEventListener('click', () => {
    hideModal('previewModal');
    showModal('memberModal');
});

document.getElementById('retakePhotoBtn').addEventListener('click', () => {
    hideModal('previewModal');
    showModal('memberModal');
    showCameraCapture('photo');
});

document.getElementById('confirmSaveBtn').addEventListener('click', async () => {
    if (!pendingMemberData) return;
    
    const confirmBtn = document.getElementById('confirmSaveBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Saving...';
    
    try {
        let savedMember;
        if (currentEditId) {
            const success = await storageManager.updateMember(currentEditId, pendingMemberData);
            if (success) {
                const members = storageManager.getMembers();
                savedMember = members.find(m => m.id === currentEditId);
            }
        } else {
            savedMember = await storageManager.addMember(pendingMemberData);
        }
        
        if (!savedMember) {
            throw new Error('Failed to save member data');
        }
        
        confirmBtn.textContent = '📄 Generating PDF...';
        const pdf = await generateMemberPDF(savedMember);
        
        const date = new Date().toISOString().split('T')[0];
        const seatInfo = savedMember.seat ? `_S${savedMember.seat}` : '';
        const filename = `Member_${savedMember.name.replace(/\s+/g, '_')}${seatInfo}_${date}.pdf`;
        
        pdf.save(filename);
        
        if (typeof telegramNotifier !== 'undefined' && telegramNotifier.isConfigured()) {
            confirmBtn.textContent = '📤 Sending to Telegram...';
            
            const pdfBlob = pdf.output('blob');
            const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
            
            const message = currentEditId 
                ? telegramNotifier.formatMemberUpdatedMessage(
                    storageManager.getMembers().find(m => m.id === currentEditId), 
                    savedMember
                  )
                : telegramNotifier.formatMemberAddedMessage(savedMember);
            
            try {
                const documentResult = await telegramNotifier.sendDocument(pdfFile, message);
                
                if (documentResult.success) {
                    showToast('✅ Member saved and PDF sent to Telegram successfully!', 'success');
                } else {
                    throw new Error(documentResult.error || 'Failed to send PDF');
                }
            } catch (telegramError) {
                console.error('Telegram sending error:', telegramError);
                showToast(`⚠️ Member saved but Telegram failed. Retry?`, 'warning');
                
                if (confirm(`PDF was saved locally but Telegram sending failed.\n\nError: ${telegramError.message}\n\nWould you like to retry sending to Telegram?`)) {
                    confirmBtn.textContent = '🔄 Retrying Telegram...';
                    try {
                        const retryResult = await telegramNotifier.sendDocument(pdfFile, message);
                        if (retryResult.success) {
                            showToast('✅ PDF successfully sent to Telegram on retry!', 'success');
                        } else {
                            throw new Error(retryResult.error || 'Retry failed');
                        }
                    } catch (retryError) {
                        console.error('Retry failed:', retryError);
                        showToast('❌ Telegram sending failed again. PDF is saved locally.', 'error');
                        alert('Telegram sending failed. The PDF has been downloaded to your device and the member has been saved successfully.');
                    }
                }
            }
        } else {
            showToast('✅ Member saved and PDF downloaded successfully!', 'success');
        }
        
        hideModal('previewModal');
        loadMembers();
        pendingMemberData = null;
        currentPhotoData = null;
        currentIdProofData = null;
        
    } catch (error) {
        console.error('Error saving member:', error);
        showToast('❌ Error saving member. Please try again.', 'error');
        alert(`Error: ${error.message}\n\nPlease try again or contact support if the issue persists.`);
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = '✅ Confirm & Save';
    }
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
    resetPhotoDisplay();
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

document.getElementById('memberForm').addEventListener('submit', (e) => {
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
        photo: currentPhotoData || '',
        address: document.getElementById('memberAddress').value,
        idProof: currentIdProofData || null
    };
    
    showPreviewModal(member);
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
        document.getElementById('memberAddress').value = member.address || '';
        
        if (member.photoTelegramFileId) {
            displayTelegramPhotoReference(member);
        } else {
            resetPhotoDisplay();
        }
        
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