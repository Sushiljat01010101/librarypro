class TelegramNotifier {
    constructor() {
        this.apiUrl = 'https://api.telegram.org/bot';
    }

    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    getSettings() {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        return {
            botToken: settings.telegramBotToken || '',
            chatId: settings.telegramChatId || ''
        };
    }

    isConfigured() {
        const { botToken, chatId } = this.getSettings();
        return botToken && chatId && botToken.trim() !== '' && chatId.trim() !== '';
    }

    async sendMessage(message) {
        if (!this.isConfigured()) {
            console.log('Telegram not configured. Skipping notification.');
            return { success: false, error: 'Not configured' };
        }

        const { botToken, chatId } = this.getSettings();
        const url = `${this.apiUrl}${botToken}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();
            
            if (data.ok) {
                console.log('Telegram notification sent successfully');
                return { success: true };
            } else {
                console.error('Telegram API error:', data.description);
                return { success: false, error: data.description };
            }
        } catch (error) {
            console.error('Failed to send Telegram notification:', error);
            return { success: false, error: error.message };
        }
    }

    async sendDocument(file, caption = '') {
        if (!this.isConfigured()) {
            console.log('Telegram not configured. Skipping file send.');
            return { success: false, error: 'Not configured' };
        }

        const { botToken, chatId } = this.getSettings();
        const url = `${this.apiUrl}${botToken}/sendDocument`;

        try {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', file);
            if (caption) {
                formData.append('caption', caption);
                formData.append('parse_mode', 'HTML');
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.ok) {
                console.log('Telegram file sent successfully');
                return { success: true };
            } else {
                console.error('Telegram API error:', data.description);
                return { success: false, error: data.description };
            }
        } catch (error) {
            console.error('Failed to send Telegram file:', error);
            return { success: false, error: error.message };
        }
    }

    async sendPhoto(photoDataUrl, caption = '') {
        if (!this.isConfigured()) {
            console.log('Telegram not configured. Skipping photo send.');
            return { success: false, error: 'Not configured' };
        }

        const { botToken, chatId } = this.getSettings();
        const url = `${this.apiUrl}${botToken}/sendPhoto`;

        try {
            const blob = await fetch(photoDataUrl).then(r => r.blob());
            const file = new File([blob], 'id_proof.jpg', { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', file);
            if (caption) {
                formData.append('caption', caption);
                formData.append('parse_mode', 'HTML');
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.ok) {
                console.log('Telegram photo sent successfully');
                const photoData = data.result.photo[data.result.photo.length - 1];
                return { 
                    success: true, 
                    fileId: photoData.file_id,
                    messageId: data.result.message_id
                };
            } else {
                console.error('Telegram API error:', data.description);
                return { success: false, error: data.description };
            }
        } catch (error) {
            console.error('Failed to send Telegram photo:', error);
            return { success: false, error: error.message };
        }
    }

    formatMemberAddedMessage(member) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        let message = `🎉 <b>New Member Added</b>\n\n`;
        message += `📚😂😂😂${libraryName}\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Name:</b> ${this.escapeHtml(member.name)}\n`;
        message += `📱 <b>Contact:</b> ${this.escapeHtml(member.contact)}\n`;
        
        if (member.seat && member.seat > 0) {
            message += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
        }
        
        message += `🎫 <b>Membership:</b> ${this.escapeHtml(member.membershipType || 'monthly')}\n`;
        message += `💰 <b>Fee:</b> ₹${this.escapeHtml(member.fee || 0)}\n`;
        message += `📊 <b>Status:</b> ${member.status === 'active' ? '✅ Active' : '❌ Inactive'}\n`;
        
        if (member.joiningDate) {
            const date = new Date(member.joiningDate);
            message += `🗓️ <b>Joined:</b> ${date.toLocaleDateString('en-IN')}\n`;
        }
        
        message += `\n🕐 <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    formatMemberUpdatedMessage(oldMember, updatedMember) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        let message = `✏️ <b>Member Updated</b>\n\n`;
        message += `📚 <b>${libraryName}</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Member:</b> ${this.escapeHtml(updatedMember.name)}\n\n`;
        
        const changes = [];
        
        if (oldMember.name !== updatedMember.name) {
            changes.push(`<b>Name:</b> ${this.escapeHtml(oldMember.name)} → ${this.escapeHtml(updatedMember.name)}`);
        }
        if (oldMember.contact !== updatedMember.contact) {
            changes.push(`<b>Contact:</b> ${this.escapeHtml(oldMember.contact)} → ${this.escapeHtml(updatedMember.contact)}`);
        }
        if (oldMember.aadhar !== updatedMember.aadhar) {
            const oldAadhar = oldMember.aadhar || 'None';
            const newAadhar = updatedMember.aadhar || 'None';
            changes.push(`<b>Aadhar:</b> ${this.escapeHtml(oldAadhar)} → ${this.escapeHtml(newAadhar)}`);
        }
        if (oldMember.seat !== updatedMember.seat) {
            changes.push(`<b>Seat:</b> ${this.escapeHtml(oldMember.seat || 'None')} → ${this.escapeHtml(updatedMember.seat || 'None')}`);
        }
        if (oldMember.membershipType !== updatedMember.membershipType) {
            changes.push(`<b>Membership:</b> ${this.escapeHtml(oldMember.membershipType)} → ${this.escapeHtml(updatedMember.membershipType)}`);
        }
        if (oldMember.fee !== updatedMember.fee) {
            changes.push(`<b>Fee:</b> ₹${this.escapeHtml(oldMember.fee)} → ₹${this.escapeHtml(updatedMember.fee)}`);
        }
        if (oldMember.status !== updatedMember.status) {
            const oldStatus = oldMember.status === 'active' ? '✅ Active' : '❌ Inactive';
            const newStatus = updatedMember.status === 'active' ? '✅ Active' : '❌ Inactive';
            changes.push(`<b>Status:</b> ${oldStatus} → ${newStatus}`);
        }
        
        if (changes.length > 0) {
            message += `📝 <b>Changes:</b>\n${changes.join('\n')}\n`;
        } else {
            message += `<i>Minor updates made</i>\n`;
        }
        
        message += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    formatMemberDeletedMessage(member) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        let message = `🗑️ <b>Member Deleted</b>\n\n`;
        message += `📚 <b>${libraryName}</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Name:</b> ${this.escapeHtml(member.name)}\n`;
        message += `📱 <b>Contact:</b> ${this.escapeHtml(member.contact)}\n`;
        
        if (member.seat && member.seat > 0) {
            message += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)} (now available)\n`;
        }
        
        message += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    formatPaymentAddedMessage(fee) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        const members = JSON.parse(localStorage.getItem('libraryMembers')) || [];
        const member = members.find(m => m.id === fee.memberId);
        
        let message = `💰 <b>Payment Recorded</b>\n\n`;
        message += `📚 <b>${libraryName}</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Member:</b> ${this.escapeHtml(fee.memberName)}\n`;
        
        if (member) {
            message += `📱 <b>Phone:</b> ${this.escapeHtml(member.contact)}\n`;
            if (member.seat && member.seat > 0) {
                message += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
            } else {
                message += `🪑 <b>Seat:</b> Not Assigned\n`;
            }
        }
        
        message += `\n💵 <b>Amount:</b> ₹${this.escapeHtml(fee.amount)}\n`;
        message += `📅 <b>For Month:</b> ${this.escapeHtml(fee.month)}\n`;
        message += `✅ <b>Status:</b> ${fee.status === 'paid' ? '✅ Paid' : '⏳ Pending'}\n`;
        
        if (fee.paymentDate) {
            const date = new Date(fee.paymentDate);
            message += `📆 <b>Payment Date:</b> ${date.toLocaleDateString('en-IN')}\n`;
        }
        
        if (fee.paymentMethod) {
            const methodEmoji = {
                'cash': '💵',
                'online': '💳',
                'upi': '📱',
                'card': '💳',
                'cheque': '📝'
            };
            const emoji = methodEmoji[fee.paymentMethod.toLowerCase()] || '💳';
            message += `${emoji} <b>Payment Method:</b> ${this.escapeHtml(fee.paymentMethod)}\n`;
        }
        
        if (fee.notes) {
            message += `📝 <b>Notes:</b> ${this.escapeHtml(fee.notes)}\n`;
        }
        
        message += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    formatPaymentUpdatedMessage(oldFee, updatedFee) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        const members = JSON.parse(localStorage.getItem('libraryMembers')) || [];
        const member = members.find(m => m.id === updatedFee.memberId);
        
        let message = `✏️ <b>Payment Updated</b>\n\n`;
        message += `📚 <b>${libraryName}</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Member:</b> ${this.escapeHtml(updatedFee.memberName)}\n`;
        
        if (member) {
            message += `📱 <b>Phone:</b> ${this.escapeHtml(member.contact)}\n`;
            if (member.seat && member.seat > 0) {
                message += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
            }
        }
        
        message += `📅 <b>Month:</b> ${this.escapeHtml(updatedFee.month)}\n\n`;
        
        const changes = [];
        
        if (oldFee.amount !== updatedFee.amount) {
            changes.push(`💵 <b>Amount:</b> ₹${this.escapeHtml(oldFee.amount)} → ₹${this.escapeHtml(updatedFee.amount)}`);
        }
        if (oldFee.status !== updatedFee.status) {
            const oldStatus = oldFee.status === 'paid' ? '✅ Paid' : '⏳ Pending';
            const newStatus = updatedFee.status === 'paid' ? '✅ Paid' : '⏳ Pending';
            changes.push(`✅ <b>Status:</b> ${oldStatus} → ${newStatus}`);
        }
        if (oldFee.paymentMethod !== updatedFee.paymentMethod) {
            changes.push(`💳 <b>Method:</b> ${this.escapeHtml(oldFee.paymentMethod || 'None')} → ${this.escapeHtml(updatedFee.paymentMethod || 'None')}`);
        }
        if (oldFee.paymentDate !== updatedFee.paymentDate) {
            const oldDate = oldFee.paymentDate ? new Date(oldFee.paymentDate).toLocaleDateString('en-IN') : 'Not Set';
            const newDate = updatedFee.paymentDate ? new Date(updatedFee.paymentDate).toLocaleDateString('en-IN') : 'Not Set';
            changes.push(`📆 <b>Payment Date:</b> ${oldDate} → ${newDate}`);
        }
        
        if (changes.length > 0) {
            message += `📝 <b>Changes:</b>\n${changes.join('\n')}\n`;
        } else {
            message += `<i>Minor updates made</i>\n`;
        }
        
        message += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    formatPaymentDeletedMessage(fee) {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = this.escapeHtml(settings.libraryName) || 'Library Management System';
        
        const members = JSON.parse(localStorage.getItem('libraryMembers')) || [];
        const member = members.find(m => m.id === fee.memberId);
        
        let message = `🗑️ <b>Payment Record Deleted</b>\n\n`;
        message += `📚 <b>${libraryName}</b>\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        message += `👤 <b>Member:</b> ${this.escapeHtml(fee.memberName)}\n`;
        
        if (member) {
            message += `📱 <b>Phone:</b> ${this.escapeHtml(member.contact)}\n`;
            if (member.seat && member.seat > 0) {
                message += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
            }
        }
        
        message += `\n💵 <b>Amount:</b> ₹${this.escapeHtml(fee.amount)}\n`;
        message += `📅 <b>Month:</b> ${this.escapeHtml(fee.month)}\n`;
        message += `📊 <b>Status:</b> ${fee.status === 'paid' ? '✅ Paid' : '⏳ Pending'}\n`;
        
        message += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        
        return message;
    }

    async notifyMemberAdded(member) {
        const message = this.formatMemberAddedMessage(member);
        return await this.sendMessage(message);
    }

    async notifyMemberUpdated(oldMember, updatedMember) {
        const message = this.formatMemberUpdatedMessage(oldMember, updatedMember);
        return await this.sendMessage(message);
    }

    async notifyMemberDeleted(member) {
        const message = this.formatMemberDeletedMessage(member);
        return await this.sendMessage(message);
    }

    async notifyPaymentAdded(fee) {
        const message = this.formatPaymentAddedMessage(fee);
        return await this.sendMessage(message);
    }

    async notifyPaymentUpdated(oldFee, updatedFee) {
        const message = this.formatPaymentUpdatedMessage(oldFee, updatedFee);
        return await this.sendMessage(message);
    }

    async notifyPaymentDeleted(fee) {
        const message = this.formatPaymentDeletedMessage(fee);
        return await this.sendMessage(message);
    }

    getBotToken() {
        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        return settings.telegramBotToken || '';
    }

    async sendMessageToChat(chatId, message) {
        const botToken = this.getBotToken();
        if (!botToken || !chatId || chatId.trim() === '') {
            console.log('Bot token or member chat ID not available. Skipping member notification.');
            return { success: false, error: 'Not configured' };
        }

        const url = `${this.apiUrl}${botToken}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('Member Telegram notification sent successfully');
                return { success: true };
            } else {
                console.error('Telegram API error (member):', data.description);
                return { success: false, error: data.description };
            }
        } catch (error) {
            console.error('Failed to send member Telegram notification:', error);
            return { success: false, error: error.message };
        }
    }

    async sendDocumentToChat(chatId, file, caption = '') {
        const botToken = this.getBotToken();
        if (!botToken || !chatId || chatId.trim() === '') {
            console.log('Bot token or member chat ID not available. Skipping document send.');
            return { success: false, error: 'Not configured' };
        }

        const url = `${this.apiUrl}${botToken}/sendDocument`;

        try {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', file);
            if (caption) {
                formData.append('caption', caption);
                formData.append('parse_mode', 'HTML');
            }

            const response = await fetch(url, { method: 'POST', body: formData });
            const data = await response.json();

            if (data.ok) {
                console.log('Member document sent successfully');
                return { success: true };
            } else {
                console.error('Telegram API error (document):', data.description);
                return { success: false, error: data.description };
            }
        } catch (error) {
            console.error('Failed to send document to member:', error);
            return { success: false, error: error.message };
        }
    }

    generateReceiptPDFBlob(member, fee) {
        try {
            if (!window.jspdf) {
                console.warn('jsPDF not loaded, skipping PDF generation');
                return null;
            }
            const { jsPDF } = window.jspdf;
            const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
            const libraryName = (settings.libraryName || 'Library Management System').toUpperCase();

            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const W = doc.internal.pageSize.getWidth();
            const H = doc.internal.pageSize.getHeight();

            const GOLD = [244, 196, 48];
            const DARK = [26, 26, 26];
            const WHITE = [255, 255, 255];
            const LIGHT_GRAY = [248, 248, 248];
            const MID_GRAY = [224, 224, 224];
            const TEXT_GRAY = [100, 100, 100];
            const GREEN = [46, 125, 50];
            const GREEN_LIGHT = [232, 245, 233];
            const GOLD_DARK = [180, 140, 20];

            const margin = 12;
            const innerW = W - margin * 2;

            doc.setFillColor(...DARK);
            doc.rect(0, 0, W, H, 'F');
            doc.setFillColor(...WHITE);
            doc.rect(margin - 3, margin - 3, innerW + 6, H - margin * 2 + 6, 'F');

            doc.setFillColor(...GOLD);
            doc.rect(margin - 3, margin - 3, innerW + 6, 52, 'F');

            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...DARK);
            doc.text(libraryName, W / 2, margin + 16, { align: 'center' });

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 50, 0);
            doc.text('PAYMENT RECEIPT', W / 2, margin + 26, { align: 'center' });

            const receiptNum = `RCP-${String(fee.id || Date.now()).slice(-8).toUpperCase()}`;
            const genDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            doc.setFontSize(8.5);
            doc.setTextColor(60, 50, 0);
            doc.text(`Receipt No: ${receiptNum}`, margin + 2, margin + 38);
            doc.text(`Date: ${genDate}`, W - margin - 3, margin + 38, { align: 'right' });

            doc.setFillColor(...DARK);
            doc.rect(margin - 3, margin + 48, innerW + 6, 3, 'F');

            let y = margin + 62;

            const drawSectionHeader = (label, yPos) => {
                doc.setFillColor(...DARK);
                doc.rect(margin - 3, yPos - 1, innerW + 6, 9, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(...GOLD);
                doc.text(label, margin + 2, yPos + 5.5);
            };

            drawSectionHeader('MEMBER INFORMATION', y);
            y += 12;

            const midX = margin - 3 + (innerW + 6) / 2;

            const rows1 = [
                ['Member Name', member.name || 'N/A'],
                ['Contact', member.contact || 'N/A'],
                ['Seat Number', member.seat ? `Seat ${member.seat}` : 'Not Assigned'],
                ['Member ID', `#${String(member.id || '').slice(-8).toUpperCase()}`]
            ];

            rows1.forEach((row, i) => {
                const bg = i % 2 === 0 ? LIGHT_GRAY : WHITE;
                doc.setFillColor(...bg);
                doc.rect(margin - 3, y - 5.5, innerW + 6, 9, 'F');
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(...TEXT_GRAY);
                doc.text(row[0], margin + 2, y);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...DARK);
                doc.text(String(row[1]), midX + 2, y);
                y += 9;
            });

            y += 6;

            drawSectionHeader('PAYMENT INFORMATION', y);
            y += 12;

            const payDate = fee.paymentDate
                ? new Date(fee.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

            const rows2 = [
                ['Payment Month', fee.month || 'N/A'],
                ['Payment Date', payDate],
                ['Payment Method', fee.paymentMethod || 'N/A'],
                ['Notes', fee.notes || '-']
            ];

            rows2.forEach((row, i) => {
                const bg = i % 2 === 0 ? LIGHT_GRAY : WHITE;
                doc.setFillColor(...bg);
                doc.rect(margin - 3, y - 5.5, innerW + 6, 9, 'F');
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(...TEXT_GRAY);
                doc.text(row[0], margin + 2, y);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...DARK);
                doc.text(String(row[1]), midX + 2, y);
                y += 9;
            });

            y += 4;
            doc.setFillColor(...GOLD);
            doc.rect(margin - 3, y, innerW + 6, 14, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...DARK);
            doc.text('TOTAL AMOUNT', margin + 4, y + 9.5);
            doc.setFontSize(15);
            doc.text(`Rs. ${Number(fee.amount || 0).toLocaleString('en-IN')}`, W - margin - 3, y + 9.5, { align: 'right' });

            y += 22;

            const stampCenterX = W / 2;
            doc.setFillColor(...GREEN_LIGHT);
            doc.circle(stampCenterX, y + 12, 20, 'F');
            doc.setDrawColor(...GREEN);
            doc.setLineWidth(1.2);
            doc.circle(stampCenterX, y + 12, 20, 'S');
            doc.setLineWidth(0.5);
            doc.circle(stampCenterX, y + 12, 18, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(...GREEN);
            doc.text('PAID', stampCenterX, y + 10, { align: 'center' });
            doc.setFontSize(8.5);
            doc.text('CLEARED', stampCenterX, y + 18, { align: 'center' });

            y += 42;

            doc.setDrawColor(...MID_GRAY);
            doc.setLineWidth(0.4);
            doc.line(margin - 3, y, W - margin + 3, y);

            y += 8;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(...DARK);
            doc.text('Thank you for your timely payment!', W / 2, y, { align: 'center' });

            y += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...TEXT_GRAY);
            doc.text('This is a computer-generated receipt. No signature required.', W / 2, y, { align: 'center' });

            y += 5;
            doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, W / 2, y, { align: 'center' });

            doc.setDrawColor(...GOLD_DARK);
            doc.setLineWidth(1.0);
            doc.rect(margin - 3, margin - 3, innerW + 6, H - margin * 2 + 6);

            return doc.output('blob');
        } catch (err) {
            console.error('Error generating receipt PDF:', err);
            return null;
        }
    }

    formatPaymentCompleteForMember(member, fee, libraryName, hasPdf = false) {
        const lib = this.escapeHtml(libraryName || 'Library Management System');
        let msg = `✅ <b>Payment Confirmed!</b>\n\n`;
        msg += `📚 <b>${lib}</b>\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `नमस्ते <b>${this.escapeHtml(member.name)}</b> जी,\n\n`;
        msg += `आपका payment सफलतापूर्वक दर्ज हो गया है। 🎉\n\n`;
        msg += `📅 <b>Month:</b> ${this.escapeHtml(fee.month)}\n`;
        msg += `💵 <b>Amount:</b> ₹${this.escapeHtml(fee.amount)}\n`;
        const payDate = fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
        msg += `📆 <b>Payment Date:</b> ${payDate}\n`;
        msg += `💳 <b>Method:</b> ${this.escapeHtml(fee.paymentMethod || 'N/A')}\n`;
        if (member.seat && member.seat > 0) {
            msg += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
        }
        if (hasPdf) {
            msg += `\n📄 <b>Receipt PDF</b> नीचे attached है।\n`;
        }
        msg += `\nधन्यवाद! 🙏\n`;
        msg += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        return msg;
    }

    formatPendingReminderForMember(member, fee, libraryName) {
        const lib = this.escapeHtml(libraryName || 'Library Management System');
        let msg = `⏰ <b>Payment Reminder</b>\n\n`;
        msg += `📚 <b>${lib}</b>\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `नमस्ते <b>${this.escapeHtml(member.name)}</b> जी,\n\n`;
        msg += `आपकी library membership की <b>payment pending</b> है।\n\n`;
        msg += `📅 <b>Month:</b> ${this.escapeHtml(fee.month)}\n`;
        msg += `💵 <b>Amount:</b> ₹${this.escapeHtml(fee.amount)}\n`;
        msg += `📊 <b>Status:</b> ⏳ Pending\n`;
        if (member.seat && member.seat > 0) {
            msg += `🪑 <b>Seat:</b> ${this.escapeHtml(member.seat)}\n`;
        }
        msg += `\nकृपया जल्द से जल्द payment कर दें।\n`;
        msg += `धन्यवाद! 🙏\n`;
        msg += `\n⏰ <i>${new Date().toLocaleString('en-IN')}</i>`;
        return msg;
    }

    async notifyMemberPaymentComplete(member, fee) {
        if (!member || !member.telegramChatId || member.telegramChatId.trim() === '') {
            console.log('Member has no Telegram Chat ID. Skipping member notification.');
            return { success: false, error: 'No member chat ID' };
        }

        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = settings.libraryName || 'Library Management System';

        const pdfBlob = this.generateReceiptPDFBlob(member, fee);
        const hasPdf = !!pdfBlob;

        const message = this.formatPaymentCompleteForMember(member, fee, libraryName, hasPdf);
        await this.sendMessageToChat(member.telegramChatId, message);

        if (hasPdf) {
            const safeName = (member.name || 'Member').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            const safeMonth = (fee.month || '').replace(/[^a-zA-Z0-9\-]/g, '');
            const fileName = `Receipt_${safeName}_${safeMonth}.pdf`;
            const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
            await this.sendDocumentToChat(member.telegramChatId, pdfFile, `📄 Payment Receipt - ${fee.month}`);
        }

        return { success: true };
    }

    async notifyMemberPendingReminder(member, fee) {
        if (!member || !member.telegramChatId || member.telegramChatId.trim() === '') {
            return { success: false, error: 'No member chat ID' };
        }

        const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
        const libraryName = settings.libraryName || 'Library Management System';

        const message = this.formatPendingReminderForMember(member, fee, libraryName);
        return await this.sendMessageToChat(member.telegramChatId, message);
    }

    async sendAllPendingReminders() {
        const fees = JSON.parse(localStorage.getItem('libraryFees')) || [];
        const members = JSON.parse(localStorage.getItem('libraryMembers')) || [];

        const pendingFees = fees.filter(f => f.status === 'pending');

        if (pendingFees.length === 0) {
            return { sent: 0, skipped: 0, total: 0 };
        }

        let sent = 0, skipped = 0;

        for (const fee of pendingFees) {
            const member = members.find(m => m.id === fee.memberId);
            if (!member || !member.telegramChatId || member.telegramChatId.trim() === '') {
                skipped++;
                continue;
            }
            if (member.status === 'inactive') {
                skipped++;
                continue;
            }
            const result = await this.notifyMemberPendingReminder(member, fee);
            if (result.success) {
                sent++;
            } else {
                skipped++;
            }
            await new Promise(r => setTimeout(r, 300));
        }

        return { sent, skipped, total: pendingFees.length };
    }
}

const telegramNotifier = new TelegramNotifier();
