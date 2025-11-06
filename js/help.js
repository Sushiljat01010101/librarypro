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
                    "How to export data?",
                    "How to generate PDF?",
                    "How to restore backup?",
                    "How does Telegram integration work?"
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
                    
                    "default": "I'm here to help! You can ask me about:\n• Adding members\n• Managing seats and books\n• Fee collection and payments\n• Generating PDFs and receipts\n• Exporting data\n• Telegram integration\n• Backup and restore\n• Reports and analytics\n\nWhat would you like to know?"
                }
            },
            hi: {
                welcome: "नमस्ते! मैं आपका लाइब्रेरी असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं?",
                languageChanged: "भाषा हिंदी में बदल दी गई है। मैं आपकी कैसे सहायता कर सकता हूं?",
                quickQuestions: [
                    "सदस्य कैसे जोड़ें?",
                    "डेटा कैसे एक्सपोर्ट करें?",
                    "PDF कैसे बनाएं?",
                    "बैकअप कैसे रिस्टोर करें?",
                    "Telegram इंटीग्रेशन कैसे काम करता है?"
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
                    
                    "default": "मैं मदद के लिए यहां हूं! आप मुझसे इन विषयों के बारे में पूछ सकते हैं:\n• सदस्य जोड़ना\n• सीट और किताबों का प्रबंधन\n• फीस संग्रह और भुगतान\n• PDFs और रसीदें बनाना\n• डेटा एक्सपोर्ट करना\n• Telegram इंटीग्रेशन\n• बैकअप और रिस्टोर\n• रिपोर्ट और विश्लेषण\n\nआप क्या जानना चाहेंगे?"
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
