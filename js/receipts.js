storageManager.checkAuth();

let currentMember = null;
let allPayments = [];
let filteredPayments = [];

function loadMemberSelect() {
    const members = storageManager.getMembers();
    const select = document.getElementById('memberSelect');
    
    const sortedMembers = members.sort((a, b) => a.name.localeCompare(b.name));
    
    select.innerHTML = '<option value="">-- Select Member --</option>' +
        sortedMembers.map(m => 
            `<option value="${m.id}">${m.name} - Seat ${m.seat || 'N/A'} - ${m.contact}</option>`
        ).join('');
}

document.getElementById('memberSelect').addEventListener('change', (e) => {
    const memberId = e.target.value;
    if (memberId) {
        loadMemberPayments(memberId);
    } else {
        clearSelection();
    }
});

function loadMemberPayments(memberId) {
    const members = storageManager.getMembers();
    currentMember = members.find(m => m.id === memberId);
    
    if (!currentMember) {
        alert('Member not found!');
        return;
    }
    
    const fees = storageManager.getFees();
    allPayments = fees.filter(f => f.memberId === memberId).sort((a, b) => {
        return new Date(b.month) - new Date(a.month);
    });
    
    filteredPayments = [...allPayments];
    
    displayMemberInfo();
    displayPaymentHistory();
    
    document.getElementById('memberInfoSection').style.display = 'block';
    document.getElementById('noSelectionMessage').style.display = 'none';
}

function displayMemberInfo() {
    document.getElementById('memberName').textContent = currentMember.name;
    document.getElementById('memberPhone').textContent = `📞 ${currentMember.contact}`;
    document.getElementById('memberSeat').textContent = `🪑 Seat ${currentMember.seat || 'N/A'}`;
    
    const statusClass = currentMember.status === 'active' ? 'success' : 'danger';
    document.getElementById('memberStatus').innerHTML = 
        `<span class="badge ${statusClass}">${currentMember.status}</span>`;
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = filteredPayments.filter(p => p.status === 'pending');
    const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    document.getElementById('totalPayments').textContent = paidPayments.length;
    document.getElementById('totalAmount').textContent = storageManager.formatCurrency(totalPaid);
    document.getElementById('pendingAmount').textContent = storageManager.formatCurrency(totalPending);
}

function displayPaymentHistory() {
    const timeline = document.getElementById('paymentTimeline');
    
    if (filteredPayments.length === 0) {
        timeline.innerHTML = '<p class="no-data">No payment records found for this member.</p>';
        return;
    }
    
    timeline.innerHTML = filteredPayments.map((payment, index) => {
        const isPaid = payment.status === 'paid';
        const statusClass = isPaid ? 'paid' : 'pending';
        const statusIcon = isPaid ? '✓' : '⏳';
        
        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-marker">${statusIcon}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h4>${payment.month}</h4>
                        <span class="status-badge ${statusClass}">${payment.status}</span>
                    </div>
                    <div class="timeline-details">
                        <div class="detail-row">
                            <span class="label">Amount:</span>
                            <span class="value">${storageManager.formatCurrency(payment.amount)}</span>
                        </div>
                        ${isPaid ? `
                        <div class="detail-row">
                            <span class="label">Payment Date:</span>
                            <span class="value">${storageManager.formatDate(payment.paymentDate)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Payment Method:</span>
                            <span class="value">${payment.paymentMethod || 'N/A'}</span>
                        </div>
                        ` : ''}
                        ${payment.notes ? `
                        <div class="detail-row">
                            <span class="label">Notes:</span>
                            <span class="value">${payment.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                    ${isPaid ? `
                    <div class="timeline-actions">
                        <button class="btn-sm btn-primary" onclick="downloadSinglePDF('${payment.id}')">
                            📥 PDF
                        </button>
                        <button class="btn-sm btn-success" onclick="sendSingleWhatsApp('${payment.id}')">
                            📱 WhatsApp
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function clearSelection() {
    document.getElementById('memberSelect').value = '';
    document.getElementById('memberInfoSection').style.display = 'none';
    document.getElementById('noSelectionMessage').style.display = 'block';
    currentMember = null;
    allPayments = [];
    filteredPayments = [];
    clearDateFilter();
}

function applyDateFilter() {
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;
    
    if (!startMonth && !endMonth) {
        alert('Please select at least one date filter');
        return;
    }
    
    filteredPayments = allPayments.filter(payment => {
        if (startMonth && payment.month < startMonth) return false;
        if (endMonth && payment.month > endMonth) return false;
        return true;
    });
    
    displayMemberInfo();
    displayPaymentHistory();
}

function clearDateFilter() {
    document.getElementById('startMonth').value = '';
    document.getElementById('endMonth').value = '';
    filteredPayments = [...allPayments];
    if (currentMember) {
        displayMemberInfo();
        displayPaymentHistory();
    }
}

function generateReceiptHTML(payments, isAll = true) {
    const settings = storageManager.getSettings();
    const libraryName = settings.libraryName || 'Library Management System';
    
    const paidPayments = payments.filter(p => p.status === 'paid');
    const totalAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const receiptDate = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div style="max-width: 800px; margin: 0 auto; padding: 30px; font-family: Arial, sans-serif; background: white; color: #000;">
            <div style="text-align: center; border-bottom: 3px solid #f4c430; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="margin: 0; color: #1a1a1a; font-size: 28px;">📚 ${libraryName}</h1>
                <p style="margin: 5px 0; color: #666; font-size: 14px;">Payment Receipt</p>
                <p style="margin: 5px 0; color: #888; font-size: 12px;">Generated: ${receiptDate}</p>
            </div>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">Member Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 0; color: #666; width: 120px;">Name:</td>
                        <td style="padding: 5px 0; color: #1a1a1a; font-weight: bold;">${currentMember.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Contact:</td>
                        <td style="padding: 5px 0; color: #1a1a1a;">${currentMember.contact}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Seat Number:</td>
                        <td style="padding: 5px 0; color: #1a1a1a;">${currentMember.seat || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #666;">Member ID:</td>
                        <td style="padding: 5px 0; color: #1a1a1a;">#${currentMember.id.slice(-6)}</td>
                    </tr>
                </table>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">Payment Details</h3>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background: #f4c430; color: #1a1a1a;">
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Month</th>
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Payment Date</th>
                            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Method</th>
                            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
                            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paidPayments.map((payment, index) => `
                            <tr style="background: ${index % 2 === 0 ? '#fff' : '#f9f9f9'};">
                                <td style="padding: 10px; border: 1px solid #ddd;">${payment.month}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${storageManager.formatDate(payment.paymentDate)}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${payment.paymentMethod || 'N/A'}</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: bold;">${storageManager.formatCurrency(payment.amount)}</td>
                                <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">
                                    <span style="background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">Paid</span>
                                </td>
                            </tr>
                        `).join('')}
                        <tr style="background: #f4c430; font-weight: bold;">
                            <td colspan="3" style="padding: 12px; border: 1px solid #ddd; text-align: right;">TOTAL:</td>
                            <td style="padding: 12px; text-align: right; border: 1px solid #ddd; font-size: 16px;">${storageManager.formatCurrency(totalAmount)}</td>
                            <td style="padding: 12px; border: 1px solid #ddd;"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 30px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 12px;">Thank you for your payment!</p>
                <p style="margin: 5px 0 0 0; color: #888; font-size: 11px;">This is a computer-generated receipt.</p>
            </div>
        </div>
    `;
}

async function downloadAllPDF() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records to download');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    const receiptHTML = generateReceiptHTML(paidPayments, true);
    await generatePDF(receiptHTML, `${currentMember.name}_All_Payments.pdf`);
}

async function downloadLastPDF() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records found');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    const lastPayment = paidPayments[0];
    const receiptHTML = generateReceiptHTML([lastPayment], false);
    await generatePDF(receiptHTML, `${currentMember.name}_${lastPayment.month}_Payment.pdf`);
}

async function downloadSinglePDF(paymentId) {
    const payment = allPayments.find(p => p.id === paymentId);
    if (!payment || payment.status !== 'paid') {
        alert('Payment not found or not paid');
        return;
    }
    
    const receiptHTML = generateReceiptHTML([payment], false);
    await generatePDF(receiptHTML, `${currentMember.name}_${payment.month}_Payment.pdf`);
}

async function generatePDF(htmlContent, filename) {
    try {
        if (!window.jspdf || !window.html2canvas) {
            alert('PDF libraries not loaded yet. Please wait a moment and try again.');
            return;
        }
        
        const container = document.getElementById('receiptContent');
        container.innerHTML = htmlContent;
        container.style.display = 'block';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        container.style.display = 'none';
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(filename);
        
        container.innerHTML = '';
        
        alert('PDF downloaded successfully!');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message + '. Please try again.');
    }
}

function sendAllWhatsApp() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records found');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    const totalAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const settings = storageManager.getSettings();
    const libraryName = settings.libraryName || 'Library Management System';
    
    let message = `*${libraryName}*\n`;
    message += `*Payment Receipt - All Payments*\n\n`;
    message += `📋 *Member Details:*\n`;
    message += `Name: ${currentMember.name}\n`;
    message += `Seat: ${currentMember.seat || 'N/A'}\n`;
    message += `Contact: ${currentMember.contact}\n\n`;
    message += `💰 *Payment Summary:*\n`;
    message += `Total Payments: ${paidPayments.length}\n`;
    message += `Total Amount: ${storageManager.formatCurrency(totalAmount)}\n\n`;
    message += `📝 *Payment Details:*\n`;
    
    paidPayments.forEach((payment, index) => {
        message += `\n${index + 1}. ${payment.month}\n`;
        message += `   Amount: ${storageManager.formatCurrency(payment.amount)}\n`;
        message += `   Date: ${storageManager.formatDate(payment.paymentDate)}\n`;
        message += `   Method: ${payment.paymentMethod || 'N/A'}\n`;
    });
    
    message += `\n\nThank you for your payment! 🙏`;
    
    sendWhatsAppMessage(currentMember.contact, message);
}

function sendLastWhatsApp() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records found');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    const lastPayment = paidPayments[0];
    sendSingleWhatsApp(lastPayment.id);
}

function sendSingleWhatsApp(paymentId) {
    const payment = allPayments.find(p => p.id === paymentId);
    if (!payment || payment.status !== 'paid') {
        alert('Payment not found or not paid');
        return;
    }
    
    const settings = storageManager.getSettings();
    const libraryName = settings.libraryName || 'Library Management System';
    
    let message = `*${libraryName}*\n`;
    message += `*Payment Receipt*\n\n`;
    message += `📋 *Member Details:*\n`;
    message += `Name: ${currentMember.name}\n`;
    message += `Seat: ${currentMember.seat || 'N/A'}\n`;
    message += `Contact: ${currentMember.contact}\n\n`;
    message += `💰 *Payment Details:*\n`;
    message += `Month: ${payment.month}\n`;
    message += `Amount: ${storageManager.formatCurrency(payment.amount)}\n`;
    message += `Payment Date: ${storageManager.formatDate(payment.paymentDate)}\n`;
    message += `Payment Method: ${payment.paymentMethod || 'N/A'}\n`;
    
    if (payment.notes) {
        message += `Notes: ${payment.notes}\n`;
    }
    
    message += `\n\nThank you for your payment! 🙏`;
    
    sendWhatsAppMessage(currentMember.contact, message);
}

function sendWhatsAppMessage(phoneNumber, message) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    let whatsappNumber = cleanNumber;
    if (cleanNumber.length === 10) {
        whatsappNumber = '91' + cleanNumber;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

function printReceipt() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records to print');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    const receiptHTML = generateReceiptHTML(paidPayments, true);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment Receipt - ${currentMember.name}</title>
            <style>
                @media print {
                    body { margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            ${receiptHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
}

function exportToCSV() {
    if (!currentMember || filteredPayments.length === 0) {
        alert('No payment records to export');
        return;
    }
    
    const paidPayments = filteredPayments.filter(p => p.status === 'paid');
    if (paidPayments.length === 0) {
        alert('No paid payments found');
        return;
    }
    
    let csv = 'Month,Payment Date,Payment Method,Amount,Status,Notes\n';
    
    paidPayments.forEach(payment => {
        const row = [
            payment.month,
            storageManager.formatDate(payment.paymentDate),
            payment.paymentMethod || 'N/A',
            payment.amount,
            payment.status,
            (payment.notes || '').replace(/,/g, ';')
        ].join(',');
        csv += row + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentMember.name}_Payments.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('CSV file exported successfully!');
}

loadMemberSelect();
