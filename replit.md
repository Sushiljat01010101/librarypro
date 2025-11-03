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
-   **Member Management**: CRUD operations for members, including seat assignment, membership types, status tracking, next payment date selection, and CSV export. Features cascade deletion for related data (seats, fees, books). Members can have an optional next payment date field to track upcoming payment deadlines.
-   **Seat Management**: A visual grid layout with color-coded seat statuses (Available, Occupied, Reserved). Supports individual or bulk seat additions, safe removal of trailing seats, and real-time statistics. Automatic synchronization with member assignments.
-   **Book Management**: CRUD operations for books, issue/return functionality, overdue tracking with fine calculation, and stock alerts.
-   **Fee Management**: Automated fee generation based on member joining dates, smart due date checking using member's custom next payment date (if set) or calculated from joining date, and tracking of payments (paid/pending).
-   **Expense Management**: Recording and categorization of expenses, tracking by month/year, and CSV export.
-   **Dashboard**: Provides real-time summaries of members, seat occupancy, book inventory, revenue, expenses, and profit, along with recent activity.
-   **Reports & Analytics**: Visualizations for revenue vs. expense trends, category-wise expense distribution, book status, and payment collection rates using Chart.js.
-   **Activity Log**: Tracks all key actions with timestamps, user attribution, and filtering capabilities.
-   **Settings & Backup**: Configurable library settings (name, total seats, fines), password management, dynamic seat management, complete data export/import (JSON), and data clearing options.
-   **Telegram Notifications**: Real-time notifications sent to Telegram when members are added/updated/deleted and when payments are recorded/updated. Configurable via Settings page with Bot Token and Chat ID. Includes a test notification feature to verify the setup.
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
-   **Python HTTP Server**: Used for local development and deployment to serve static files.