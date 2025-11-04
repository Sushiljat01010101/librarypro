# Library Management System

## Overview
This project is a comprehensive, responsive Library Management System built with pure HTML, CSS, and Vanilla JavaScript. Its primary purpose is to manage all library operations, including member and book tracking, fee and expense management, and detailed analytics, all within a single-page application. The system utilizes LocalStorage for data persistence and features a modern golden-yellow theme. The business vision is to provide an accessible, no-backend solution for small to medium-sized libraries, offering a robust set of features for efficient library administration.

## User Preferences
None specified yet

## System Architecture

### UI/UX Decisions
The system employs a modern, professional golden-yellow theme. It features a responsive design with a mobile-responsive hamburger navigation for smaller screens (≤768px) and a fixed sidebar for desktop. A dark/light theme toggle is available, with preferences persisting across sessions. UI elements include preference cards, professional toggle switches, and smooth animations and transitions for an enhanced user experience.

### Technical Implementations
The system is implemented as a Single-Page Application (SPA) using:
-   **HTML5**: For semantic structure.
-   **CSS3**: For custom theming, responsive layouts, and animations.
-   **Vanilla JavaScript (ES6+)**: For all core business logic, interactions, and dynamic content.
-   **Chart.js**: Integrated for data visualization in reports and analytics.
-   **LocalStorage API**: Used for client-side data persistence, enabling offline functionality and eliminating backend dependencies.

### Feature Specifications
The system encompasses several core features:
-   **Authentication**: Admin login with session management and password change.
-   **Member Management**: CRUD operations for members, including seat assignment, membership types, status tracking, multi-month advance payment support, and CSV export. Features cascade deletion for related data (seats, fees, books). Members can have an optional next payment date field to track upcoming payment deadlines. **Inactive Member Handling**: When a member's status is changed from 'active' to 'inactive', the system automatically frees their assigned seat (making it available for other members) and hides their pending fee payments from the fees page and statistics. This ensures that inactive members don't occupy seats or clutter the pending payments view, while their paid payment history is preserved. **ID Proof Upload with Secure Storage**: Members can upload their ID proof (Aadhar, License, etc.) either by uploading a file or capturing directly from camera. For security and privacy, the ID proof photo is automatically sent to Telegram (if configured) and only the Telegram reference (file_id and message_id) is stored locally - the actual photo data is NOT stored in LocalStorage. This ensures sensitive ID documents are not stored on the client side. To view uploaded ID proofs, users must access their Telegram bot chat where all photos are stored with message IDs for easy reference. If Telegram is not configured, the ID proof is not saved at all. **Multi-Month Advance Payment**: When adding or updating a member, the system allows recording advance payments for multiple months (1-12 months). The system automatically creates or updates fee records for all paid months, properly handles existing pending fees by marking them as paid, and calculates the next due date based on the last paid month. This ensures accurate billing ledger and proper payment tracking for members who pay for multiple months at once.
-   **Seat Management**: A visual grid layout with color-coded seat statuses (Available, Occupied, Reserved). Supports individual or bulk seat additions, safe removal of trailing seats, and real-time statistics. Automatic synchronization with member assignments.
-   **Book Management**: CRUD operations for books, issue/return functionality, overdue tracking with fine calculation, and stock alerts.
-   **Fee Management**: Automated fee generation based on member joining dates, smart due date checking using member's custom next payment date (if set) or calculated from joining date, tracking of payments (paid/pending), and comprehensive multi-month advance payment handling. The system intelligently starts from the earliest unpaid month when processing advance payments, updates existing pending fees to paid status, creates new fee records as needed, and automatically calculates the correct next payment date based on the billing cursor. This ensures accurate reconciliation of outstanding dues and proper tracking of advance payments.
-   **Payment Receipts**: Comprehensive payment receipt management system with member search, complete payment history display, PDF generation for receipts, WhatsApp sharing functionality, date range filtering, CSV export, and print capabilities. Features include: member selection dropdown with search, visual payment timeline with status indicators, download PDF for all payments or individual payments, direct WhatsApp share with formatted payment details, date-based filtering, print receipt functionality, and CSV export for record-keeping. The page integrates jsPDF and html2canvas libraries for client-side PDF generation. **Modern UI Design**: The receipts page features a completely redesigned modern interface with smooth animations, gradient backgrounds, glassmorphism effects, and interactive hover states. The timeline uses animated markers with color-coded status indicators, member info cards showcase stats with elegant hover effects, and all buttons feature ripple animations and smooth transitions. The responsive design ensures optimal viewing across all device sizes with mobile-optimized layouts.
-   **Expense Management**: Recording and categorization of expenses, tracking by month/year, and CSV export.
-   **Dashboard**: Provides real-time summaries of members, seat occupancy, book inventory, revenue, expenses, and profit, along with recent activity.
-   **Reports & Analytics**: Visualizations for revenue vs. expense trends, category-wise expense distribution, book status, and payment collection rates using Chart.js.
-   **Activity Log**: Tracks all key actions with timestamps, user attribution, and filtering capabilities.
-   **Settings & Backup**: Configurable library settings (name, total seats, fines), password management, dynamic seat management, complete data export/import (JSON), and data clearing options.
-   **Telegram Notifications**: Real-time notifications sent to Telegram when members are added/updated/deleted and when payments are recorded/updated. Configurable via Settings page with Bot Token and Chat ID. Includes a test notification feature to verify the setup. When a member is added or updated with an ID proof, the system automatically sends the ID proof photo to Telegram and stores only the Telegram message reference (file_id and message_id) locally, ensuring sensitive ID documents are not stored in LocalStorage for enhanced security and privacy. Users can view all ID proof photos by opening their Telegram app and navigating to the bot chat. Each photo is labeled with member details and a message ID for easy identification.
-   **Auto Backup System**: Comprehensive automatic backup system with multiple scheduling options:
    -   **Backup Intervals**: Daily (every 24 hours), Weekly (every 7 days), Monthly (every 30 days), or Custom schedule
    -   **Custom Scheduling**: Allows users to schedule one-time backups at specific date and time
    -   **JSON Export**: All backups are exported as JSON files containing complete library data (members, books, fees, expenses, activities, seats, settings)
    -   **Telegram Integration**: Optional feature to automatically send backup files to Telegram bot when auto backups run
    -   **Backup Monitoring**: Displays last backup time and next scheduled backup time
    -   **Automatic Checks**: System checks for scheduled backups every hour and executes them when due
    -   **Toggle Control**: Enable/disable auto backup and Telegram backup delivery independently

### System Design Choices
-   **No Backend Dependency**: Relies entirely on client-side technologies and LocalStorage for data persistence, making it highly portable and easy to deploy.
-   **Single-Page Application (SPA)**: All functionality is contained within a set of interconnected HTML pages, with navigation handled client-side for a fluid user experience.
-   **Responsive Design**: Optimized for various screen sizes, from mobile to desktop, ensuring accessibility across devices.
-   **Dynamic Content**: JavaScript handles all dynamic updates, form validations, and interactive elements.
-   **Modular Structure**: Code is organized into dedicated JavaScript files for different modules (e.g., `members.js`, `books.js`, `seats.js`) and CSS files for specific page styling.

## External Dependencies

-   **Chart.js**: JavaScript charting library for data visualization in reports.
-   **jsPDF**: JavaScript library for client-side PDF generation used in payment receipts.
-   **html2canvas**: JavaScript library for converting HTML elements to canvas for PDF generation.
-   **Python HTTP Server**: Used for local development and deployment to serve static files.