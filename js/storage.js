class StorageManager {
    constructor() {
        this.initializeDefaultUser();
        this.initializeSettings();
        this.initializeSeats();
    }
    
    initializeDefaultUser() {
        if (!localStorage.getItem('libraryUser')) {
            const defaultUser = {
                username: 'admin',
                password: 'admin123',
                name: 'Administrator'
            };
            localStorage.setItem('libraryUser', JSON.stringify(defaultUser));
        }
    }
    
    initializeSettings() {
        if (!localStorage.getItem('librarySettings')) {
            const defaultSettings = {
                libraryName: 'My Library',
                totalSeats: 50,
                defaultFine: 5,
                bookReturnDays: 14
            };
            localStorage.setItem('librarySettings', JSON.stringify(defaultSettings));
        }
    }
    
    getUser() {
        return JSON.parse(localStorage.getItem('libraryUser'));
    }
    
    getSettings() {
        return JSON.parse(localStorage.getItem('librarySettings')) || {
            libraryName: 'My Library',
            totalSeats: 50,
            defaultFine: 5,
            bookReturnDays: 14
        };
    }
    
    saveSettings(settings) {
        localStorage.setItem('librarySettings', JSON.stringify(settings));
    }
    
    getPreferences() {
        const defaultPreferences = {
            theme: 'dark',
            autoBackup: false,
            backupInterval: 'weekly',
            lastBackupTime: null,
            nextBackupTime: null,
            customBackupTime: null,
            sendBackupToTelegram: false,
            lastCheckTime: null
        };
        return JSON.parse(localStorage.getItem('libraryPreferences')) || defaultPreferences;
    }
    
    savePreferences(preferences) {
        localStorage.setItem('libraryPreferences', JSON.stringify(preferences));
    }
    
    setTheme(theme) {
        const preferences = this.getPreferences();
        preferences.theme = theme;
        this.savePreferences(preferences);
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    getTheme() {
        const preferences = this.getPreferences();
        return preferences.theme || 'dark';
    }
    
    applyTheme() {
        const theme = this.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    async performAutoBackup(isMissedBackup = false) {
        const data = {
            members: this.getMembers(),
            books: this.getBooks(),
            issuedBooks: this.getIssuedBooks(),
            fees: this.getFees(),
            expenses: this.getExpenses(),
            activities: this.getActivities(),
            seats: this.getSeats(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            backupType: isMissedBackup ? 'auto-missed' : 'auto'
        };
        
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = `library-auto-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        const preferences = this.getPreferences();
        preferences.lastBackupTime = new Date().toISOString();
        
        if (preferences.backupInterval === 'custom') {
            preferences.nextBackupTime = null;
            preferences.customBackupTime = null;
        } else {
            preferences.nextBackupTime = this.calculateNextBackupTime(preferences.backupInterval);
        }
        
        this.savePreferences(preferences);
        
        const activityMsg = isMissedBackup ? 
            'Missed auto backup performed successfully (browser was closed during scheduled time)' : 
            'Auto backup performed successfully';
        this.addActivity(activityMsg, 'system');
        
        if (preferences.sendBackupToTelegram && typeof telegramNotifier !== 'undefined' && telegramNotifier.isConfigured()) {
            const file = new File([blob], filename, { type: 'application/json' });
            const settings = this.getSettings();
            const escapeHtml = (text) => {
                if (text === null || text === undefined) return '';
                return String(text)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };
            const backupTypeText = isMissedBackup ? 
                '⚠️ <b>Missed Backup (Recovered)</b>' : 
                '📦 <b>Auto Backup</b>';
            const caption = `${backupTypeText}\n\n` +
                           `📚 <b>${escapeHtml(settings.libraryName || 'My Library')}</b>\n` +
                           `📅 <b>Date:</b> ${new Date().toLocaleDateString('en-IN')}\n` +
                           `⏰ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN')}\n` +
                           (isMissedBackup ? `\n🔄 <i>This backup was missed when browser was closed. Sent automatically when you opened the app.</i>\n` : '') +
                           `\n📊 <b>Statistics:</b>\n` +
                           `👥 Members: ${data.members.length}\n` +
                           `📚 Books: ${data.books.length}\n` +
                           `💰 Fee Records: ${data.fees.length}\n` +
                           `💸 Expenses: ${data.expenses.length}`;
            
            try {
                const result = await telegramNotifier.sendDocument(file, caption);
                if (result.success) {
                    const successMsg = isMissedBackup ? 
                        '🔄 Missed backup recovered and sent to Telegram!' : 
                        'Auto backup completed and sent to Telegram!';
                    this.showBackupNotification(successMsg);
                } else {
                    const failMsg = isMissedBackup ?
                        '🔄 Missed backup completed! (Failed to send to Telegram)' :
                        'Auto backup completed! (Failed to send to Telegram)';
                    this.showBackupNotification(failMsg);
                }
            } catch (error) {
                console.error('Error sending backup to Telegram:', error);
                const errorMsg = isMissedBackup ?
                    '🔄 Missed backup completed! (Failed to send to Telegram)' :
                    'Auto backup completed! (Failed to send to Telegram)';
                this.showBackupNotification(errorMsg);
            }
        } else {
            const msg = isMissedBackup ?
                '🔄 Missed backup completed successfully!' :
                'Auto backup completed successfully!';
            this.showBackupNotification(msg);
        }
        
        return true;
    }
    
    showBackupNotification(message) {
        if (typeof window !== 'undefined') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInUp 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutDown 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
    
    calculateNextBackupTime(interval) {
        const now = new Date();
        let next = new Date(now);
        
        switch(interval) {
            case 'daily':
                next.setDate(next.getDate() + 1);
                break;
            case 'weekly':
                next.setDate(next.getDate() + 7);
                break;
            case 'monthly':
                next.setMonth(next.getMonth() + 1);
                break;
            default:
                next.setDate(next.getDate() + 7);
        }
        
        return next.toISOString();
    }
    
    checkAndPerformScheduledBackup() {
        const preferences = this.getPreferences();
        const now = new Date();
        
        preferences.lastCheckTime = now.toISOString();
        this.savePreferences(preferences);
        
        if (!preferences.autoBackup) {
            return false;
        }
        
        if (!preferences.nextBackupTime) {
            return false;
        }
        
        const nextBackup = new Date(preferences.nextBackupTime);
        
        if (now >= nextBackup) {
            this.performAutoBackup();
            return true;
        }
        
        return false;
    }
    
    checkForMissedBackups() {
        const preferences = this.getPreferences();
        
        if (!preferences.autoBackup) {
            return false;
        }
        
        if (!preferences.nextBackupTime) {
            return false;
        }
        
        const now = new Date();
        const nextBackup = new Date(preferences.nextBackupTime);
        
        if (now >= nextBackup) {
            console.log('⚠️ Missed backup detected! Browser was closed during scheduled backup time.');
            console.log('🔄 Recovering missed backup and sending to Telegram...');
            this.performAutoBackup(true);
            return true;
        }
        
        return false;
    }
    
    login(username, password, remember) {
        const user = this.getUser();
        if (user.username === username && user.password === password) {
            sessionStorage.setItem('isLoggedIn', 'true');
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            return true;
        }
        return false;
    }
    
    logout() {
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('rememberMe');
        window.location.href = 'index.html';
    }
    
    isLoggedIn() {
        return sessionStorage.getItem('isLoggedIn') === 'true' || 
               localStorage.getItem('rememberMe') === 'true';
    }
    
    checkAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
        }
    }
    
    getMembers() {
        return JSON.parse(localStorage.getItem('libraryMembers')) || [];
    }
    
    saveMembers(members) {
        localStorage.setItem('libraryMembers', JSON.stringify(members));
    }
    
    addMember(member) {
        const members = this.getMembers();
        member.id = Date.now().toString();
        
        if (member.seat && member.seat > 0) {
            const seatId = `S${member.seat}`;
            const seats = this.getSeats();
            const targetSeat = seats.find(s => s.id === seatId);
            
            if (targetSeat && targetSeat.status === 'occupied' && targetSeat.memberId !== member.id) {
                member.seat = 0;
            }
        }
        
        members.push(member);
        this.saveMembers(members);
        this.addActivity(`New member added: ${member.name}`, 'member');
        
        if (member.seat && member.seat > 0) {
            const seatId = `S${member.seat}`;
            const success = this.assignSeatToMember(seatId, member.id, member.name);
            if (!success) {
                member.seat = 0;
                const index = members.findIndex(m => m.id === member.id);
                if (index !== -1) {
                    members[index].seat = 0;
                    this.saveMembers(members);
                }
            }
        }
        
        if (typeof telegramNotifier !== 'undefined') {
            telegramNotifier.notifyMemberAdded(member);
        }
        
        return member;
    }
    
    updateMember(id, updatedMember) {
        const members = this.getMembers();
        const index = members.findIndex(m => m.id === id);
        if (index !== -1) {
            const oldMember = { ...members[index] };
            const oldSeat = oldMember.seat;
            let newSeat = updatedMember.seat;
            
            if (newSeat && newSeat > 0) {
                const newSeatId = `S${newSeat}`;
                const seats = this.getSeats();
                const targetSeat = seats.find(s => s.id === newSeatId);
                
                if (targetSeat && targetSeat.status === 'occupied' && targetSeat.memberId !== id) {
                    newSeat = oldSeat || 0;
                    updatedMember.seat = newSeat;
                }
            }
            
            if (oldSeat && oldSeat > 0 && oldSeat !== newSeat) {
                this.freeSeatByMemberId(id);
            }
            
            members[index] = { ...members[index], ...updatedMember };
            this.saveMembers(members);
            this.addActivity(`Member updated: ${members[index].name}`, 'member');
            
            if (newSeat && newSeat > 0 && oldSeat !== newSeat) {
                const newSeatId = `S${newSeat}`;
                const success = this.assignSeatToMember(newSeatId, id, members[index].name);
                if (!success) {
                    members[index].seat = 0;
                    this.saveMembers(members);
                }
            }
            
            if (typeof telegramNotifier !== 'undefined') {
                telegramNotifier.notifyMemberUpdated(oldMember, members[index]);
            }
            
            return true;
        }
        return false;
    }
    
    deleteMember(id) {
        const members = this.getMembers();
        const member = members.find(m => m.id === id);
        
        if (!member) {
            return false;
        }
        
        const memberCopy = { ...member };
        
        if (member.seat && member.seat > 0) {
            this.freeSeatByMemberId(id);
        }
        
        const fees = this.getFees();
        const memberFees = fees.filter(f => f.memberId === id);
        const feesCount = memberFees.length;
        const updatedFees = fees.filter(f => f.memberId !== id);
        this.saveFees(updatedFees);
        
        const issuedBooks = this.getIssuedBooks();
        const memberBooks = issuedBooks.filter(ib => ib.memberId === id && !ib.returned);
        
        memberBooks.forEach(issuedBook => {
            const books = this.getBooks();
            const book = books.find(b => b.id === issuedBook.bookId);
            if (book) {
                book.available++;
                this.saveBooks(books);
            }
        });
        
        const booksCount = memberBooks.length;
        const updatedIssuedBooks = issuedBooks.filter(ib => ib.memberId !== id);
        this.saveIssuedBooks(updatedIssuedBooks);
        
        const filtered = members.filter(m => m.id !== id);
        this.saveMembers(filtered);
        
        let activityMsg = `Member deleted: ${member.name}`;
        if (feesCount > 0 || booksCount > 0) {
            const details = [];
            if (feesCount > 0) details.push(`${feesCount} fee record(s)`);
            if (booksCount > 0) details.push(`${booksCount} issued book(s)`);
            activityMsg += ` (Removed: ${details.join(', ')})`;
        }
        this.addActivity(activityMsg, 'member');
        
        if (typeof telegramNotifier !== 'undefined') {
            telegramNotifier.notifyMemberDeleted(memberCopy);
        }
        
        return true;
    }
    
    getBooks() {
        return JSON.parse(localStorage.getItem('libraryBooks')) || [];
    }
    
    saveBooks(books) {
        localStorage.setItem('libraryBooks', JSON.stringify(books));
    }
    
    addBook(book) {
        const books = this.getBooks();
        book.id = Date.now().toString();
        book.available = book.quantity;
        books.push(book);
        this.saveBooks(books);
        this.addActivity(`New book added: ${book.title}`, 'book');
        return book;
    }
    
    updateBook(id, updatedBook) {
        const books = this.getBooks();
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...updatedBook };
            this.saveBooks(books);
            this.addActivity(`Book updated: ${books[index].title}`, 'book');
            return true;
        }
        return false;
    }
    
    deleteBook(id) {
        const books = this.getBooks();
        const book = books.find(b => b.id === id);
        const filtered = books.filter(b => b.id !== id);
        this.saveBooks(filtered);
        if (book) {
            this.addActivity(`Book deleted: ${book.title}`, 'book');
        }
        return true;
    }
    
    getIssuedBooks() {
        return JSON.parse(localStorage.getItem('issuedBooks')) || [];
    }
    
    saveIssuedBooks(issuedBooks) {
        localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
    }
    
    issueBook(bookId, memberId, issueDate, dueDate) {
        const books = this.getBooks();
        const book = books.find(b => b.id === bookId);
        const members = this.getMembers();
        const member = members.find(m => m.id === memberId);
        
        if (book && book.available > 0 && member) {
            book.available--;
            this.saveBooks(books);
            
            const issuedBooks = this.getIssuedBooks();
            const issued = {
                id: Date.now().toString(),
                bookId,
                bookTitle: book.title,
                memberId,
                memberName: member.name,
                issueDate,
                dueDate,
                returned: false,
                fine: 0
            };
            issuedBooks.push(issued);
            this.saveIssuedBooks(issuedBooks);
            this.addActivity(`Book issued: ${book.title} to ${member.name}`, 'book');
            return true;
        }
        return false;
    }
    
    returnBook(issuedId) {
        const issuedBooks = this.getIssuedBooks();
        const issued = issuedBooks.find(ib => ib.id === issuedId);
        
        if (issued) {
            const books = this.getBooks();
            const book = books.find(b => b.id === issued.bookId);
            if (book) {
                book.available++;
                this.saveBooks(books);
            }
            
            issued.returned = true;
            issued.returnDate = new Date().toISOString().split('T')[0];
            this.saveIssuedBooks(issuedBooks);
            this.addActivity(`Book returned: ${issued.bookTitle} by ${issued.memberName}`, 'book');
            return true;
        }
        return false;
    }
    
    calculateFine(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            const settings = this.getSettings();
            return diffDays * settings.defaultFine;
        }
        return 0;
    }
    
    getFees() {
        return JSON.parse(localStorage.getItem('libraryFees')) || [];
    }
    
    saveFees(fees) {
        localStorage.setItem('libraryFees', JSON.stringify(fees));
    }
    
    addFee(fee) {
        const fees = this.getFees();
        fee.id = Date.now().toString();
        fees.push(fee);
        this.saveFees(fees);
        if (fee.status === 'paid') {
            this.addActivity(`Fee payment recorded: ${fee.memberName} - ₹${fee.amount}`, 'fee');
        }
        
        if (typeof telegramNotifier !== 'undefined') {
            telegramNotifier.notifyPaymentAdded(fee);
        }
        
        return fee;
    }
    
    updateFee(id, updatedFee) {
        const fees = this.getFees();
        const index = fees.findIndex(f => f.id === id);
        if (index !== -1) {
            const oldFee = { ...fees[index] };
            const oldStatus = fees[index].status;
            fees[index] = { ...fees[index], ...updatedFee };
            this.saveFees(fees);
            if (oldStatus === 'pending' && updatedFee.status === 'paid') {
                this.addActivity(`Fee payment recorded: ${fees[index].memberName} - ₹${fees[index].amount}`, 'fee');
            }
            
            if (typeof telegramNotifier !== 'undefined') {
                telegramNotifier.notifyPaymentUpdated(oldFee, fees[index]);
            }
            
            return true;
        }
        return false;
    }
    
    generateMonthlyFees(month, year) {
        const members = this.getMembers().filter(m => m.status === 'active');
        const fees = this.getFees();
        const monthYear = `${year}-${String(month).padStart(2, '0')}`;
        
        let generated = 0;
        members.forEach(member => {
            const exists = fees.find(f => 
                f.memberId === member.id && 
                f.month.startsWith(monthYear)
            );
            
            if (!exists) {
                this.addFee({
                    memberId: member.id,
                    memberName: member.name,
                    month: monthYear,
                    amount: member.fee || 0,
                    status: 'pending',
                    paymentDate: null,
                    paymentMethod: null
                });
                generated++;
            }
        });
        
        if (generated > 0) {
            this.addActivity(`Generated ${generated} monthly fee records for ${monthYear}`, 'fee');
        }
        return generated;
    }
    
    autoGenerateMembershipFees() {
        const members = this.getMembers().filter(m => m.status === 'active');
        const today = new Date();
        
        let totalGenerated = 0;
        
        members.forEach(member => {
            if (!member.joiningDate) {
                return;
            }
            
            const joiningDate = new Date(member.joiningDate);
            const joiningDay = joiningDate.getDate();
            const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
            
            let feeDate = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);
            
            while (feeDate <= currentDate) {
                const monthYear = `${feeDate.getFullYear()}-${String(feeDate.getMonth() + 1).padStart(2, '0')}`;
                
                const isCurrentMonth = feeDate.getFullYear() === today.getFullYear() && 
                                      feeDate.getMonth() === today.getMonth();
                
                if (isCurrentMonth) {
                    const lastDayOfMonth = new Date(feeDate.getFullYear(), feeDate.getMonth() + 1, 0).getDate();
                    const effectiveDueDay = Math.min(joiningDay, lastDayOfMonth);
                    
                    if (today.getDate() < effectiveDueDay) {
                        break;
                    }
                }
                
                const fees = this.getFees();
                const exists = fees.find(f => 
                    f.memberId === member.id && 
                    f.month === monthYear
                );
                
                if (!exists) {
                    this.addFee({
                        memberId: member.id,
                        memberName: member.name,
                        month: monthYear,
                        amount: member.fee || 0,
                        status: 'pending',
                        paymentDate: null,
                        paymentMethod: null
                    });
                    totalGenerated++;
                }
                
                feeDate.setMonth(feeDate.getMonth() + 1);
            }
        });
        
        return totalGenerated;
    }
    
    getNextDueDateForMember(memberId) {
        const member = this.getMembers().find(m => m.id === memberId);
        if (!member) {
            return null;
        }
        
        if (member.nextPaymentDate && member.nextPaymentDate.trim() !== '') {
            return member.nextPaymentDate;
        }
        
        if (!member.joiningDate) {
            return null;
        }
        
        const joiningDate = new Date(member.joiningDate);
        const today = new Date();
        const dayOfMonth = joiningDate.getDate();
        
        let nextDue = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);
        
        if (nextDue <= today) {
            nextDue.setMonth(nextDue.getMonth() + 1);
        }
        
        return nextDue.toISOString().split('T')[0];
    }
    
    getExpenses() {
        return JSON.parse(localStorage.getItem('libraryExpenses')) || [];
    }
    
    saveExpenses(expenses) {
        localStorage.setItem('libraryExpenses', JSON.stringify(expenses));
    }
    
    addExpense(expense) {
        const expenses = this.getExpenses();
        expense.id = Date.now().toString();
        expense.addedBy = this.getUser().name;
        expense.timestamp = new Date().toISOString();
        expenses.push(expense);
        this.saveExpenses(expenses);
        this.addActivity(`Expense added: ${expense.category} - ₹${expense.amount}`, 'expense');
        return expense;
    }
    
    updateExpense(id, updatedExpense) {
        const expenses = this.getExpenses();
        const index = expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            expenses[index] = { ...expenses[index], ...updatedExpense };
            this.saveExpenses(expenses);
            this.addActivity(`Expense updated: ${expenses[index].category} - ₹${expenses[index].amount}`, 'expense');
            return true;
        }
        return false;
    }
    
    deleteExpense(id) {
        const expenses = this.getExpenses();
        const expense = expenses.find(e => e.id === id);
        const filtered = expenses.filter(e => e.id !== id);
        this.saveExpenses(filtered);
        if (expense) {
            this.addActivity(`Expense deleted: ${expense.category} - ₹${expense.amount}`, 'expense');
        }
        return true;
    }
    
    getActivities() {
        return JSON.parse(localStorage.getItem('libraryActivities')) || [];
    }
    
    saveActivities(activities) {
        localStorage.setItem('libraryActivities', JSON.stringify(activities));
    }
    
    addActivity(text, type) {
        const activities = this.getActivities();
        const activity = {
            id: Date.now().toString(),
            text,
            type,
            timestamp: new Date().toISOString(),
            user: this.getUser().name
        };
        activities.unshift(activity);
        
        if (activities.length > 500) {
            activities.pop();
        }
        
        this.saveActivities(activities);
    }
    
    clearActivities() {
        localStorage.setItem('libraryActivities', JSON.stringify([]));
    }
    
    initializeSeats() {
        const seats = this.getSeats();
        if (seats.length === 0) {
            const settings = this.getSettings();
            const totalSeats = settings.totalSeats || 50;
            const newSeats = [];
            
            for (let i = 1; i <= totalSeats; i++) {
                newSeats.push({
                    id: `S${i}`,
                    number: i,
                    status: 'available',
                    memberId: null,
                    memberName: null,
                    assignedDate: null
                });
            }
            
            this.saveSeats(newSeats);
            return newSeats;
        }
        return seats;
    }
    
    getSeats() {
        return JSON.parse(localStorage.getItem('librarySeats')) || [];
    }
    
    saveSeats(seats) {
        localStorage.setItem('librarySeats', JSON.stringify(seats));
    }
    
    assignSeat(seatId, memberId) {
        const seats = this.getSeats();
        const members = this.getMembers();
        const seat = seats.find(s => s.id === seatId);
        const member = members.find(m => m.id === memberId);
        
        if (seat && member && seat.status === 'available') {
            seat.status = 'occupied';
            seat.memberId = memberId;
            seat.memberName = member.name;
            seat.assignedDate = new Date().toISOString().split('T')[0];
            
            this.saveSeats(seats);
            this.addActivity(`Seat ${seat.id} assigned to ${member.name}`, 'seat');
            return true;
        }
        return false;
    }
    
    assignSeatToMember(seatId, memberId, memberName) {
        const seats = this.getSeats();
        const seat = seats.find(s => s.id === seatId);
        
        if (seat) {
            if (seat.status === 'occupied' && seat.memberId === memberId) {
                return true;
            }
            
            if (seat.status === 'available' || seat.status === 'reserved') {
                seat.status = 'occupied';
                seat.memberId = memberId;
                seat.memberName = memberName;
                seat.assignedDate = new Date().toISOString().split('T')[0];
                
                this.saveSeats(seats);
                return true;
            }
        }
        return false;
    }
    
    freeSeatByMemberId(memberId) {
        const seats = this.getSeats();
        const seat = seats.find(s => s.memberId === memberId);
        
        if (seat) {
            seat.status = 'available';
            seat.memberId = null;
            seat.memberName = null;
            seat.assignedDate = null;
            
            this.saveSeats(seats);
            return true;
        }
        return false;
    }
    
    freeSeat(seatId) {
        const seats = this.getSeats();
        const seat = seats.find(s => s.id === seatId);
        
        if (seat && seat.status === 'occupied') {
            const memberName = seat.memberName;
            seat.status = 'available';
            seat.memberId = null;
            seat.memberName = null;
            seat.assignedDate = null;
            
            this.saveSeats(seats);
            this.addActivity(`Seat ${seat.id} freed (was: ${memberName})`, 'seat');
            return true;
        }
        return false;
    }
    
    reserveSeat(seatId) {
        const seats = this.getSeats();
        const seat = seats.find(s => s.id === seatId);
        
        if (seat && seat.status === 'available') {
            seat.status = 'reserved';
            this.saveSeats(seats);
            this.addActivity(`Seat ${seat.id} reserved`, 'seat');
            return true;
        }
        return false;
    }
    
    unreserveSeat(seatId) {
        const seats = this.getSeats();
        const seat = seats.find(s => s.id === seatId);
        
        if (seat && seat.status === 'reserved') {
            seat.status = 'available';
            this.saveSeats(seats);
            this.addActivity(`Seat ${seat.id} unreserved`, 'seat');
            return true;
        }
        return false;
    }
    
    getSeatStats() {
        const seats = this.getSeats();
        const total = seats.length;
        const occupied = seats.filter(s => s.status === 'occupied').length;
        const available = seats.filter(s => s.status === 'available').length;
        const reserved = seats.filter(s => s.status === 'reserved').length;
        
        return {
            total,
            occupied,
            available,
            reserved,
            occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(1) : 0
        };
    }
    
    addSeats(count) {
        const seats = this.getSeats();
        const currentTotal = seats.length;
        const newSeats = [];
        
        for (let i = 1; i <= count; i++) {
            const seatNumber = currentTotal + i;
            newSeats.push({
                id: `S${seatNumber}`,
                number: seatNumber,
                status: 'available',
                memberId: null,
                memberName: null,
                assignedDate: null
            });
        }
        
        const updatedSeats = [...seats, ...newSeats];
        this.saveSeats(updatedSeats);
        this.addActivity(`Added ${count} new seat(s). Total seats: ${updatedSeats.length}`, 'seat');
        
        return {
            success: true,
            newTotal: updatedSeats.length,
            added: count
        };
    }
    
    removeSeats(count) {
        const seats = this.getSeats();
        
        let removableCount = 0;
        for (let i = seats.length - 1; i >= 0; i--) {
            if (seats[i].status === 'available') {
                removableCount++;
            } else {
                break;
            }
        }
        
        if (removableCount < count) {
            return {
                success: false,
                message: `Cannot remove ${count} seats. Only ${removableCount} trailing available seats can be removed. ${seats.length - removableCount} seats at the end are occupied or reserved.`
            };
        }
        
        const updatedSeats = seats.slice(0, seats.length - count);
        
        this.saveSeats(updatedSeats);
        this.addActivity(`Removed ${count} seat(s). Total seats: ${updatedSeats.length}`, 'seat');
        
        const members = this.getMembers();
        const updatedMembers = members.map(member => {
            if (member.seat > updatedSeats.length) {
                return { ...member, seat: 0 };
            }
            return member;
        });
        this.saveMembers(updatedMembers);
        
        return {
            success: true,
            newTotal: updatedSeats.length,
            removed: count
        };
    }
    
    setExactSeatCount(targetCount) {
        const seats = this.getSeats();
        const currentTotal = seats.length;
        const difference = targetCount - currentTotal;
        
        if (difference === 0) {
            return {
                success: true,
                newTotal: currentTotal,
                message: 'Seat count already matches target'
            };
        }
        
        if (difference > 0) {
            return this.addSeats(difference);
        } else {
            const seatsToRemove = Math.abs(difference);
            return this.removeSeats(seatsToRemove);
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
    
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    formatCurrency(amount) {
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    }
    
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}