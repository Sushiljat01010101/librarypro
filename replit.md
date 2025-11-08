# Library Management System

## Overview
This project is a comprehensive, responsive Library Management System built with pure HTML, CSS, and Vanilla JavaScript. Its primary purpose is to manage all library operations, including member and book tracking, fee and expense management, and detailed analytics, all within a single-page application. The system utilizes LocalStorage for data persistence and features a modern golden-yellow theme. The business vision is to provide an accessible, no-backend solution for small to medium-sized libraries, offering a robust set of features for efficient library administration.

## User Preferences
None specified yet

## System Architecture

### UI/UX Decisions
The system employs a modern, professional golden-yellow theme with a responsive design, featuring a mobile-responsive hamburger navigation and a fixed sidebar for desktop. It includes a dark/light theme toggle with preference persistence, preference cards, professional toggle switches, and smooth animations/transitions for an enhanced user experience.

### Technical Implementations
The system is implemented as a Single-Page Application (SPA) using:
-   **HTML5**: For semantic structure.
-   **CSS3**: For custom theming, responsive layouts, and animations.
-   **Vanilla JavaScript (ES6+)**: For all core business logic and dynamic content.
-   **Chart.js**: Integrated for data visualization.
-   **LocalStorage API**: Used for client-side data persistence, enabling offline functionality.

### Feature Specifications
The system encompasses several core features:
-   **Authentication**: Admin login with session management and password change.
-   **Member Management**: CRUD operations including seat assignment, membership types, status tracking (active/inactive), multi-month advance payments, CSV export, and cascade deletion. Features include half-day/full-day admission types with real-time check-in/check-out status, secure camera capture/upload for photos and ID proofs (stored via Telegram reference only), and professional multi-page PDF generation for member details, ID proof, and photo.
-   **Seat Management**: Visual grid layout with color-coded statuses, bulk additions, safe removal, and real-time statistics.
-   **Book Management**: CRUD for books, issue/return, overdue tracking, and stock alerts.
-   **Fee Management**: Automated fee generation, smart due date checking, tracking payments, comprehensive multi-month advance payment handling, and WhatsApp payment reminders with one-click integration to send pending payment notifications directly to members' phones with formatted payment details.
-   **Payment Receipts**: Comprehensive system with member search, payment history, PDF generation, WhatsApp sharing, date filtering, CSV export, and print capabilities. Features a modern UI with animations and glassmorphism effects.
-   **Expense Management**: Recording, categorization, monthly/yearly tracking, and CSV export.
-   **Dashboard**: Real-time summaries of members, seat occupancy, book inventory, revenue, expenses, profit, and recent activity.
-   **Reports & Analytics**: Visualizations for trends, expense distribution, book status, and payment collection rates using Chart.js.
-   **Activity Log**: Tracks key actions with timestamps and filtering.
-   **Settings & Backup**: Configurable library settings, password management, dynamic seat management, complete data export/import (JSON), data clearing, and an auto backup system with customizable schedules (Daily, Weekly, Monthly, Custom) and optional Telegram integration for backup file delivery.
-   **Telegram Notifications**: Real-time notifications for member and payment events, with secure handling of photos and ID proofs by sending to Telegram and storing only references locally. Includes a test notification feature.
-   **Help & Support Center**: Modern page with developer information, feature guides, quick tips, and a multilingual (English/Hindi) AI-powered chatbot assistant with a comprehensive knowledge base.

### System Design Choices
-   **No Backend Dependency**: Relies entirely on client-side technologies and LocalStorage.
-   **Single-Page Application (SPA)**: All functionality within interconnected HTML pages for a fluid user experience.
-   **Responsive Design**: Optimized for various screen sizes.
-   **Dynamic Content**: JavaScript handles all dynamic updates and interactions.
-   **Modular Structure**: Code organized into dedicated JavaScript and CSS files.

## External Dependencies

-   **Chart.js**: JavaScript charting library for data visualization.
-   **jsPDF**: JavaScript library for client-side PDF generation.
-   **html2canvas**: JavaScript library for converting HTML elements to canvas for PDF generation.
-   **Python HTTP Server**: Used for local development and deployment.
-   **MediaDevices API**: Browser API for camera access.