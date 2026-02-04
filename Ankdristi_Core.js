/**
 * ANKDRISTI - Smart Numerology & FinTech Engine
 * Developer: Gautam Chand Khatri
 * Core Logic: Mulaank 6, Bhaghyaank 9 Compatibility
 */

const AnkdristiEngine = {
    // 1. Chaldean Value Map for Stock & Name Analysis
    chaldeanMap: {
        a:1, i:1, j:1, q:1, y:1,
        b:2, k:2, r:2,
        c:3, g:3, l:3, s:3,
        d:4, m:4, t:4,
        e:5, h:5, n:5, x:5,
        u:6, v:6, w:6,
        o:7, z:7,
        f:8, p:8
    },

    // 2. सिंगल डिजिट (Root Digit) निकालने का फंक्शन
    getSingleDigit: (value) => {
        let num = value.toString().replace(/\D/g, '');
        let sum = [...num].reduce((a, b) => parseInt(a) + parseInt(b), 0);
        while (sum > 9) {
            sum = [...sum.toString()].reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }
        return sum;
    },

    // 3. मोबाइल नंबर डीप एनालिसिस (Frequency & Patterns)
    analyzeMobile: (mobileNumber) => {
        const totalSum = AnkdristiEngine.getSingleDigit(mobileNumber);
        const lastFour = mobileNumber.slice(-4);
        
        // Frequency Counter
        let frequency = {};
        for (let digit of mobileNumber) {
            frequency[digit] = (frequency[digit] || 0) + 1;
        }

        // Special Patterns (Father's Blessing, Legacy)
        const isLegacy = (lastFour === '1009' || lastFour === '1005');
        const hasLaxmiYoga = mobileNumber.includes('69') || mobileNumber.includes('96');

        return {
            totalSum,
            lastFour,
            frequency,
            tags: {
                isLegacy: isLegacy ? "👑 Father's Blessing" : null,
                laxmiYoga: hasLaxmiYoga ? "💰 Laxmi Yoga" : null,
                powerNumber: frequency['6'] >= 3 ? "💎 Luxury Power" : null
            }
        };
    },

    // 4. स्टॉक मार्केट और सेक्टर लॉजिक (FinTech Integration)
    checkStockCompatibility: (stockName, userMulaank = 6) => {
        let nameSum = 0;
        [...stockName.toLowerCase()].forEach(char => {
            if (AnkdristiEngine.chaldeanMap[char]) {
                nameSum += AnkdristiEngine.chaldeanMap[char];
            }
        });
        const stockRoot = AnkdristiEngine.getSingleDigit(nameSum);
        
        // Compatibility Matrix (Friendly Numbers for 6 and 9)
        const friendlyNumbers = [1, 3, 5, 9]; 
        const isCompatible = friendlyNumbers.includes(stockRoot);

        return {
            stockName,
            stockRoot,
            compatibility: isCompatible ? "🚀 High Potential" : "⚠️ Average Match",
            score: isCompatible ? 95 : 60
        };
    },

    // 5. मास्टर कैलकुलेटर (Growth, Business, Family)
    getLifeAspectScore: (mobileSum, mulaank = 6, bhaghyaank = 9) => {
        // Example Logic: If sum matches Mulaank or Bhaghyaank
        const scores = {
            business: (mobileSum === 5 || mobileSum === 6) ? 98 : 75,
            family: (mobileSum === 2 || mobileSum === 3) ? 95 : 70,
            growth: (mobileSum === bhaghyaank) ? 100 : 80
        };
        return scores;
    }
};

// Example Usage for Gautam Ji:
// const myAnalysis = AnkdristiEngine.analyzeMobile("7566471009");
// console.log(myAnalysis);
