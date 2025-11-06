# 📚 Library Management System

A comprehensive, responsive Library Management System built with pure HTML, CSS, and Vanilla JavaScript. This system provides complete library administration capabilities including member management, book tracking, fee management, expense tracking, and detailed analytics - all in a single-page application with LocalStorage for data persistence.

## ✨ Features

### 🔐 Authentication & Security
- Admin login with session management
- Password change functionality
- Secure session handling with "Remember Me" option

### 👥 Member Management
- Complete CRUD operations for library members
- Seat assignment and tracking
- Multiple membership types support
- Multi-month advance payment handling
- Member photo capture via webcam/camera
- ID proof upload with secure Telegram storage
- Professional 3-page PDF generation for member records
- CSV export for member data
- Inactive member auto-seat release
- Status tracking (Active/Inactive)

### 🪑 Seat Management
- Visual grid layout with color-coded status
- Real-time seat availability tracking
- Bulk seat operations
- Automatic seat synchronization with members
- Reserved/Occupied/Available status indicators

### 📖 Book Management
- Book inventory with stock tracking
- Issue and return functionality
- Overdue tracking with automatic fine calculation
- Stock alerts for low inventory
- Complete book history

### 💰 Fee Management
- Automated monthly fee generation
- Smart due date tracking
- Multi-month advance payment support
- Payment history tracking
- Status tracking (Paid/Pending)
- Payment receipts with PDF generation
- WhatsApp sharing integration
- CSV export capabilities

### 💵 Expense Management
- Expense recording with categorization
- Monthly/yearly expense tracking
- Category-wise analysis
- CSV export for accounting

### 📊 Dashboard & Analytics
- Real-time statistics and summaries
- Member count and seat occupancy metrics
- Revenue, expense, and profit tracking
- Recent activity feed
- Quick action buttons

### 📈 Reports & Charts
- Revenue vs Expense trend analysis (6 months)
- Category-wise expense distribution
- Book status visualization
- Payment collection rate charts
- Monthly revenue comparison (12 months)
- Month-over-month comparison
- Export reports to CSV

### 📱 Payment Receipts
- Complete payment history display
- PDF receipt generation
- WhatsApp sharing functionality
- Date range filtering
- Print capabilities
- Modern UI with timeline view

### 📝 Activity Log
- Comprehensive activity tracking
- Timestamp and user attribution
- Filter by type (Member/Book/Fee/System)
- Search functionality

### ⚙️ Settings & Configuration
- Library settings customization
- Dynamic seat management
- Fine amount configuration
- Telegram bot integration
- Data backup and restore
- Complete data export/import (JSON)
- Auto backup system with scheduling

### 📲 Telegram Integration
- Real-time notifications for member operations
- Payment notifications
- Secure photo and ID proof storage
- Test notification feature
- Auto backup to Telegram

### 🔄 Auto Backup System
- Multiple scheduling options (Daily/Weekly/Monthly/Custom)
- JSON export with complete data
- Telegram backup delivery
- Backup monitoring and status display

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with custom themes
- **Vanilla JavaScript (ES6+)** - Core business logic
- **Chart.js** - Data visualization
- **jsPDF** - Client-side PDF generation
- **html2canvas** - HTML to canvas conversion
- **LocalStorage API** - Client-side data persistence
- **MediaDevices API** - Camera access for photos
- **Telegram Bot API** - Notifications and secure storage

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)
- Internet connection (for Chart.js CDN and Telegram features)

### Installation

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd library-management-system
   ```

2. **Start the development server**
   ```bash
   python3 server.py
   ```

3. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

4. **Default Login Credentials**
   - **Username:** `admin`
   - **Password:** `admin123`
   
   ⚠️ **Important:** Change the default password after first login!

## 📖 Usage Guide

### Initial Setup

1. **Login** with default credentials
2. **Change Password** in Settings
3. **Configure Library Settings**
   - Set library name
   - Configure total seats
   - Set fine amounts
4. **Setup Telegram** (Optional but recommended)
   - Create a Telegram bot via @BotFather
   - Get your Chat ID
   - Configure in Settings

### Managing Members

1. Navigate to **Members** page
2. Click **Add Member**
3. Fill in member details
4. (Optional) Capture photo and upload ID proof
5. Select seat or choose "No Seat"
6. Set advance payment months if needed
7. Preview and confirm
8. PDF automatically generates and downloads

### Managing Books

1. Navigate to **Books** page
2. Click **Add Book**
3. Enter book details (title, author, ISBN, quantity)
4. Issue books to members
5. Track returns and calculate fines

### Managing Fees

1. Navigate to **Fees** page
2. View pending and paid fees
3. Click **Mark Paid** for pending payments
4. Filter by month or status
5. Export to CSV for records

### Viewing Reports

1. Navigate to **Reports** page
2. View interactive charts and analytics
3. Compare month-over-month performance
4. Export reports to CSV

### Data Backup

**Manual Backup:**
1. Go to **Settings**
2. Click **Export All Data**
3. Save the JSON file securely

**Auto Backup:**
1. Go to **Settings**
2. Enable **Auto Backup**
3. Select interval (Daily/Weekly/Monthly/Custom)
4. Optionally enable Telegram backup delivery

## 📁 Project Structure

```
library-management-system/
├── index.html              # Login page
├── dashboard.html          # Dashboard
├── members.html            # Member management
├── seats.html             # Seat management
├── books.html             # Book management
├── fees.html              # Fee management
├── expenses.html          # Expense tracking
├── receipts.html          # Payment receipts
├── reports.html           # Analytics & reports
├── activity.html          # Activity log
├── settings.html          # Settings & configuration
├── server.py              # Development server
├── replit.md             # Project documentation
├── css/
│   ├── style.css         # Global styles
│   ├── dashboard.css     # Dashboard styles
│   ├── members.css       # Member page styles
│   ├── seats.css         # Seat grid styles
│   ├── books.css         # Book page styles
│   ├── fees.css          # Fee page styles
│   ├── expenses.css      # Expense page styles
│   ├── receipts.css      # Receipts page styles
│   ├── reports.css       # Reports page styles
│   ├── activity.css      # Activity log styles
│   ├── settings.css      # Settings page styles
│   └── login.css         # Login page styles
└── js/
    ├── main.js           # Main application logic
    ├── storage.js        # Data management & storage
    ├── telegram.js       # Telegram integration
    ├── dashboard.js      # Dashboard functionality
    ├── members.js        # Member management logic
    ├── seats.js          # Seat management logic
    ├── books.js          # Book management logic
    ├── fees.js           # Fee management logic
    ├── expenses.js       # Expense tracking logic
    ├── receipts.js       # Receipt generation logic
    ├── reports.js        # Analytics & charts
    └── activity.js       # Activity logging
```

## 🎨 Theme

The system features a modern **golden-yellow theme** with:
- Professional dark mode interface
- Smooth animations and transitions
- Responsive design for all screen sizes
- Mobile-friendly hamburger navigation
- Glassmorphism effects
- Interactive hover states

## 🔒 Data Privacy & Security

- All data stored locally in browser's LocalStorage
- No backend server required
- Sensitive photos stored securely on Telegram (not in LocalStorage)
- ID proofs stored on Telegram with message references only
- Complete data export/import capability
- Session-based authentication

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones (Android & iOS)
- All modern browsers

## 🌟 Key Highlights

- ✅ No backend required - Pure client-side application
- ✅ Offline capable with LocalStorage
- ✅ Professional PDF generation
- ✅ Real-time Telegram notifications
- ✅ Multi-month advance payment support
- ✅ Automatic fee generation
- ✅ Interactive charts and analytics
- ✅ Complete data backup/restore
- ✅ Camera integration for photos
- ✅ WhatsApp sharing integration
- ✅ Modern, professional UI/UX

## 🐛 Known Issues & Solutions

### Reports not showing current month data
**Solution:** Fixed in latest version. The timezone bug has been resolved to ensure proper month matching.

### Camera not working
**Solution:** Ensure browser has camera permissions enabled. Use file upload as an alternative.

## 🔮 Future Enhancements

- Multi-user support with role-based access
- Email notifications
- SMS integration
- Advanced reporting with date range selection
- Book reservation system
- Fine payment tracking
- Member card printing
- Barcode/QR code integration

## 📄 License

This project is open-source and available for educational and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Developer

Built with ❤️ for efficient library management

## 📞 Support

For support and queries, please refer to the documentation in `replit.md` or contact the system administrator.

---

**Happy Library Managing! 📚✨**
