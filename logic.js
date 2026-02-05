// 1. Firebase Configuration (गौतम जी की सेटिंग्स)
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

// 2. Firebase Initialize (CDN version for browser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. स्प्लैश स्क्रीन टाइमर
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    }, 2500);
});

// 4. मुख्य गणना (Calculation Logic)
window.calculateNumerology = async function() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;

    if (!name || !dob) {
        alert("कृपया अपना नाम और जन्म तिथि भरें।");
        return;
    }

    const btn = document.getElementById('calcBtn');
    btn.innerText = "गणना हो रही है...";
    btn.disabled = true;

    const [year, month, day] = dob.split('-');

    const mulank = calculateReduction(day);
    const bhagyank = calculateReduction(day + month + year);

    // परिणाम दिखाएं
    document.getElementById('mulank').innerText = mulank;
    document.getElementById('bhagyank').innerText = bhagyank;
    document.getElementById('results').classList.remove('hidden');

    // लोशू ग्रिड अपडेट करें
    fillGrid(day, month, year, mulank, bhagyank);

    // Firebase Firestore में डेटा सेव करें
    try {
        await addDoc(collection(db, "user_queries"), {
            name: name,
            dob: dob,
            mulank: mulank,
            bhagyank: bhagyank,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Firebase Error: ", e);
    }

    btn.innerText = "परिणाम देखें";
    btn.disabled = false;
};

function calculateReduction(numStr) {
    let sum = numStr.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

function fillGrid(d, m, y, mul, bhag) {
    for (let i = 1; i <= 9; i++) {
        document.getElementById('c' + i).innerText = '';
    }
    const allDigits = (d + m + y + mul + bhag).split('');
    allDigits.forEach(digit => {
        if (digit !== '0') {
            const cell = document.getElementById('c' + digit);
            if (cell) {
                cell.innerText += digit;
            }
        }
    });
}

// WhatsApp पर शेयर करने का सिस्टम
window.shareApp = function() {
    const name = document.getElementById('userName').value;
    const m = document.getElementById('mulank').innerText;
    const b = document.getElementById('bhagyank').innerText;
    const text = `अंकदृष्टि (Ankdristi) परिणाम:\nनाम: ${name}\nमूलांक: ${m}\nभाग्यांक: ${b}\nअपना भाग्य देखें: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};

// फ्लोटिंग विजेट (सपोर्ट)
window.contactSupport = function() {
    const msg = encodeURIComponent("नमस्ते गौतम जी, मुझे अंकदृष्टि के बारे में जानकारी चाहिए।");
    window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`, '_blank'); // यहाँ अपना नंबर डालें
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Ankdristi: Service Worker Registered'))
      .catch(err => console.log('Service Worker Error', err));
  });
}

