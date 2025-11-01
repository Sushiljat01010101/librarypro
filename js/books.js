storageManager.checkAuth();

let currentEditId = null;

function loadBooks() {
    const books = storageManager.getBooks();
    const issuedBooks = storageManager.getIssuedBooks();
    const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = books.filter(book => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.isbn.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
        
        let matchesStatus = true;
        if (statusFilter === 'available') {
            matchesStatus = book.available > 0;
        } else if (statusFilter === 'issued') {
            matchesStatus = book.available < book.quantity;
        } else if (statusFilter === 'overdue') {
            const overdueIssues = issuedBooks.filter(ib => 
                !ib.returned && 
                ib.bookId === book.id && 
                ib.dueDate < new Date().toISOString().split('T')[0]
            );
            matchesStatus = overdueIssues.length > 0;
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    const tbody = document.querySelector('#booksTable tbody');
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No books found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(book => {
        const status = book.available > 0 ? 
            `<span class="status-available">Available</span>` : 
            `<span class="status-issued">All Issued</span>`;
        
        return `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td>${book.category}</td>
                <td>${book.quantity}</td>
                <td>${book.available}</td>
                <td>${status}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-sm btn-edit" onclick="editBook('${book.id}')">Edit</button>
                        <button class="btn-sm btn-delete" onclick="deleteBook('${book.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    loadIssuedBooks();
}

function loadIssuedBooks() {
    const issuedBooks = storageManager.getIssuedBooks().filter(ib => !ib.returned);
    const tbody = document.querySelector('#issuedBooksTable tbody');
    
    if (issuedBooks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No books issued yet.</td></tr>';
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    tbody.innerHTML = issuedBooks.map(ib => {
        const isOverdue = ib.dueDate < today;
        const fine = isOverdue ? storageManager.calculateFine(ib.dueDate) : 0;
        const status = isOverdue ? 
            `<span class="status-overdue">Overdue</span>` : 
            `<span class="status-issued">Issued</span>`;
        
        return `
            <tr>
                <td>${ib.bookTitle}</td>
                <td>${ib.memberName}</td>
                <td>${storageManager.formatDate(ib.issueDate)}</td>
                <td>${storageManager.formatDate(ib.dueDate)}</td>
                <td>${status}</td>
                <td class="fine-amount">${fine > 0 ? storageManager.formatCurrency(fine) : '-'}</td>
                <td>
                    <button class="btn-sm btn-success" onclick="returnBook('${ib.id}')">Return</button>
                </td>
            </tr>
        `;
    }).join('');
}

document.getElementById('addBookBtn').addEventListener('click', () => {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add Book';
    document.getElementById('bookForm').reset();
    showModal('bookModal');
});

document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookISBN').value,
        category: document.getElementById('bookCategory').value,
        publisher: document.getElementById('bookPublisher').value,
        quantity: parseInt(document.getElementById('bookQuantity').value)
    };
    
    if (currentEditId) {
        const books = storageManager.getBooks();
        const oldBook = books.find(b => b.id === currentEditId);
        book.available = oldBook.available + (book.quantity - oldBook.quantity);
        storageManager.updateBook(currentEditId, book);
    } else {
        storageManager.addBook(book);
    }
    
    hideModal('bookModal');
    loadBooks();
});

function editBook(id) {
    const books = storageManager.getBooks();
    const book = books.find(b => b.id === id);
    
    if (book) {
        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Edit Book';
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookISBN').value = book.isbn;
        document.getElementById('bookCategory').value = book.category;
        document.getElementById('bookPublisher').value = book.publisher || '';
        document.getElementById('bookQuantity').value = book.quantity;
        showModal('bookModal');
    }
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        storageManager.deleteBook(id);
        loadBooks();
    }
}

function returnBook(id) {
    if (confirm('Confirm book return?')) {
        storageManager.returnBook(id);
        loadBooks();
    }
}

document.getElementById('issueBookBtn').addEventListener('click', () => {
    loadIssueForm();
    showModal('issueModal');
});

function loadIssueForm() {
    const books = storageManager.getBooks().filter(b => b.available > 0);
    const members = storageManager.getMembers().filter(m => m.status === 'active');
    const settings = storageManager.getSettings();
    
    const bookSelect = document.getElementById('issueBook');
    bookSelect.innerHTML = '<option value="">-- Select Book --</option>' + 
        books.map(b => `<option value="${b.id}">${b.title} by ${b.author} (${b.available} available)</option>`).join('');
    
    const memberSelect = document.getElementById('issueMember');
    memberSelect.innerHTML = '<option value="">-- Select Member --</option>' + 
        members.map(m => `<option value="${m.id}">${m.name} (Seat ${m.seat})</option>`).join('');
    
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + settings.bookReturnDays);
    
    document.getElementById('issueDate').valueAsDate = today;
    document.getElementById('dueDate').valueAsDate = dueDate;
}

document.getElementById('issueForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookId = document.getElementById('issueBook').value;
    const memberId = document.getElementById('issueMember').value;
    const issueDate = document.getElementById('issueDate').value;
    const dueDate = document.getElementById('dueDate').value;
    
    if (storageManager.issueBook(bookId, memberId, issueDate, dueDate)) {
        hideModal('issueModal');
        loadBooks();
        alert('Book issued successfully!');
    } else {
        alert('Failed to issue book. Please check availability.');
    }
});

document.getElementById('searchBooks').addEventListener('input', loadBooks);
document.getElementById('categoryFilter').addEventListener('change', loadBooks);
document.getElementById('statusFilter').addEventListener('change', loadBooks);

loadBooks();