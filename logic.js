// 1. Firebase Modules को CDN के जरिए इम्पोर्ट करें
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// 2. आपकी असली Firebase कॉन्फ़िगरेशन (जो आपने अभी दी है)
const firebaseConfig = {
  apiKey: "AIzaSyCO7hLYxI8u_SwDRKJbMJayciibHG5sIY4",
  authDomain: "ankdristi.firebaseapp.com",
  projectId: "ankdristi",
  storageBucket: "ankdristi.firebasestorage.app",
  messagingSenderId: "751636757575",
  appId: "1:751636757575:web:2e82e9b97224dd981b8562",
  measurementId: "G-BQ0P1VX5QT"
};

// 3. Firebase को चालू करें
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 4. स्प्लैश स्क्रीन हटाना (4 सेकंड बाद)
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 800);
        }
    }, 4000);
});

// 5. मुख्य कैलकुलेशन फंक्शन
window.calculateNumerology = async function() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;
    const btn = document.getElementById('calcBtn');

    if (!name || !dob) {
        alert("कृपया अपना नाम और जन्म तिथि सही से भरें!");
        return;
    }

    // बटन को डिसेबल करें ताकि बार-बार क्लिक न हो
    btn.disabled = true;
    btn.innerText = "गणना हो रही है...";

    const [year, month, day] = dob.split('-').map(Number);

    // मूलांक और भाग्यांक निकालें
    const mulank = reduceToSingle(day);
    const bhagyank = reduceToSingle(day + month + year);

    // स्क्रीन पर रिजल्ट दिखाएं
    document.getElementById('mulank').innerText = mulank;
    document.getElementById('bhagyank').innerText = bhagyank;
    document.getElementById('results').classList.remove('hidden');

    // लोशू ग्रिड भरें
    fillGrid(day, month, year, mulank, bhagyank);

    // 6. Firebase Firestore में डेटा सेव करना
    try {
        await addDoc(collection(db, "user_queries"), {
            name: name,
            dob: dob,
            mulank: mulank,
            bhagyank: bhagyank,
            timestamp: new Date()
        });
        console.log("Data saved to Firebase!");
    } catch (e) {
        console.error("Firebase Error: ", e);
    } finally {
        btn.disabled = false;
        btn.innerText = "परिणाम देखें";
        // रिजल्ट की तरफ स्मूथ स्क्रॉल करें
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
};

// अंकों को सिंगल डिजिट (1-9) में बदलने का फंक्शन
function reduceToSingle(n) {
    let sum = n;
    while (sum > 9) {
        sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
}

// लोशू ग्रिड भरने का फंक्शन
function fillGrid(d, m, y, mul, bhag) {
    // ग्रिड साफ़ करें
    for (let i = 1; i <= 9; i++) {
        document.getElementById('c' + i).innerText = '';
    }

    // सारे अंकों को एक साथ जोड़ें
    const combinedDigits = (d.toString() + m.toString() + y.toString() + mul.toString() + bhag.toString()).split('');

    combinedDigits.forEach(digit => {
        if (digit !== '0' && document.getElementById('c' + digit)) {
            const cell = document.getElementById('c' + digit);
            cell.innerText += digit; // एक ही खाने में बार-बार अंक जोड़ना (जैसे 99)
        }
    });
}

// WhatsApp पर शेयर करने का फंक्शन
window.shareApp = function() {
    const mul = document.getElementById('mulank').innerText;
    const url = window.location.href;
    const text = `🔮 *Ankdristi App* 🔮\nमेरा मूलांक *${mul}* है। आप भी अपना लोशू ग्रिड और भविष्य फ्री में देखें:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};
