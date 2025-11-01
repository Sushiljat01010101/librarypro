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
        members.push(member);
        this.saveMembers(members);
        this.addActivity(`New member added: ${member.name}`, 'member');
        return member;
    }
    
    updateMember(id, updatedMember) {
        const members = this.getMembers();
        const index = members.findIndex(m => m.id === id);
        if (index !== -1) {
            members[index] = { ...members[index], ...updatedMember };
            this.saveMembers(members);
            this.addActivity(`Member updated: ${members[index].name}`, 'member');
            return true;
        }
        return false;
    }
    
    deleteMember(id) {
        const members = this.getMembers();
        const member = members.find(m => m.id === id);
        const filtered = members.filter(m => m.id !== id);
        this.saveMembers(filtered);
        if (member) {
            this.addActivity(`Member deleted: ${member.name}`, 'member');
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
        return fee;
    }
    
    updateFee(id, updatedFee) {
        const fees = this.getFees();
        const index = fees.findIndex(f => f.id === id);
        if (index !== -1) {
            const oldStatus = fees[index].status;
            fees[index] = { ...fees[index], ...updatedFee };
            this.saveFees(fees);
            if (oldStatus === 'pending' && updatedFee.status === 'paid') {
                this.addActivity(`Fee payment recorded: ${fees[index].memberName} - ₹${fees[index].amount}`, 'fee');
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