// Help & Support Page - Multilingual AI Chatbot

class LibraryChatbot {
    constructor() {
        this.currentLanguage = null;
        this.knowledgeBase = {
            en: {
                welcome: "Hello! I'm your Library Assistant. How can I help you today?",
                languageChanged: "Language changed to English. How can I assist you?",
                quickQuestions: [
                    "How to add a member?",
                    "How to manage seats?",
                    "How to collect fees?",
                    "How to export data?",
                    "How to generate PDF?",
                    "How to setup Telegram?",
                    "How to restore backup?",
                    "How to add books?",
                    "How to track expenses?",
                    "How to view reports?",
                    "How to upload member photo?",
                    "How to share receipts on WhatsApp?",
                    "What are system features?",
                    "How to change password?",
                    "How to enable auto backup?"
                ],
                responses: {
                    "how to add a member": "To add a member:\n1. Go to Members page\n2. Click 'Add Member' button\n3. Fill in member details (Name, Contact, Email, etc.)\n4. Upload photo and ID proof (optional)\n5. Click 'Save Member'\n\nThe member will be added to your library database!",
                    
                    "add member": "To add a member:\n1. Navigate to the Members page from the sidebar\n2. Click the 'Add Member' button\n3. Fill in all required details\n4. Optionally upload photo and ID proof\n5. Click Save to add the member",
                    
                    "how to export data": "To export data:\n1. Go to the respective page (Members, Fees, Expenses, etc.)\n2. Click 'Export' button\n3. Choose format (CSV or PDF)\n4. File will be downloaded automatically\n\nYou can export Members list, Fee records, Expenses, and Reports!",
                    
                    "export data": "You can export data from:\n• Members page → Export member list as CSV\n• Fees page → Export payment records\n• Expenses page → Export expense records\n• Reports page → Export analytics as PDF\n\nJust click the Export button on any page!",
                    
                    "how to generate pdf": "PDF generation is available for:\n1. Member Registration - Click 'Generate PDF' on member card\n2. Payment Receipts - Go to Receipts page, select payment, click 'Generate Receipt'\n3. Reports - Export reports as PDF from Reports page\n\nAll PDFs are generated instantly in your browser!",
                    
                    "generate pdf": "To generate PDF:\n• For Members: Click 'Generate PDF' button on member card\n• For Receipts: Go to Receipts page and select payment\n• For Reports: Use Export option in Reports section\n\nPDFs are created with your library branding!",
                    
                    "how to restore backup": "To restore a backup:\n1. Go to Settings page\n2. Scroll to 'Backup & Restore' section\n3. Click 'Restore from Telegram' or 'Import Data'\n4. Select the backup file\n5. Click 'Restore'\n\nAll your data will be restored from the backup!",
                    
                    "restore backup": "Restore backup from Settings page:\n• Click 'Restore from Telegram' for cloud backups\n• Or use 'Import Data' for local backups\n• Select your backup file and confirm\n• All data will be restored safely",
                    
                    "telegram integration": "Telegram Integration allows you to:\n1. Receive instant notifications\n2. Backup data to cloud (secure storage)\n3. Get payment alerts\n4. Store member photos and documents\n\nSetup in Settings → Telegram Integration:\n1. Create a Telegram Bot (@BotFather)\n2. Get Bot Token and Chat ID\n3. Enter them in Settings\n4. Save and test connection!",
                    
                    "telegram": "Telegram Integration features:\n• Real-time notifications for payments\n• Automatic cloud backup of data\n• Secure storage for member photos\n• Payment reminders and alerts\n\nConfigure it in Settings page!",
                    
                    "how to assign seat": "To assign a seat to a member:\n1. Go to Seats page\n2. Click on an available (green) seat\n3. Select member from dropdown\n4. Click 'Assign Seat'\n\nOr from Members page:\n1. Edit member details\n2. Select seat number\n3. Save changes",
                    
                    "seat allocation": "Seat management:\n• Green seats = Available\n• Yellow seats = Occupied\n• Click any seat to assign/unassign\n• Change total seats in Settings\n\nGo to Seats page to manage seat allocation!",
                    
                    "fee collection": "To collect fees:\n1. Go to Fees page\n2. Find the member\n3. Click 'Mark as Paid'\n4. Enter payment amount and date\n5. Click 'Save Payment'\n\nReceipt will be generated automatically!",
                    
                    "payment": "To record a payment:\n1. Navigate to Fees page\n2. Find member with pending fee\n3. Click 'Mark as Paid' button\n4. Confirm payment details\n5. Generate receipt from Receipts page",
                    
                    "book management": "To manage books:\n1. Go to Books page\n2. Click 'Add Book' to add new books\n3. Issue book: Select book, choose member, set return date\n4. Return book: Click 'Mark as Returned'\n5. Track overdue books and fines automatically!",
                    
                    "books": "Book features:\n• Add new books with ISBN and details\n• Issue books to members\n• Track return dates\n• Automatic fine calculation for overdue books\n• View book history and availability",
                    
                    "reports": "View comprehensive reports:\n• Revenue vs Expense trends\n• Monthly fee collection\n• Seat occupancy statistics\n• Member growth charts\n• Expense breakdown by category\n\nAll reports are interactive with charts!",
                    
                    "analytics": "Analytics features:\n• Visual charts and graphs\n• Monthly revenue tracking\n• Expense categorization\n• Member statistics\n• Export reports as PDF\n\nAccess from Reports page!",
                    
                    "forgot password": "To reset password:\n1. Go to Settings page\n2. Scroll to 'Account' section\n3. Click 'Change Password'\n4. Enter current and new password\n5. Click 'Update Password'\n\nMake sure to remember your new password!",
                    
                    "password": "Change your password from Settings:\n• Navigate to Settings page\n• Find Account section\n• Enter old and new password\n• Save changes\n\nDefault password is 'admin123'",
                    
                    "backup": "Backup your data:\n• Automatic backups to Telegram (if configured)\n• Manual backup from Settings page\n• Download backup as JSON file\n• Set backup schedule in Settings\n\nNever lose your library data!",
                    
                    "activity log": "Activity Log shows:\n• All member additions/updates\n• Fee payments\n• Book issues and returns\n• Expense entries\n• System activities with timestamps\n\nView from Activity page to track all operations!",
                    
                    "settings": "Settings allow you to:\n• Configure library name\n• Set total seats\n• Manage default fine amount\n• Set book return days\n• Configure Telegram integration\n• Enable automatic backups\n• Change password\n• Customize library settings",
                    
                    "expenses": "To add an expense:\n1. Go to Expenses page\n2. Click 'Add Expense'\n3. Select category (Utilities, Maintenance, etc.)\n4. Enter amount and description\n5. Set date and save\n\nTrack all library expenses easily!",
                    
                    "what are system features": "🎯 COMPLETE SYSTEM FEATURES:\n\n📊 DASHBOARD:\n• Real-time statistics & metrics\n• Total members, seats, revenue\n• Recent activity feed\n• Quick action buttons\n• Profit/loss tracking\n\n👥 MEMBER MANAGEMENT:\n• Add/Edit/Delete members\n• Photo capture via camera\n• ID proof upload to Telegram\n• Professional 3-page PDF generation\n• Member status tracking (Active/Inactive)\n• Seat assignment\n• Advance payment support\n• CSV export\n\n🪑 SEAT MANAGEMENT:\n• Visual grid layout\n• Color-coded status (Green=Available, Yellow=Occupied)\n• Real-time availability tracking\n• Bulk seat operations\n• Auto seat release for inactive members\n• Seat assignment from Members page\n\n📚 BOOK MANAGEMENT:\n• Book inventory tracking\n• Issue/Return functionality\n• Overdue tracking with auto fines\n• Stock alerts\n• Book history\n• ISBN support\n\n💰 FEE MANAGEMENT:\n• Automated monthly fee generation\n• Multi-month advance payment\n• Payment status tracking\n• Due date management\n• Receipt generation\n• WhatsApp receipt sharing\n• CSV export\n\n💵 EXPENSE MANAGEMENT:\n• Expense categorization\n• Monthly/Yearly tracking\n• Category-wise analysis\n• CSV export\n\n📈 REPORTS & ANALYTICS:\n• Revenue vs Expense charts (6 months)\n• Category-wise expense breakdown\n• Book status visualization\n• Payment collection rate\n• Monthly revenue comparison (12 months)\n• Interactive charts with Chart.js\n• PDF export\n\n🧾 RECEIPTS:\n• Payment history timeline\n• PDF receipt generation\n• WhatsApp sharing\n• Date range filtering\n• Print capabilities\n\n📝 ACTIVITY LOG:\n• Complete audit trail\n• All system actions logged\n• Filter by type & date\n• Search functionality\n• CSV export\n\n⚙️ SETTINGS:\n• Library name customization\n• Total seats configuration\n• Default fine amount\n• Book return days\n• Telegram bot integration\n• Auto backup scheduling\n• Password management\n\n🔄 AUTO BACKUP:\n• Scheduled backups (Daily/Weekly/Monthly/Custom)\n• JSON export\n• Telegram delivery\n• Restore functionality\n• Missed backup recovery\n\n📱 TELEGRAM INTEGRATION:\n• Real-time notifications\n• Payment alerts\n• Cloud backup storage\n• Member photo/ID storage\n• Bot configuration\n\n🎨 UI/UX FEATURES:\n• Modern dark/light theme\n• Responsive mobile design\n• Smooth animations\n• Glassmorphism effects\n• Toast notifications\n• Loading states\n\nThis system is 100% client-side with LocalStorage!",
                    
                    "system features": "Our Library Management System includes:\n\n✅ Complete Member Management\n✅ Smart Seat Allocation\n✅ Book Issue/Return System\n✅ Automated Fee Collection\n✅ Expense Tracking\n✅ Advanced Reports & Charts\n✅ PDF & CSV Export\n✅ Telegram Integration\n✅ Auto Backup System\n✅ Activity Logging\n✅ WhatsApp Sharing\n✅ Photo & ID Upload\n✅ Dark/Light Theme\n✅ Mobile Responsive\n✅ 100% Offline Ready\n\nBuilt with pure HTML, CSS & JavaScript!",
                    
                    "how to upload member photo": "To upload member photo:\n\n📸 METHOD 1 - Camera Capture:\n1. Go to Members page\n2. Click 'Add Member' or edit existing\n3. Click 'Capture Photo' button\n4. Allow camera access\n5. Take photo and save\n6. Photo stores in member record\n\n📁 METHOD 2 - Upload File:\n1. Click 'Upload Photo' button\n2. Select image from device\n3. Photo will be displayed\n4. Save member to store photo\n\n🔐 SECURE STORAGE:\n• Photos stored in LocalStorage\n• If Telegram configured, auto-uploads to cloud\n• Secure backup with Telegram bot\n• Always accessible from member profile\n\nPhotos appear on member cards and PDF reports!",
                    
                    "upload photo": "Upload member photos easily:\n• Use camera to capture live\n• Or upload from device\n• Photos stored locally\n• Auto backup to Telegram (if configured)\n• Visible on member cards and PDFs\n\nGo to Members page to upload!",
                    
                    "how to upload id proof": "To upload ID Proof:\n\n1. Go to Members page\n2. Click 'Add Member' or edit existing\n3. Scroll to 'ID Proof' section\n4. Click 'Upload ID Proof' button\n5. Select ID document (Aadhaar, PAN, etc.)\n6. File will be uploaded\n7. Click 'Save Member'\n\n📱 TELEGRAM INTEGRATION:\n• If Telegram is configured in Settings\n• ID proof automatically uploads to Telegram cloud\n• Secure cloud storage\n• Never lose important documents\n• Access anytime from Telegram\n\n💡 TIP: Always upload ID proof for record verification and security!",
                    
                    "id proof": "Upload ID proof for members:\n• Aadhaar Card\n• PAN Card\n• Driving License\n• Any government ID\n\nSecurely stored in Telegram cloud (if configured). Essential for member verification!",
                    
                    "how to share receipts on whatsapp": "To share receipt on WhatsApp:\n\n1. Go to Receipts page\n2. Select member from dropdown\n3. Find the payment in history\n4. Click 'Generate Receipt' button\n5. PDF receipt will be created\n6. Click 'Share on WhatsApp' button\n7. WhatsApp opens with pre-filled message\n8. Select contact and send!\n\n📱 FEATURES:\n• Professional PDF receipts\n• Library branding included\n• Payment details & date\n• Direct WhatsApp sharing\n• No manual typing needed\n\n💡 Members receive instant payment confirmation!",
                    
                    "whatsapp": "WhatsApp features:\n• Share payment receipts instantly\n• Professional PDF format\n• Direct from Receipts page\n• One-click sharing\n• Members get instant confirmation\n\nNo need to manually type receipt details!",
                    
                    "how to enable auto backup": "To enable Auto Backup:\n\n1. Go to Settings page\n2. Scroll to 'Auto Backup' section\n3. Toggle 'Enable Auto Backup' ON\n4. Select backup interval:\n   • Daily - Every 24 hours\n   • Weekly - Every 7 days\n   • Monthly - Every 30 days\n   • Custom - Set your own time\n5. Optional: Enable 'Send to Telegram'\n6. Click 'Save Settings'\n\n🔄 AUTO BACKUP FEATURES:\n• Automatic scheduled backups\n• JSON format export\n• Telegram cloud delivery\n• Missed backup recovery\n• Manual backup anytime\n• One-click restore\n\n💾 BACKUP INCLUDES:\n• All member data\n• Fee records\n• Book inventory\n• Expense records\n• Activity logs\n• Settings & preferences\n\nNever lose your library data!",
                    
                    "auto backup": "Auto Backup System:\n• Schedule automatic backups\n• Daily, Weekly, Monthly intervals\n• JSON format export\n• Optional Telegram delivery\n• Restore anytime\n• Missed backup alerts\n\nConfigure in Settings → Auto Backup section!",
                    
                    "how to setup telegram": "Complete Telegram Setup Guide:\n\n📱 STEP 1 - Create Telegram Bot:\n1. Open Telegram app\n2. Search for '@BotFather'\n3. Start chat and send /newbot\n4. Enter bot name (e.g., MyLibraryBot)\n5. Enter username (e.g., mylibrary_bot)\n6. Copy the Bot Token (long string)\n\n💬 STEP 2 - Get Chat ID:\n1. Search for '@userinfobot' in Telegram\n2. Start chat\n3. Bot will show your Chat ID\n4. Copy the Chat ID number\n\n⚙️ STEP 3 - Configure System:\n1. Go to Settings page\n2. Find 'Telegram Integration' section\n3. Paste Bot Token\n4. Paste Chat ID\n5. Click 'Save Settings'\n6. Click 'Test Connection'\n7. Check Telegram for test message\n\n✅ WHAT YOU GET:\n• Payment notifications\n• Member addition alerts\n• Auto backup to cloud\n• Photo/ID secure storage\n• Real-time updates\n• Cloud data backup\n\n🔒 100% Secure & Private!",
                    
                    "setup telegram": "Quick Telegram Setup:\n1. Create bot via @BotFather\n2. Get Chat ID from @userinfobot\n3. Enter both in Settings\n4. Test connection\n5. Start receiving notifications!\n\nTelegram enables cloud backup and real-time alerts!",
                    
                    "how to manage seats": "Complete Seat Management:\n\n🪑 ASSIGN SEAT:\n1. Go to Seats page\n2. Click green (available) seat\n3. Select member from dropdown\n4. Click 'Assign Seat'\n\nOR from Members page:\n1. Edit member\n2. Click 'Select Seat' button\n3. Choose available seat\n4. Save changes\n\n🔓 UNASSIGN/FREE SEAT:\n1. Go to Seats page\n2. Click yellow (occupied) seat\n3. View member details\n4. Click 'Free Seat'\n5. Confirm action\n\n📊 SEAT FEATURES:\n• Green = Available\n• Yellow = Occupied\n• Visual grid layout\n• Real-time status\n• Bulk operations\n• Total seats: configurable in Settings\n• Auto-release for inactive members\n• Filter by status\n• Search by seat/member\n\n💡 TIP: Total seats can be changed in Settings page!",
                    
                    "manage seats": "Seat Management:\n• Visual grid with color codes\n• Assign from Seats or Members page\n• Real-time availability\n• Free/unassign seats\n• Auto-release for inactive\n• Configure total in Settings\n\nGo to Seats page to manage!",
                    
                    "how to collect fees": "Complete Fee Collection Process:\n\n💰 AUTOMATIC FEE GENERATION:\n• System auto-generates monthly fees\n• Based on member join date\n• Multi-month advance support\n• Due date tracking\n\n💵 MARK PAYMENT:\n1. Go to Fees page\n2. Find member (use search/filter)\n3. See pending fees (red badge)\n4. Click 'Mark as Paid'\n5. Verify amount & date\n6. Click 'Confirm Payment'\n7. Fee status → Paid (green)\n\n🧾 AFTER PAYMENT:\n• Receipt auto-generated\n• View in Receipts page\n• Generate PDF receipt\n• Share on WhatsApp\n• Telegram notification sent (if configured)\n• Activity logged\n\n📊 ADVANCE PAYMENT:\n1. When adding/editing member\n2. Enter 'Months to Pay in Advance'\n3. System creates multiple fee entries\n4. Mark each as paid when collected\n\n💡 FEATURES:\n• Auto fee generation\n• Payment tracking\n• Due date alerts\n• CSV export\n• Filter by status (Paid/Pending)\n• Search by member\n• Monthly reports\n\nAll payments tracked in Activity Log!",
                    
                    "collect fees": "Fee Collection:\n1. System auto-generates monthly fees\n2. Mark as paid from Fees page\n3. Receipt auto-generated\n4. Share on WhatsApp\n5. Track in Reports\n\nSupports advance multi-month payments!",
                    
                    "how to view reports": "Complete Reports & Analytics:\n\n📈 AVAILABLE REPORTS:\n\n1. REVENUE VS EXPENSE TREND (6 months)\n   • Line chart visualization\n   • Monthly comparison\n   • Profit tracking\n\n2. EXPENSE CATEGORY BREAKDOWN\n   • Pie chart display\n   • Category-wise spending\n   • Utilities, Maintenance, etc.\n\n3. BOOK STATUS\n   • Available vs Issued\n   • Overdue tracking\n   • Doughnut chart\n\n4. PAYMENT COLLECTION RATE\n   • Paid vs Pending\n   • Collection efficiency\n   • Bar chart\n\n5. MONTHLY REVENUE (12 months)\n   • Yearly overview\n   • Month-by-month revenue\n   • Bar chart visualization\n\n6. MONTH-OVER-MONTH COMPARISON\n   • Current vs Previous month\n   • Revenue, Expenses, Profit\n   • Growth percentage\n\n📊 HOW TO VIEW:\n1. Click 'Reports' in sidebar\n2. View all charts on one page\n3. Interactive charts (hover for details)\n4. Filter by date range\n5. Export as PDF/CSV\n\n💡 All charts update in real-time based on your data!",
                    
                    "view reports": "View Reports:\n• Revenue vs Expense trends\n• Category-wise expenses\n• Book status charts\n• Payment collection rate\n• Monthly comparisons\n• Interactive visualizations\n• Export to PDF/CSV\n\nAccess from Reports page in sidebar!",
                    
                    "how to add books": "Complete Book Management:\n\n📚 ADD BOOK:\n1. Go to Books page\n2. Click 'Add Book' button\n3. Fill details:\n   • Book title\n   • Author name\n   • ISBN (optional)\n   • Category/Genre\n   • Quantity/Stock\n   • Purchase date\n   • Price (optional)\n4. Click 'Save Book'\n\n📖 ISSUE BOOK:\n1. Find book in list\n2. Click 'Issue Book'\n3. Select member\n4. Set return date\n5. Click 'Confirm Issue'\n6. Book status → Issued\n\n📥 RETURN BOOK:\n1. Find issued book\n2. Click 'Mark as Returned'\n3. System checks due date\n4. Auto-calculates fine (if overdue)\n5. Book available again\n\n⚠️ OVERDUE MANAGEMENT:\n• Auto-tracks overdue books\n• Fine calculation (based on Settings)\n• Overdue alerts\n• Member-wise overdue list\n\n📊 BOOK FEATURES:\n• Stock tracking\n• Low stock alerts\n• Issue history\n• Search by title/author/ISBN\n• Filter by status\n• Category management\n• CSV export\n\n💡 Set default fine amount in Settings page!",
                    
                    "add books": "Book Management:\n• Add books with full details\n• Issue to members\n• Track return dates\n• Auto fine calculation\n• Overdue alerts\n• Stock management\n• Export data\n\nGo to Books page to manage inventory!",
                    
                    "how to track expenses": "Complete Expense Tracking:\n\n💵 ADD EXPENSE:\n1. Go to Expenses page\n2. Click 'Add Expense'\n3. Fill details:\n   • Category (Utilities, Maintenance, Salaries, etc.)\n   • Amount (₹)\n   • Description\n   • Date\n   • Payment method (optional)\n4. Click 'Save Expense'\n\n📊 EXPENSE CATEGORIES:\n• Utilities (Electricity, Water)\n• Maintenance & Repairs\n• Salaries & Wages\n• Books Purchase\n• Stationery\n• Rent\n• Internet & Phone\n• Miscellaneous\n• Custom categories\n\n📈 VIEW EXPENSES:\n• Monthly total\n• Category-wise breakdown\n• Date range filter\n• Search functionality\n• Sort by date/amount\n• Export to CSV\n\n💡 REPORTS INTEGRATION:\n• Expense charts in Reports\n• Revenue vs Expense comparison\n• Profit calculation\n• Category-wise pie chart\n• Monthly trends\n\n🎯 BEST PRACTICES:\n• Record all expenses daily\n• Use proper categories\n• Add clear descriptions\n• Regular review in Reports\n• Export monthly for accounting\n\nTrack every rupee spent on library!",
                    
                    "track expenses": "Expense Tracking:\n• Add expenses with categories\n• Monthly/Yearly view\n• Category-wise analysis\n• Filter & search\n• Export to CSV\n• View in Reports charts\n• Compare with revenue\n\nGo to Expenses page to track!",
                    
                    "dashboard": "Dashboard Overview:\n\n📊 REAL-TIME STATISTICS:\n• Total Members count\n• Active Members\n• Total Seats\n• Occupied Seats\n• Available Seats\n• Total Revenue (₹)\n• Monthly Revenue\n• Total Expenses\n• Profit/Loss\n• Books Issued\n• Pending Payments\n\n⚡ QUICK ACTIONS:\n• Add New Member\n• Record Fee Payment\n• Issue Book\n• Add Expense\n• View Reports\n\n📝 RECENT ACTIVITY:\n• Last 10 activities\n• Member additions\n• Payments received\n• Books issued/returned\n• Real-time updates\n\n💡 Dashboard is your control center - all key metrics at a glance!",
                    
                    "how do i start": "Getting Started Guide:\n\n🎯 INITIAL SETUP:\n1. Login with default credentials\n   • Username: admin\n   • Password: admin123\n2. Change password in Settings\n3. Set library name in Settings\n4. Configure total seats\n5. Set default fine amount\n\n👥 ADD YOUR FIRST MEMBER:\n1. Go to Members page\n2. Click 'Add Member'\n3. Fill basic details\n4. Optionally capture photo\n5. Upload ID proof\n6. Assign seat\n7. Save member\n\n📚 ADD BOOKS (if applicable):\n1. Go to Books page\n2. Add your book inventory\n3. Set quantities\n\n⚙️ CONFIGURE TELEGRAM (optional):\n1. Create bot via @BotFather\n2. Get Chat ID\n3. Enter in Settings\n4. Enable notifications\n\n🔄 ENABLE AUTO BACKUP:\n1. Go to Settings\n2. Turn on Auto Backup\n3. Set schedule\n4. Optional: Send to Telegram\n\n💰 START COLLECTING FEES:\n1. System auto-generates fees\n2. Mark payments as received\n3. Generate receipts\n4. Track in Reports\n\nYou're all set! 🎉",
                    
                    "troubleshooting": "Common Issues & Solutions:\n\n❌ PROBLEM: Can't login\n✅ SOLUTION: Use default - username: admin, password: admin123\n\n❌ PROBLEM: Data not saving\n✅ SOLUTION: Check browser LocalStorage not disabled. Clear cache and try again.\n\n❌ PROBLEM: Telegram not working\n✅ SOLUTION: \n  • Verify Bot Token is correct\n  • Check Chat ID is accurate\n  • Start chat with your bot first\n  • Click 'Test Connection' in Settings\n\n❌ PROBLEM: Photos not uploading\n✅ SOLUTION: Allow camera permission in browser. Check file size (<5MB).\n\n❌ PROBLEM: PDF not generating\n✅ SOLUTION: Disable popup blocker for this site.\n\n❌ PROBLEM: Seats not showing\n✅ SOLUTION: Initialize seats from Seats page or set total in Settings.\n\n❌ PROBLEM: Auto backup not working\n✅ SOLUTION: Check backup schedule in Settings. Ensure time is set correctly.\n\n❌ PROBLEM: WhatsApp share not opening\n✅ SOLUTION: Ensure WhatsApp is installed on device or use WhatsApp Web.\n\n💡 Still having issues? Contact developer!",
                    
                    "how to delete member": "To delete a member:\n\n⚠️ IMPORTANT: Deleting is permanent!\n\n1. Go to Members page\n2. Find the member card\n3. Click 'Edit' button (pencil icon)\n4. Scroll to bottom\n5. Click 'Delete Member' button (red)\n6. Confirm deletion\n\n📝 WHAT HAPPENS:\n• Member record removed\n• Seat freed (if assigned)\n• Fee records kept for history\n• Activity logged\n• Cannot be undone\n\n💡 TIP: Consider marking as 'Inactive' instead of deleting to preserve history!",
                    
                    "delete member": "Delete members from Members page → Edit → Delete button at bottom. WARNING: This is permanent! Consider marking inactive instead.",
                    
                    "how to edit member": "To edit member details:\n\n1. Go to Members page\n2. Find member card\n3. Click 'Edit' button (pencil icon)\n4. Update any details:\n   • Name, Contact, Email\n   • Address\n   • Membership type\n   • Status (Active/Inactive)\n   • Seat number\n   • Monthly fee\n   • Photo\n   • ID proof\n5. Click 'Update Member'\n6. Changes saved immediately\n\n💡 Changes are logged in Activity Log!",
                    
                    "edit member": "Edit members from Members page → Click Edit → Update details → Save. All changes are logged!",
                    
                    "how to search": "Search & Filter Features:\n\n🔍 MEMBERS PAGE:\n• Search by name, contact, email\n• Filter by status (Active/Inactive)\n• Filter by seat assignment\n• Real-time results\n\n🪑 SEATS PAGE:\n• Search by seat number\n• Search by member name\n• Filter by status (Available/Occupied)\n\n📚 BOOKS PAGE:\n• Search by title, author, ISBN\n• Filter by status (Available/Issued)\n• Filter by category\n\n💰 FEES PAGE:\n• Search by member name\n• Filter by status (Paid/Pending)\n• Filter by month\n• Sort by due date\n\n💵 EXPENSES PAGE:\n• Search by description\n• Filter by category\n• Filter by date range\n• Sort by amount/date\n\n📝 ACTIVITY LOG:\n• Search by text\n• Filter by type\n• Filter by date range\n\nAll searches work in real-time!",
                    
                    "search": "Search available on all pages - Members, Books, Fees, Expenses, Seats, Activity. Use filters for quick results!",
                    
                    "theme": "Change Theme:\n\n🌙 DARK THEME (Default):\n• Easy on eyes\n• Professional look\n• Gold accents\n\n☀️ LIGHT THEME:\n• Bright & clean\n• Better for daylight\n• Modern design\n\n🎨 HOW TO CHANGE:\nTheme switcher coming soon in Settings!\n\nCurrent: Dark theme with golden elements",
                    
                    "data security": "Data Security:\n\n🔒 LOCAL STORAGE:\n• All data in browser LocalStorage\n• No external server\n• Complete privacy\n• Offline access\n\n☁️ TELEGRAM BACKUP:\n• Optional cloud storage\n• End-to-end encryption\n• Only you can access\n• Bot token kept secure\n\n💾 BACKUP BEST PRACTICES:\n• Enable auto backup\n• Regular exports\n• Store backups safely\n• Test restore process\n\n🔐 PASSWORD:\n• Change default password immediately\n• Use strong password\n• Don't share credentials\n• Change regularly\n\nYour data is 100% under your control!",
                    
                    "default": "I'm here to help! You can ask me about:\n\n👥 MEMBERS: Adding, editing, photos, ID proof\n🪑 SEATS: Assignment, management, availability\n📚 BOOKS: Adding, issuing, returns, fines\n💰 FEES: Collection, advance payment, receipts\n💵 EXPENSES: Tracking, categories, reports\n📊 REPORTS: Charts, analytics, exports\n📱 TELEGRAM: Setup, notifications, backup\n🔄 BACKUP: Auto backup, restore, export\n🧾 RECEIPTS: PDF generation, WhatsApp share\n📝 ACTIVITY: Viewing logs, tracking\n⚙️ SETTINGS: Configuration, password, customization\n🎯 FEATURES: Complete system overview\n❓ HELP: Troubleshooting, getting started\n\nWhat would you like to know? Just type your question!"
                }
            },
            hi: {
                welcome: "नमस्ते! मैं आपका लाइब्रेरी असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं?",
                languageChanged: "भाषा हिंदी में बदल दी गई है। मैं आपकी कैसे सहायता कर सकता हूं?",
                quickQuestions: [
                    "सदस्य कैसे जोड़ें?",
                    "सीट कैसे असाइन करें?",
                    "फीस कैसे जमा करें?",
                    "डेटा कैसे एक्सपोर्ट करें?",
                    "PDF कैसे बनाएं?",
                    "Telegram कैसे सेटअप करें?",
                    "बैकअप कैसे रिस्टोर करें?",
                    "किताब कैसे जोड़ें?",
                    "खर्च कैसे ट्रैक करें?",
                    "रिपोर्ट कैसे देखें?",
                    "फोटो कैसे अपलोड करें?",
                    "WhatsApp पर रसीद कैसे भेजें?",
                    "सिस्टम की सुविधाएं क्या हैं?",
                    "पासवर्ड कैसे बदलें?",
                    "Auto Backup कैसे चालू करें?"
                ],
                responses: {
                    "सदस्य कैसे जोड़ें": "सदस्य जोड़ने के लिए:\n1. Members पेज पर जाएं\n2. 'Add Member' बटन पर क्लिक करें\n3. सदस्य की जानकारी भरें (नाम, संपर्क, ईमेल आदि)\n4. फोटो और ID प्रूफ अपलोड करें (वैकल्पिक)\n5. 'Save Member' पर क्लिक करें\n\nसदस्य आपकी लाइब्रेरी में जोड़ दिया जाएगा!",
                    
                    "सदस्य जोड़ें": "सदस्य जोड़ने के लिए:\n1. साइडबार से Members पेज पर जाएं\n2. 'Add Member' बटन क्लिक करें\n3. सभी आवश्यक विवरण भरें\n4. वैकल्पिक रूप से फोटो और ID प्रूफ अपलोड करें\n5. सदस्य जोड़ने के लिए Save करें",
                    
                    "डेटा कैसे एक्सपोर्ट करें": "डेटा एक्सपोर्ट करने के लिए:\n1. संबंधित पेज पर जाएं (Members, Fees, Expenses, आदि)\n2. 'Export' बटन पर क्लिक करें\n3. फॉर्मेट चुनें (CSV या PDF)\n4. फाइल स्वचालित रूप से डाउनलोड हो जाएगी\n\nआप Members लिस्ट, Fee रिकॉर्ड, Expenses और Reports एक्सपोर्ट कर सकते हैं!",
                    
                    "एक्सपोर्ट": "आप इन पेजों से डेटा एक्सपोर्ट कर सकते हैं:\n• Members पेज → सदस्य सूची CSV के रूप में\n• Fees पेज → भुगतान रिकॉर्ड\n• Expenses पेज → खर्च रिकॉर्ड\n• Reports पेज → विश्लेषण PDF के रूप में\n\nबस किसी भी पेज पर Export बटन क्लिक करें!",
                    
                    "pdf कैसे बनाएं": "PDF बनाने के लिए:\n1. Member Registration - सदस्य कार्ड पर 'Generate PDF' क्लिक करें\n2. Payment Receipts - Receipts पेज पर जाएं, भुगतान चुनें, 'Generate Receipt' क्लिक करें\n3. Reports - Reports पेज से PDF के रूप में एक्सपोर्ट करें\n\nसभी PDFs तुरंत बनाए जाते हैं!",
                    
                    "pdf": "PDF बनाने के लिए:\n• Members के लिए: सदस्य कार्ड पर 'Generate PDF' बटन क्लिक करें\n• Receipts के लिए: Receipts पेज पर जाएं और भुगतान चुनें\n• Reports के लिए: Reports सेक्शन में Export विकल्प का उपयोग करें\n\nPDFs आपके लाइब्रेरी ब्रांडिंग के साथ बनाए जाते हैं!",
                    
                    "बैकअप कैसे रिस्टोर करें": "बैकअप रिस्टोर करने के लिए:\n1. Settings पेज पर जाएं\n2. 'Backup & Restore' सेक्शन तक स्क्रॉल करें\n3. 'Restore from Telegram' या 'Import Data' पर क्लिक करें\n4. बैकअप फाइल चुनें\n5. 'Restore' पर क्लिक करें\n\nआपका सभी डेटा बैकअप से रिस्टोर हो जाएगा!",
                    
                    "बैकअप": "Settings पेज से बैकअप रिस्टोर करें:\n• क्लाउड बैकअप के लिए 'Restore from Telegram' क्लिक करें\n• या लोकल बैकअप के लिए 'Import Data' का उपयोग करें\n• अपनी बैकअप फाइल चुनें और कन्फर्म करें\n• सभी डेटा सुरक्षित रूप से रिस्टोर हो जाएगा",
                    
                    "telegram इंटीग्रेशन": "Telegram Integration आपको अनुमति देता है:\n1. तुरंत नोटिफिकेशन प्राप्त करें\n2. क्लाउड में डेटा बैकअप करें (सुरक्षित स्टोरेज)\n3. भुगतान अलर्ट प्राप्त करें\n4. सदस्य फोटो और दस्तावेज़ स्टोर करें\n\nSettings → Telegram Integration में सेटअप करें:\n1. Telegram Bot बनाएं (@BotFather)\n2. Bot Token और Chat ID प्राप्त करें\n3. उन्हें Settings में दर्ज करें\n4. Save करें और कनेक्शन टेस्ट करें!",
                    
                    "telegram": "Telegram Integration की विशेषताएं:\n• भुगतान के लिए रीयल-टाइम नोटिफिकेशन\n• डेटा का स्वचालित क्लाउड बैकअप\n• सदस्य फोटो के लिए सुरक्षित स्टोरेज\n• भुगतान रिमाइंडर और अलर्ट\n\nइसे Settings पेज में कॉन्फ़िगर करें!",
                    
                    "सीट कैसे असाइन करें": "सदस्य को सीट असाइन करने के लिए:\n1. Seats पेज पर जाएं\n2. उपलब्ध (हरी) सीट पर क्लिक करें\n3. ड्रॉपडाउन से सदस्य चुनें\n4. 'Assign Seat' पर क्लिक करें\n\nया Members पेज से:\n1. सदस्य विवरण संपादित करें\n2. सीट नंबर चुनें\n3. परिवर्तन सहेजें",
                    
                    "सीट": "सीट प्रबंधन:\n• हरी सीट = उपलब्ध\n• पीली सीट = व्यस्त\n• असाइन/अनसाइन करने के लिए किसी भी सीट पर क्लिक करें\n• Settings में कुल सीटें बदलें\n\nसीट आवंटन प्रबंधित करने के लिए Seats पेज पर जाएं!",
                    
                    "फीस जमा": "फीस जमा करने के लिए:\n1. Fees पेज पर जाएं\n2. सदस्य खोजें\n3. 'Mark as Paid' पर क्लिक करें\n4. भुगतान राशि और तारीख दर्ज करें\n5. 'Save Payment' पर क्लिक करें\n\nरसीद स्वचालित रूप से बन जाएगी!",
                    
                    "भुगतान": "भुगतान रिकॉर्ड करने के लिए:\n1. Fees पेज पर जाएं\n2. लंबित फीस वाला सदस्य खोजें\n3. 'Mark as Paid' बटन क्लिक करें\n4. भुगतान विवरण कन्फर्म करें\n5. Receipts पेज से रसीद बनाएं",
                    
                    "किताब प्रबंधन": "किताबों का प्रबंधन करने के लिए:\n1. Books पेज पर जाएं\n2. नई किताबें जोड़ने के लिए 'Add Book' क्लिक करें\n3. किताब जारी करें: किताब चुनें, सदस्य चुनें, वापसी तिथि सेट करें\n4. किताब वापस करें: 'Mark as Returned' क्लिक करें\n5. देरी से लौटाई गई किताबों और जुर्माने को स्वचालित रूप से ट्रैक करें!",
                    
                    "किताब": "किताब की विशेषताएं:\n• ISBN और विवरण के साथ नई किताबें जोड़ें\n• सदस्यों को किताबें जारी करें\n• वापसी तिथियों को ट्रैक करें\n• देरी से लौटाई गई किताबों के लिए स्वचालित जुर्माना गणना\n• किताब का इतिहास और उपलब्धता देखें",
                    
                    "रिपोर्ट": "व्यापक रिपोर्ट देखें:\n• राजस्व बनाम व्यय रुझान\n• मासिक फीस संग्रह\n• सीट अधिभोग सांख्यिकी\n• सदस्य वृद्धि चार्ट\n• श्रेणी के अनुसार व्यय विवरण\n\nसभी रिपोर्ट चार्ट के साथ इंटरैक्टिव हैं!",
                    
                    "विश्लेषण": "विश्लेषण सुविधाएं:\n• दृश्य चार्ट और ग्राफ\n• मासिक राजस्व ट्रैकिंग\n• व्यय वर्गीकरण\n• सदस्य सांख्यिकी\n• PDF के रूप में रिपोर्ट एक्सपोर्ट करें\n\nReports पेज से एक्सेस करें!",
                    
                    "पासवर्ड भूल गए": "पासवर्ड रीसेट करने के लिए:\n1. Settings पेज पर जाएं\n2. 'Account' सेक्शन तक स्क्रॉल करें\n3. 'Change Password' पर क्लिक करें\n4. वर्तमान और नया पासवर्ड दर्ज करें\n5. 'Update Password' पर क्लिक करें\n\nअपना नया पासवर्ड याद रखना सुनिश्चित करें!",
                    
                    "पासवर्ड": "Settings से अपना पासवर्ड बदलें:\n• Settings पेज पर जाएं\n• Account सेक्शन खोजें\n• पुराना और नया पासवर्ड दर्ज करें\n• परिवर्तन सहेजें\n\nडिफ़ॉल्ट पासवर्ड 'admin123' है",
                    
                    "गतिविधि लॉग": "Activity Log दिखाता है:\n• सभी सदस्य जोड़/अपडेट\n• फीस भुगतान\n• किताब जारी और वापसी\n• व्यय प्रविष्टियां\n• टाइमस्टैम्प के साथ सिस्टम गतिविधियां\n\nसभी ऑपरेशन ट्रैक करने के लिए Activity पेज से देखें!",
                    
                    "सेटिंग्स": "Settings आपको अनुमति देती है:\n• लाइब्रेरी नाम कॉन्फ़िगर करें\n• कुल सीटें सेट करें\n• डिफ़ॉल्ट जुर्माना राशि प्रबंधित करें\n• किताब वापसी के दिन सेट करें\n• Telegram इंटीग्रेशन कॉन्फ़िगर करें\n• स्वचालित बैकअप सक्षम करें\n• पासवर्ड बदलें\n• लाइब्रेरी सेटिंग्स कस्टमाइज करें",
                    
                    "खर्च": "खर्च जोड़ने के लिए:\n1. Expenses पेज पर जाएं\n2. 'Add Expense' पर क्लिक करें\n3. श्रेणी चुनें (Utilities, Maintenance, आदि)\n4. राशि और विवरण दर्ज करें\n5. तारीख सेट करें और सहेजें\n\nसभी लाइब्रेरी खर्चों को आसानी से ट्रैक करें!",
                    
                    "सिस्टम की सुविधाएं क्या हैं": "🎯 पूर्ण सिस्टम सुविधाएं:\n\n📊 डैशबोर्ड:\n• रीयल-टाइम सांख्यिकी और मेट्रिक्स\n• कुल सदस्य, सीट, राजस्व\n• हाल की गतिविधि फ़ीड\n• त्वरित कार्रवाई बटन\n• लाभ/हानि ट्रैकिंग\n\n👥 सदस्य प्रबंधन:\n• सदस्य जोड़ें/संपादित/हटाएं\n• कैमरा से फोटो कैप्चर\n• Telegram पर ID प्रूफ अपलोड\n• प्रोफेशनल 3-पेज PDF जनरेशन\n• सदस्य स्थिति ट्रैकिंग (सक्रिय/निष्क्रिय)\n• सीट असाइनमेंट\n• एडवांस भुगतान समर्थन\n• CSV एक्सपोर्ट\n\n🪑 सीट प्रबंधन:\n• विज़ुअल ग्रिड लेआउट\n• कलर-कोडेड स्थिति (हरा=उपलब्ध, पीला=व्यस्त)\n• रीयल-टाइम उपलब्धता\n• बल्क सीट ऑपरेशन\n• निष्क्रिय सदस्यों के लिए ऑटो सीट रिलीज\n\n📚 किताब प्रबंधन:\n• किताब इन्वेंटरी ट्रैकिंग\n• जारी/वापसी कार्यक्षमता\n• ऑटो जुर्माना के साथ देरी ट्रैकिंग\n• स्टॉक अलर्ट\n• किताब इतिहास\n• ISBN समर्थन\n\n💰 फीस प्रबंधन:\n• स्वचालित मासिक फीस जनरेशन\n• मल्टी-महीना एडवांस भुगतान\n• भुगतान स्थिति ट्रैकिंग\n• रसीद जनरेशन\n• WhatsApp रसीद शेयरिंग\n• CSV एक्सपोर्ट\n\n💵 खर्च प्रबंधन:\n• खर्च वर्गीकरण\n• मासिक/वार्षिक ट्रैकिंग\n• श्रेणी-वार विश्लेषण\n\n📈 रिपोर्ट और विश्लेषण:\n• राजस्व बनाम खर्च चार्ट (6 महीने)\n• श्रेणी-वार खर्च विवरण\n• किताब स्थिति विज़ुअलाइज़ेशन\n• भुगतान संग्रह दर\n• मासिक राजस्व तुलना (12 महीने)\n• इंटरैक्टिव चार्ट\n• PDF एक्सपोर्ट\n\n🧾 रसीदें:\n• भुगतान इतिहास टाइमलाइन\n• PDF रसीद जनरेशन\n• WhatsApp शेयरिंग\n• तारीख फ़िल्टर\n\n📝 गतिविधि लॉग:\n• पूर्ण ऑडिट ट्रेल\n• सभी सिस्टम क्रियाएं लॉग\n• प्रकार और तारीख से फ़िल्टर\n\n⚙️ सेटिंग्स:\n• लाइब्रेरी नाम कस्टमाइज़ेशन\n• कुल सीट कॉन्फ़िगरेशन\n• डिफ़ॉल्ट जुर्माना राशि\n• Telegram इंटीग्रेशन\n• ऑटो बैकअप शेड्यूलिंग\n\n🔄 ऑटो बैकअप:\n• निर्धारित बैकअप (दैनिक/साप्ताहिक/मासिक)\n• JSON एक्सपोर्ट\n• Telegram डिलीवरी\n• रिस्टोर कार्यक्षमता\n\n📱 TELEGRAM इंटीग्रेशन:\n• रीयल-टाइम नोटिफिकेशन\n• भुगतान अलर्ट\n• क्लाउड बैकअप\n• फोटो/ID स्टोरेज\n\nयह सिस्टम 100% क्लाइंट-साइड है!",
                    
                    "सुविधाएं": "हमारे Library Management System में शामिल:\n\n✅ पूर्ण सदस्य प्रबंधन\n✅ स्मार्ट सीट आवंटन\n✅ किताब जारी/वापसी सिस्टम\n✅ स्वचालित फीस संग्रह\n✅ खर्च ट्रैकिंग\n✅ उन्नत रिपोर्ट और चार्ट\n✅ PDF और CSV एक्सपोर्ट\n✅ Telegram इंटीग्रेशन\n✅ ऑटो बैकअप सिस्टम\n✅ गतिविधि लॉगिंग\n✅ WhatsApp शेयरिंग\n✅ फोटो और ID अपलोड\n✅ डार्क/लाइट थीम\n✅ मोबाइल रिस्पॉन्सिव\n✅ 100% ऑफलाइन रेडी\n\nशुद्ध HTML, CSS और JavaScript से निर्मित!",
                    
                    "फोटो कैसे अपलोड करें": "सदस्य फोटो अपलोड करने के लिए:\n\n📸 तरीका 1 - कैमरा कैप्चर:\n1. Members पेज पर जाएं\n2. 'Add Member' या मौजूदा संपादित करें\n3. 'Capture Photo' बटन क्लिक करें\n4. कैमरा एक्सेस की अनुमति दें\n5. फोटो लें और सहेजें\n\n📁 तरीका 2 - फ़ाइल अपलोड:\n1. 'Upload Photo' बटन क्लिक करें\n2. डिवाइस से इमेज चुनें\n3. फोटो प्रदर्शित होगी\n4. सदस्य सहेजें\n\n🔐 सुरक्षित स्टोरेज:\n• फोटो LocalStorage में संग्रहीत\n• Telegram कॉन्फ़िगर होने पर ऑटो-अपलोड\n• सुरक्षित क्लाउड बैकअप\n• सदस्य कार्ड और PDF पर दिखाई देती है!",
                    
                    "फोटो अपलोड": "सदस्य फोटो आसानी से अपलोड करें:\n• कैमरा से लाइव कैप्चर\n• या डिवाइस से अपलोड\n• स्थानीय रूप से संग्रहीत\n• Telegram पर ऑटो बैकअप\n• सदस्य कार्ड और PDF पर दिखाई देता है!",
                    
                    "whatsapp पर रसीद कैसे भेजें": "WhatsApp पर रसीद शेयर करने के लिए:\n\n1. Receipts पेज पर जाएं\n2. ड्रॉपडाउन से सदस्य चुनें\n3. इतिहास में भुगतान खोजें\n4. 'Generate Receipt' बटन क्लिक करें\n5. PDF रसीद बनेगी\n6. 'Share on WhatsApp' बटन क्लिक करें\n7. WhatsApp पहले से भरे संदेश के साथ खुलेगा\n8. संपर्क चुनें और भेजें!\n\n📱 सुविधाएं:\n• प्रोफेशनल PDF रसीदें\n• लाइब्रेरी ब्रांडिंग शामिल\n• भुगतान विवरण और तारीख\n• डायरेक्ट WhatsApp शेयरिंग\n\nसदस्यों को तुरंत भुगतान पुष्टि मिलती है!",
                    
                    "whatsapp": "WhatsApp सुविधाएं:\n• भुगतान रसीदें तुरंत शेयर करें\n• प्रोफेशनल PDF फॉर्मेट\n• Receipts पेज से सीधे\n• वन-क्लिक शेयरिंग\n• सदस्यों को तुरंत पुष्टि\n\nरसीद विवरण मैन्युअल रूप से टाइप करने की ज़रूरत नहीं!",
                    
                    "auto backup कैसे चालू करें": "Auto Backup सक्षम करने के लिए:\n\n1. Settings पेज पर जाएं\n2. 'Auto Backup' सेक्शन तक स्क्रॉल करें\n3. 'Enable Auto Backup' ON करें\n4. बैकअप अंतराल चुनें:\n   • Daily - हर 24 घंटे\n   • Weekly - हर 7 दिन\n   • Monthly - हर 30 दिन\n   • Custom - अपना समय सेट करें\n5. वैकल्पिक: 'Send to Telegram' सक्षम करें\n6. 'Save Settings' क्लिक करें\n\n🔄 ऑटो बैकअप सुविधाएं:\n• स्वचालित निर्धारित बैकअप\n• JSON फॉर्मेट एक्सपोर्ट\n• Telegram क्लाउड डिलीवरी\n• मिस्ड बैकअप रिकवरी\n• किसी भी समय मैन्युअल बैकअप\n• वन-क्लिक रिस्टोर\n\n💾 बैकअप में शामिल:\n• सभी सदस्य डेटा\n• फीस रिकॉर्ड\n• किताब इन्वेंटरी\n• खर्च रिकॉर्ड\n• गतिविधि लॉग\n• सेटिंग्स\n\nअपना लाइब्रेरी डेटा कभी न खोएं!",
                    
                    "ऑटो बैकअप": "ऑटो बैकअप सिस्टम:\n• स्वचालित बैकअप शेड्यूल करें\n• दैनिक, साप्ताहिक, मासिक अंतराल\n• JSON फॉर्मेट एक्सपोर्ट\n• वैकल्पिक Telegram डिलीवरी\n• किसी भी समय रिस्टोर\n• मिस्ड बैकअप अलर्ट\n\nSettings → Auto Backup सेक्शन में कॉन्फ़िगर करें!",
                    
                    "telegram कैसे सेटअप करें": "पूर्ण Telegram सेटअप गाइड:\n\n📱 चरण 1 - Telegram Bot बनाएं:\n1. Telegram ऐप खोलें\n2. '@BotFather' खोजें\n3. चैट शुरू करें और /newbot भेजें\n4. बॉट नाम दर्ज करें (जैसे, MyLibraryBot)\n5. यूज़रनेम दर्ज करें (जैसे, mylibrary_bot)\n6. Bot Token कॉपी करें (लंबा स्ट्रिंग)\n\n💬 चरण 2 - Chat ID प्राप्त करें:\n1. Telegram में '@userinfobot' खोजें\n2. चैट शुरू करें\n3. बॉट आपका Chat ID दिखाएगा\n4. Chat ID नंबर कॉपी करें\n\n⚙️ चरण 3 - सिस्टम कॉन्फ़िगर करें:\n1. Settings पेज पर जाएं\n2. 'Telegram Integration' सेक्शन खोजें\n3. Bot Token पेस्ट करें\n4. Chat ID पेस्ट करें\n5. 'Save Settings' क्लिक करें\n6. 'Test Connection' क्लिक करें\n7. टेस्ट मैसेज के लिए Telegram चेक करें\n\n✅ आपको मिलेगा:\n• भुगतान नोटिफिकेशन\n• सदस्य जोड़ने के अलर्ट\n• क्लाउड पर ऑटो बैकअप\n• फोटो/ID सुरक्षित स्टोरेज\n• रीयल-टाइम अपडेट\n\n🔒 100% सुरक्षित और निजी!",
                    
                    "telegram सेटअप": "त्वरित Telegram सेटअप:\n1. @BotFather से बॉट बनाएं\n2. @userinfobot से Chat ID प्राप्त करें\n3. Settings में दोनों दर्ज करें\n4. कनेक्शन टेस्ट करें\n5. नोटिफिकेशन प्राप्त करना शुरू करें!\n\nTelegram क्लाउड बैकअप और रीयल-टाइम अलर्ट सक्षम करता है!",
                    
                    "सीट कैसे प्रबंधित करें": "पूर्ण सीट प्रबंधन:\n\n🪑 सीट असाइन करें:\n1. Seats पेज पर जाएं\n2. हरी (उपलब्ध) सीट क्लिक करें\n3. ड्रॉपडाउन से सदस्य चुनें\n4. 'Assign Seat' क्लिक करें\n\nया Members पेज से:\n1. सदस्य संपादित करें\n2. 'Select Seat' बटन क्लिक करें\n3. उपलब्ध सीट चुनें\n4. परिवर्तन सहेजें\n\n🔓 सीट मुक्त करें:\n1. Seats पेज पर जाएं\n2. पीली (व्यस्त) सीट क्लिक करें\n3. सदस्य विवरण देखें\n4. 'Free Seat' क्लिक करें\n5. कार्रवाई की पुष्टि करें\n\n📊 सीट सुविधाएं:\n• हरा = उपलब्ध\n• पीला = व्यस्त\n• विज़ुअल ग्रिड लेआउट\n• रीयल-टाइम स्थिति\n• निष्क्रिय सदस्यों के लिए ऑटो-रिलीज़\n• स्थिति से फ़िल्टर करें\n\n💡 टिप: Settings पेज में कुल सीटें बदली जा सकती हैं!",
                    
                    "सीट प्रबंधन": "सीट प्रबंधन:\n• कलर कोड के साथ विज़ुअल ग्रिड\n• Seats या Members पेज से असाइन करें\n• रीयल-टाइम उपलब्धता\n• सीटें मुक्त/अनअसाइन करें\n• निष्क्रिय के लिए ऑटो-रिलीज़\n• Settings में कुल कॉन्फ़िगर करें!",
                    
                    "फीस कैसे जमा करें": "पूर्ण फीस संग्रह प्रक्रिया:\n\n💰 स्वचालित फीस जनरेशन:\n• सिस्टम मासिक फीस ऑटो-जेनरेट करता है\n• सदस्य शामिल होने की तारीख के आधार पर\n• मल्टी-महीना एडवांस समर्थन\n\n💵 भुगतान मार्क करें:\n1. Fees पेज पर जाएं\n2. सदस्य खोजें (सर्च/फ़िल्टर उपयोग करें)\n3. लंबित फीस देखें (लाल बैज)\n4. 'Mark as Paid' क्लिक करें\n5. राशि और तारीख सत्यापित करें\n6. 'Confirm Payment' क्लिक करें\n7. फीस स्थिति → Paid (हरा)\n\n🧾 भुगतान के बाद:\n• रसीद ऑटो-जेनरेट\n• Receipts पेज में देखें\n• PDF रसीद बनाएं\n• WhatsApp पर शेयर करें\n• Telegram नोटिफिकेशन भेजा गया\n• गतिविधि लॉग की गई\n\n💡 सुविधाएं:\n• ऑटो फीस जनरेशन\n• भुगतान ट्रैकिंग\n• CSV एक्सपोर्ट\n• स्थिति से फ़िल्टर करें\n• मासिक रिपोर्ट!",
                    
                    "फीस जमा करें": "फीस संग्रह:\n1. सिस्टम मासिक फीस ऑटो-जेनरेट करता है\n2. Fees पेज से Paid मार्क करें\n3. रसीद ऑटो-जेनरेट\n4. WhatsApp पर शेयर करें\n5. Reports में ट्रैक करें\n\nएडवांस मल्टी-महीना भुगतान का समर्थन करता है!",
                    
                    "रिपोर्ट कैसे देखें": "पूर्ण रिपोर्ट और विश्लेषण:\n\n📈 उपलब्ध रिपोर्ट:\n\n1. राजस्व बनाम खर्च रुझान (6 महीने)\n   • लाइन चार्ट विज़ुअलाइज़ेशन\n   • मासिक तुलना\n   • लाभ ट्रैकिंग\n\n2. खर्च श्रेणी विवरण\n   • पाई चार्ट डिस्प्ले\n   • श्रेणी-वार खर्च\n\n3. किताब स्थिति\n   • उपलब्ध बनाम जारी\n   • देरी ट्रैकिंग\n   • डोनट चार्ट\n\n4. भुगतान संग्रह दर\n   • Paid बनाम Pending\n   • संग्रह दक्षता\n   • बार चार्ट\n\n5. मासिक राजस्व (12 महीने)\n   • वार्षिक अवलोकन\n   • महीने-दर-महीने राजस्व\n\n6. महीने-दर-महीने तुलना\n   • वर्तमान बनाम पिछला महीना\n   • राजस्व, खर्च, लाभ\n\n📊 कैसे देखें:\n1. साइडबार में 'Reports' क्लिक करें\n2. एक पेज पर सभी चार्ट देखें\n3. इंटरैक्टिव चार्ट (विवरण के लिए होवर करें)\n4. PDF/CSV के रूप में एक्सपोर्ट करें\n\n💡 सभी चार्ट आपके डेटा के आधार पर रीयल-टाइम अपडेट होते हैं!",
                    
                    "रिपोर्ट देखें": "रिपोर्ट देखें:\n• राजस्व बनाम खर्च रुझान\n• श्रेणी-वार खर्च\n• किताब स्थिति चार्ट\n• भुगतान संग्रह दर\n• मासिक तुलना\n• इंटरैक्टिव विज़ुअलाइज़ेशन\n• PDF/CSV में एक्सपोर्ट\n\nसाइडबार में Reports पेज से एक्सेस करें!",
                    
                    "किताब कैसे जोड़ें": "पूर्ण किताब प्रबंधन:\n\n📚 किताब जोड़ें:\n1. Books पेज पर जाएं\n2. 'Add Book' बटन क्लिक करें\n3. विवरण भरें:\n   • किताब का शीर्षक\n   • लेखक का नाम\n   • ISBN (वैकल्पिक)\n   • श्रेणी\n   • मात्रा/स्टॉक\n   • खरीद तारीख\n4. 'Save Book' क्लिक करें\n\n📖 किताब जारी करें:\n1. सूची में किताब खोजें\n2. 'Issue Book' क्लिक करें\n3. सदस्य चुनें\n4. वापसी तारीख सेट करें\n5. 'Confirm Issue' क्लिक करें\n\n📥 किताब वापस करें:\n1. जारी किताब खोजें\n2. 'Mark as Returned' क्लिक करें\n3. सिस्टम नियत तारीख जांचता है\n4. ऑटो-जुर्माना गणना (यदि देर से)\n\n⚠️ देरी प्रबंधन:\n• ऑटो-ट्रैक देरी से किताबें\n• जुर्माना गणना (Settings के आधार पर)\n• देरी अलर्ट\n\n📊 किताब सुविधाएं:\n• स्टॉक ट्रैकिंग\n• कम स्टॉक अलर्ट\n• जारी इतिहास\n• शीर्षक/लेखक/ISBN से खोजें\n• CSV एक्सपोर्ट\n\n💡 Settings पेज में डिफ़ॉल्ट जुर्माना राशि सेट करें!",
                    
                    "किताब जोड़ें": "किताब प्रबंधन:\n• पूर्ण विवरण के साथ किताबें जोड़ें\n• सदस्यों को जारी करें\n• वापसी तारीख ट्रैक करें\n• ऑटो जुर्माना गणना\n• देरी अलर्ट\n• स्टॉक प्रबंधन\n• डेटा एक्सपोर्ट करें\n\nइन्वेंट्री प्रबंधित करने के लिए Books पेज पर जाएं!",
                    
                    "खर्च कैसे ट्रैक करें": "पूर्ण खर्च ट्रैकिंग:\n\n💵 खर्च जोड़ें:\n1. Expenses पेज पर जाएं\n2. 'Add Expense' क्लिक करें\n3. विवरण भरें:\n   • श्रेणी (Utilities, Maintenance, Salaries, आदि)\n   • राशि (₹)\n   • विवरण\n   • तारीख\n4. 'Save Expense' क्लिक करें\n\n📊 खर्च श्रेणियां:\n• उपयोगिताएं (बिजली, पानी)\n• रखरखाव और मरम्मत\n• वेतन\n• किताबें खरीद\n• स्टेशनरी\n• किराया\n• इंटरनेट और फोन\n• विविध\n\n📈 खर्च देखें:\n• मासिक कुल\n• श्रेणी-वार विवरण\n• तारीख सीमा फ़िल्टर\n• खोज कार्यक्षमता\n• CSV में एक्सपोर्ट करें\n\n💡 रिपोर्ट एकीकरण:\n• Reports में खर्च चार्ट\n• राजस्व बनाम खर्च तुलना\n• लाभ गणना\n• श्रेणी-वार पाई चार्ट\n\nलाइब्रेरी पर खर्च किया गया हर रुपया ट्रैक करें!",
                    
                    "खर्च ट्रैक करें": "खर्च ट्रैकिंग:\n• श्रेणियों के साथ खर्च जोड़ें\n• मासिक/वार्षिक दृश्य\n• श्रेणी-वार विश्लेषण\n• फ़िल्टर और खोजें\n• CSV में एक्सपोर्ट करें\n• Reports चार्ट में देखें\n\nट्रैक करने के लिए Expenses पेज पर जाएं!",
                    
                    "डैशबोर्ड": "डैशबोर्ड अवलोकन:\n\n📊 रीयल-टाइम सांख्यिकी:\n• कुल सदस्य संख्या\n• सक्रिय सदस्य\n• कुल सीटें\n• व्यस्त सीटें\n• उपलब्ध सीटें\n• कुल राजस्व (₹)\n• मासिक राजस्व\n• कुल खर्च\n• लाभ/हानि\n• जारी किताबें\n• लंबित भुगतान\n\n⚡ त्वरित क्रियाएं:\n• नया सदस्य जोड़ें\n• फीस भुगतान रिकॉर्ड करें\n• किताब जारी करें\n• खर्च जोड़ें\n• रिपोर्ट देखें\n\n📝 हाल की गतिविधि:\n• अंतिम 10 गतिविधियां\n• सदस्य जोड़\n• प्राप्त भुगतान\n• जारी/लौटाई गई किताबें\n• रीयल-टाइम अपडेट\n\n💡 डैशबोर्ड आपका नियंत्रण केंद्र है!",
                    
                    "शुरुआत कैसे करें": "शुरुआत गाइड:\n\n🎯 प्रारंभिक सेटअप:\n1. डिफ़ॉल्ट क्रेडेंशियल से लॉगिन करें\n   • Username: admin\n   • Password: admin123\n2. Settings में पासवर्ड बदलें\n3. लाइब्रेरी नाम सेट करें\n4. कुल सीटें कॉन्फ़िगर करें\n5. डिफ़ॉल्ट जुर्माना राशि सेट करें\n\n👥 अपना पहला सदस्य जोड़ें:\n1. Members पेज पर जाएं\n2. 'Add Member' क्लिक करें\n3. बुनियादी विवरण भरें\n4. वैकल्पिक रूप से फोटो कैप्चर करें\n5. सीट असाइन करें\n6. सदस्य सहेजें\n\n⚙️ Telegram कॉन्फ़िगर करें (वैकल्पिक):\n1. @BotFather से बॉट बनाएं\n2. Chat ID प्राप्त करें\n3. Settings में दर्ज करें\n\n🔄 Auto Backup सक्षम करें:\n1. Settings पर जाएं\n2. Auto Backup चालू करें\n3. शेड्यूल सेट करें\n\n💰 फीस जमा करना शुरू करें:\n1. सिस्टम फीस ऑटो-जेनरेट करता है\n2. भुगतान को प्राप्त के रूप में मार्क करें\n3. रसीदें बनाएं\n\nआप तैयार हैं! 🎉",
                    
                    "समस्या निवारण": "सामान्य समस्याएं और समाधान:\n\n❌ समस्या: लॉगिन नहीं कर सकते\n✅ समाधान: डिफ़ॉल्ट उपयोग करें - username: admin, password: admin123\n\n❌ समस्या: डेटा सहेज नहीं रहा\n✅ समाधान: जांचें कि ब्राउज़र LocalStorage अक्षम नहीं है। कैश साफ़ करें।\n\n❌ समस्या: Telegram काम नहीं कर रहा\n✅ समाधान:\n  • Bot Token सही है यह सत्यापित करें\n  • Chat ID सटीक है जांचें\n  • पहले अपने बॉट के साथ चैट शुरू करें\n  • Settings में 'Test Connection' क्लिक करें\n\n❌ समस्या: फोटो अपलोड नहीं हो रही\n✅ समाधान: ब्राउज़र में कैमरा अनुमति दें। फ़ाइल साइज़ जांचें (<5MB)।\n\n❌ समस्या: PDF नहीं बन रहा\n✅ समाधान: इस साइट के लिए पॉपअप ब्लॉकर अक्षम करें।\n\n❌ समस्या: सीटें नहीं दिख रही\n✅ समाधान: Seats पेज से सीट इनिशियलाइज़ करें या Settings में कुल सेट करें।\n\n💡 अभी भी समस्याएं हैं? डेवलपर से संपर्क करें!",
                    
                    "default": "मैं मदद के लिए यहां हूं! आप मुझसे इन विषयों के बारे में पूछ सकते हैं:\n\n👥 सदस्य: जोड़ना, संपादित करना, फोटो, ID प्रूफ\n🪑 सीट: असाइनमेंट, प्रबंधन, उपलब्धता\n📚 किताबें: जोड़ना, जारी करना, वापसी, जुर्माना\n💰 फीस: संग्रह, एडवांस भुगतान, रसीदें\n💵 खर्च: ट्रैकिंग, श्रेणियां, रिपोर्ट\n📊 रिपोर्ट: चार्ट, विश्लेषण, एक्सपोर्ट\n📱 TELEGRAM: सेटअप, नोटिफिकेशन, बैकअप\n🔄 बैकअप: ऑटो बैकअप, रिस्टोर, एक्सपोर्ट\n🧾 रसीदें: PDF जनरेशन, WhatsApp शेयर\n📝 गतिविधि: लॉग देखना, ट्रैकिंग\n⚙️ सेटिंग्स: कॉन्फ़िगरेशन, पासवर्ड, कस्टमाइज़ेशन\n🎯 सुविधाएं: पूर्ण सिस्टम अवलोकन\n❓ मदद: समस्या निवारण, शुरुआत करना\n\nआप क्या जानना चाहेंगे? बस अपना सवाल टाइप करें!"
                }
            }
        };
    }

    findBestMatch(query) {
        const lang = this.currentLanguage;
        const responses = this.knowledgeBase[lang].responses;
        const lowerQuery = query.toLowerCase();
        
        // Exact match
        if (responses[lowerQuery]) {
            return responses[lowerQuery];
        }
        
        // Partial match
        for (let key in responses) {
            if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
                return responses[key];
            }
        }
        
        // Keywords matching
        const keywords = {
            en: {
                member: ["member", "add member", "new member", "register"],
                seat: ["seat", "assign", "allocation", "chair"],
                book: ["book", "issue", "return", "library"],
                fee: ["fee", "payment", "collect", "money"],
                export: ["export", "download", "csv", "save"],
                pdf: ["pdf", "generate", "print", "receipt"],
                backup: ["backup", "restore", "save", "recovery"],
                telegram: ["telegram", "notification", "bot", "integration"],
                report: ["report", "analytics", "chart", "statistics"],
                password: ["password", "login", "forgot", "reset"],
                expense: ["expense", "cost", "spending", "expenditure"]
            },
            hi: {
                member: ["सदस्य", "मेंबर", "नया", "जोड़"],
                seat: ["सीट", "कुर्सी", "असाइन", "आवंटन"],
                book: ["किताब", "पुस्तक", "जारी", "वापस"],
                fee: ["फीस", "भुगतान", "पैसा", "शुल्क"],
                export: ["एक्सपोर्ट", "डाउनलोड", "सेव"],
                pdf: ["पीडीएफ", "pdf"],
                backup: ["बैकअप", "रिस्टोर", "पुनर्स्थापना"],
                telegram: ["टेलीग्राम", "telegram", "नोटिफिकेशन"],
                report: ["रिपोर्ट", "विश्लेषण", "चार्ट"],
                password: ["पासवर्ड", "लॉगिन", "भूल"],
                expense: ["खर्च", "व्यय", "लागत"]
            }
        };
        
        const langKeywords = keywords[lang];
        
        for (let category in langKeywords) {
            for (let keyword of langKeywords[category]) {
                if (lowerQuery.includes(keyword)) {
                    // Find response with this category
                    for (let key in responses) {
                        if (key.includes(category) || responses[key].toLowerCase().includes(category)) {
                            return responses[key];
                        }
                    }
                }
            }
        }
        
        return responses.default;
    }

    getResponse(message) {
        return this.findBestMatch(message);
    }
}

// Initialize chatbot
const chatbot = new LibraryChatbot();
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const langToggle = document.getElementById('langToggle');

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
    chatbotToggle.style.display = 'none';
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
    chatbotToggle.style.display = 'flex';
});

// Language selection
document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        chatbot.currentLanguage = lang;
        
        // Clear messages
        chatbotMessages.innerHTML = '';
        
        // Add welcome message
        addBotMessage(chatbot.knowledgeBase[lang].welcome);
        
        // Add quick questions
        addQuickQuestions();
        
        // Enable input
        chatbotInput.disabled = false;
        chatbotSend.disabled = false;
        chatbotInput.focus();
        
        // Update placeholder
        chatbotInput.placeholder = lang === 'en' ? 'Type your question...' : 'अपना सवाल लिखें...';
    });
});

// Language toggle button
langToggle.addEventListener('click', () => {
    if (!chatbot.currentLanguage) return;
    
    const newLang = chatbot.currentLanguage === 'en' ? 'hi' : 'en';
    chatbot.currentLanguage = newLang;
    
    addBotMessage(chatbot.knowledgeBase[newLang].languageChanged);
    addQuickQuestions();
    
    chatbotInput.placeholder = newLang === 'en' ? 'Type your question...' : 'अपना सवाल लिखें...';
});

// Add bot message
function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Add user message
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Add quick questions
function addQuickQuestions() {
    const lang = chatbot.currentLanguage;
    const questions = chatbot.knowledgeBase[lang].quickQuestions;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${lang === 'en' ? 'Quick questions:' : 'त्वरित प्रश्न:'}</p>
            <div class="quick-questions">
                ${questions.map(q => `<button class="quick-question-btn" data-question="${q}">${q}</button>`).join('')}
            </div>
        </div>
    `;
    chatbotMessages.appendChild(messageDiv);
    
    // Add click handlers to quick questions
    messageDiv.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const question = e.target.dataset.question;
            handleUserMessage(question);
        });
    });
    
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Handle user message
function handleUserMessage(message) {
    if (!message.trim()) return;
    
    addUserMessage(message);
    
    // Get response from chatbot
    setTimeout(() => {
        const response = chatbot.getResponse(message);
        addBotMessage(response);
    }, 500);
    
    chatbotInput.value = '';
}

// Send message
chatbotSend.addEventListener('click', () => {
    handleUserMessage(chatbotInput.value);
});

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage(chatbotInput.value);
    }
});

// Update library name from settings
function updateLibraryName() {
    const settings = storageManager.getSettings();
    const libraryName = settings.libraryName || 'My Library';
    
    document.getElementById('mobileLibraryName').textContent = libraryName;
    document.getElementById('libraryNameSidebar').textContent = libraryName;
}

// Initialize
updateLibraryName();
