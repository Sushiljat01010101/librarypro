# Library Management System

## Overview
A comprehensive, responsive Library Management System built with pure HTML, CSS, and Vanilla JavaScript. Features a modern golden-yellow theme with LocalStorage for data persistence.

## Project Purpose
Manage library operations including member management, book tracking, fee collection, expense management, and comprehensive analytics - all in a single-page application with no backend dependencies.

## Current State
✅ Fully functional and deployed
- All core features implemented
- Responsive design for all screen sizes
- LocalStorage-based data persistence
- Professional golden-yellow theme
- Chart.js integration for analytics

## Recent Changes (November 2, 2025)
- **ENHANCED**: Settings page fully working with all features functional
- **NEW**: Dynamic library name system
  - Library name now displays across all pages (sidebar, login, page titles)
  - Updates automatically when changed in settings
  - Secure implementation preventing XSS attacks
  - Input validation (non-empty, max 100 characters)
  - Graceful fallback to "My Library" for empty values
- **NEW**: Dynamic Seat Management in Settings
  - Add seats individually or in bulk
  - Remove trailing available seats safely
  - Set exact seat count with smart validation
  - Real-time seat statistics display
  - Prevents data corruption by protecting occupied seats
  - Automatic sync with total seats setting
  - Activity logging for all operations
- **FIXED**: Backup export/import now includes seats data
- **FIXED**: Clear all data properly removes seats data

## Previous Changes (November 1, 2025)
- Initial project setup and complete implementation
- Created all 10 HTML pages with navigation
- Implemented golden-yellow theme with dark mode aesthetics
- Built complete JavaScript functionality for all features
- Added Chart.js visualizations for reports
- Configured Python HTTP server on port 5000
- Enabled cache control for proper frontend updates
- **NEW**: Added Seat Management System with color-coded status (available/occupied/reserved)
- Fixed modal functionality by adding main.js to all pages
- **ENHANCED**: Improved member seat selection with visual seat picker
  - Added "Select Seat" button to navigate to seat selection page
  - Implemented "No Seat" option for members without assigned seats
  - Added selection mode with visual alert banner on seats page
  - Form data preservation during seat selection navigation
  - Click available seats to select and auto-return to member form
  - Cancel button to return without selection while preserving form data
- **SYNCHRONIZED**: Member-Seat automatic synchronization
  - When member is added with seat, seat automatically becomes occupied on seats page
  - When member's seat is changed, old seat becomes available and new seat becomes occupied
  - When member is deleted, their seat automatically becomes available
  - Duplicate seat assignment prevention (if seat is occupied, member gets no seat)
  - Real-time sync between members and seats data
- **AUTOMATED FEE GENERATION**: Improved fee management system
  - Removed manual "Generate Monthly Fees" button
  - Implemented automatic fee generation based on each member's joining date
  - Fees only generate when due date has arrived or passed (smart due date checking)
  - Handles edge cases: members joining on 30th/31st get proper due dates in February
  - Added "Next Due Date" column to fees table
  - Only overdue fees show as pending; future fees remain hidden until due
  - Improved UI with fade-in animations and better styling
  - Prevents duplicate fee generation with smart refetching logic

## Architecture

### Frontend Stack
- **HTML5**: Structure and semantic markup
- **CSS3**: Custom golden theme, responsive grid layouts, animations
- **Vanilla JavaScript (ES6+)**: All business logic and interactions
- **Chart.js**: Data visualization for reports and analytics
- **LocalStorage API**: Client-side data persistence

### Project Structure
```
library-management/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── members.html           # Member management
├── seats.html             # Seat management (NEW)
├── books.html             # Book management & issue/return
├── fees.html              # Fee collection & payment tracking
├── expenses.html          # Expense management
├── reports.html           # Analytics & charts
├── activity.html          # Activity log
├── settings.html          # Settings & backup/restore
├── server.py              # Python HTTP server
├── css/
│   ├── style.css          # Global styles & theme
│   ├── dashboard.css      # Dashboard-specific styles
│   ├── members.css        # Member cards styling
│   ├── seats.css          # Seat grid & color-coded styling (NEW)
│   ├── books.css          # Book management styles
│   ├── fees.css           # Fee management styles
│   ├── expenses.css       # Expense tracking styles
│   └── reports.css        # Reports & charts styles
├── js/
│   ├── storage.js         # Core storage manager class
│   ├── main.js            # Authentication & global functions
│   ├── dashboard.js       # Dashboard logic & stats
│   ├── members.js         # Member CRUD operations
│   ├── seats.js           # Seat management & assignment (NEW)
│   ├── books.js           # Book management & transactions
│   ├── fees.js            # Fee tracking & payments
│   ├── expenses.js        # Expense management
│   ├── reports.js         # Analytics & Chart.js integration
│   └── activity.js        # Activity log display
└── assets/                # Static assets (images, icons, fonts)
```

## Core Features

### 1. Authentication
- Simple admin login (default: admin/admin123)
- Remember me functionality
- Session management
- Password change capability

### 2. Member Management
- Add, edit, delete members
- **Cascade deletion**: When member is deleted, all related data is automatically removed:
  - Member's seat is freed and becomes available
  - All fee records (paid and pending) are deleted
  - All issued books are returned (availability updated)
  - Issued book records are removed
- Seat number assignment and tracking
- Membership types (monthly, quarterly, yearly)
- Active/inactive status
- Profile photo support
- Search and filter by status/membership
- CSV export of member data
- Membership expiry tracking

### 3. Seat Management (NEW)
- Visual grid layout showing all library seats
- Color-coded status:
  - 🟩 Green: Available seats
  - 🟥 Red: Occupied seats with assigned member
  - 🟨 Yellow: Reserved seats
- Click-to-assign: Assign available seats to active members
- Click-to-view: View occupied seat details and free them
- Reserve/Unreserve functionality for future bookings
- Real-time statistics (total, available, occupied, reserved, occupancy rate)
- Search and filter seats by status or member name
- Automatic initialization based on total seats setting
- Activity logging for all seat operations

### 4. Book Management
- Add, edit, delete books (Title, Author, ISBN, Category, Publisher, Quantity)
- Issue books to members with due dates
- Return books with automatic availability update
- Overdue tracking with automatic fine calculation
- Search by title, author, or ISBN
- Filter by category and availability status
- Stock alerts for low quantity

### 5. Fee Management
- **Automatic fee generation** based on each member's joining date
- Fees only generate when due date has arrived or passed
- Smart due date checking handles edge cases (30th/31st joining dates in February)
- Only overdue fees show as pending; future fees remain hidden until due
- Mark payments as paid/pending
- Record payment details (date, method, notes)
- Filter by month and status
- Next due date tracking for each member
- Payment collection statistics
- Revenue tracking and reporting
- No manual fee generation required

### 6. Expense Management
- Record expenses with categories (General, Utilities, Maintenance, Rent, Others)
- Payment methods (Cash, UPI, Bank, Card)
- Category-wise expense breakdown
- Monthly and yearly expense tracking
- Search and filter capabilities
- CSV export functionality

### 7. Dashboard
- Real-time summary cards
  - Total members (active/inactive)
  - Seat occupancy
  - Book inventory (total, issued, available)
  - Monthly revenue (paid/pending)
  - Monthly expenses
  - Monthly profit calculation
- Recent members display
- Overdue books with fines
- Pending payments list
- Recent activity feed

### 8. Reports & Analytics
- Revenue vs Expense trend charts (6 months)
- Category-wise expense distribution (pie chart)
- Books status visualization
- Payment collection rate
- Monthly revenue comparison (12 months)
- Current vs previous month comparison
- Profit margin calculations

### 8. Activity Log
- Tracks all key actions (member added, book issued, fee paid, expense added)
- Timestamp and user attribution
- Filter by action type and date range
- Search functionality
- Export to CSV
- Clear log option

### 9. Settings & Backup
- Library configuration (name, total seats, default fine, return days)
- Password management
- **🆕 Dynamic Seat Management:**
  - Add seats individually or in bulk
  - Remove trailing available seats (prevents data corruption)
  - Set exact seat count with automatic add/remove
  - Real-time seat statistics display
  - Smart validation to prevent removing occupied seats
  - Automatic sync with settings total seats field
  - Activity logging for all seat operations
- Complete data export to JSON (includes seats)
- Import data from backup (includes seats)
- Clear all data option (includes seats)
- System information display
- Storage usage tracking

## Data Management

### LocalStorage Keys
- `libraryUser`: Admin credentials
- `libraryMembers`: Member records
- `librarySeats`: Seat assignment records (NEW)
- `libraryBooks`: Book inventory
- `issuedBooks`: Book issue transactions
- `libraryFees`: Fee payment records
- `libraryExpenses`: Expense transactions
- `libraryActivities`: Activity log entries
- `librarySettings`: System configuration

### Data Persistence
All data is stored in browser LocalStorage, providing:
- Instant read/write operations
- No server dependencies
- Offline functionality
- Easy backup/restore via JSON export/import

## Design System

### Color Palette
- Primary Gold: #f4c430
- Dark Gold: #d4a017
- Light Gold: #ffd700
- Background Primary: #1a1a1a
- Background Secondary: #2a2a2a
- Card Background: #2d2d2d
- Text Primary: #ffffff
- Text Secondary: #cccccc
- Success: #4caf50
- Danger: #f44336
- Warning: #ff9800
- Info: #2196f3

### Responsive Breakpoints
- Desktop: > 768px (full sidebar)
- Tablet: 481px - 768px (collapsible sidebar)
- Mobile: ≤ 480px (mobile optimized)

## User Preferences
None specified yet

## Technical Decisions

### Why LocalStorage?
- No backend infrastructure needed
- Instant performance
- Perfect for demo and small-scale deployments
- Easy data portability via export/import

### Why Vanilla JavaScript?
- No framework dependencies
- Faster load times
- Full control over functionality
- Educational value and transparency

### Why Chart.js?
- Lightweight and performant
- Beautiful default styling
- Easy customization
- Wide browser support

## Deployment
- Server: Python 3.11 HTTP server
- Port: 5000 (bound to 0.0.0.0)
- Cache control enabled for proper updates
- Static file serving with no-cache headers

## Future Enhancements (Not Implemented)
- Staff role with permission-based access
- Email/SMS notifications for reminders
- Barcode/QR code scanning
- PDF export for reports and receipts
- Advanced analytics with predictive insights
- Multi-library support
- Database backend option (PostgreSQL/MySQL)

## Known Limitations
- Data stored locally in browser (not shared across devices)
- No real-time collaboration
- Storage limited to ~5-10MB per browser
- No automated backups (manual export required)
- Single user at a time

## Access
- Default Login: admin / admin123
- Web Interface: http://0.0.0.0:5000/
- Entry Point: index.html (login page)

## Maintenance Notes
- Regularly export backups to prevent data loss
- Monitor LocalStorage usage in settings
- Clear activity log periodically to save space
- Update password from default after first login