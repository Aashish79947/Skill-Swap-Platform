
// Native fetch in Node 18+

const BASE_URL = "http://localhost:8000/api";
const timestamp = Date.now();

// 1. Create User A (The "Python Teacher" who wants "Design")
const userA = {
    name: `Alice_${timestamp}`,
    email: `alice_${timestamp}@test.com`,
    password: "password123",
    skillsWanted: ["Design"], // Wants Design
    skillTitle: "Python Masterclass",
    skillCategory: "Programming"
};

// 2. Create User B (The "Designer" who wants "Python")
// This is a PERFECT BIDIRECTIONAL MATCH
const userB = {
    name: `Bob_${timestamp}`,
    email: `bob_${timestamp}@test.com`,
    password: "password123",
    skillsWanted: ["Python"], // Wants Python
    skillTitle: "UI/UX Design Basics",
    skillCategory: "Design"
};

// 3. Create User C (The "Chef" who offers "Cooking" and wants "Python")
// This is a PARTIAL match for User B (B wants Python/C offers Python), 
// BUT User C wants "Python", and User B offers "Design". 
// Wait, User C wants "Python" (B has it). User B wants "Python" (C has it? No, C has Cooking).
// Let's make it clearer:
// User C offers "Cooking", Wants "Python".
// User A (Python Teacher) matches C? 
// A offers Python -> C wants Python. (Match 1)
// C offers Cooking -> A wants Design. (No Match)
// Result: A and C should NOT match bidirectionally.

const userC = {
    name: `Charlie_${timestamp}`,
    email: `charlie_${timestamp}@test.com`,
    password: "password123",
    skillsWanted: ["Python"],
    skillTitle: "Gourmet Cooking",
    skillCategory: "Cooking"
};


async function registerAndLogin(user) {
    // Register
    const reg = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, password: user.password })
    });

    if (reg.status !== 201) throw new Error(`Registration failed for ${user.name}`);

    // Login
    const login = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
    });
    const data = await login.json();
    return data.token;
}

async function setupProfile(token, user) {
    // 1. Add Skill (Offer)
    await fetch(`${BASE_URL}/skills`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: user.skillTitle,
            category: user.skillCategory,
            description: "I can teach this!"
        })
    });

    // 2. Set Wants (Profile)
    await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            skillsWanted: user.skillsWanted
        })
    });
}

async function checkMatches(token, userName) {
    const res = await fetch(`${BASE_URL}/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const matches = await res.json();
    console.log(`\n🔍 Matches for ${userName}:`);
    if (matches.length === 0) console.log("   No matches found.");
    matches.forEach(m => {
        console.log(`   - Found: ${m.name} (${m.email})`);
    });
    return matches;
}

async function runTest() {
    console.log("🚀 Starting Bidirectional Match Verification...\n");

    try {
        console.log("1️⃣ Setting up User A (Offers Python, Wants Design)...");
        const tokenA = await registerAndLogin(userA);
        await setupProfile(tokenA, userA);

        console.log("2️⃣ Setting up User B (Offers Design, Wants Python)...");
        const tokenB = await registerAndLogin(userB);
        await setupProfile(tokenB, userB);

        console.log("3️⃣ Setting up User C (Offers Cooking, Wants Python)...");
        const tokenC = await registerAndLogin(userC);
        await setupProfile(tokenC, userC);

        // --- VERIFICATION ---

        // TEST 1: User A should see User B (Perfect Match)
        // A wants Design (B has it). B wants Python (A has it). -> MATCH
        const matchesA = await checkMatches(tokenA, "User A (Alice)");
        const foundB_in_A = matchesA.some(m => m.email === userB.email);
        const foundC_in_A = matchesA.some(m => m.email === userC.email);

        if (foundB_in_A) console.log("   ✅ SUCCESS: Alice matched with Bob (Bidirectional).");
        else console.error("   ❌ FAIL: Alice did NOT match with Bob.");

        if (!foundC_in_A) console.log("   ✅ SUCCESS: Alice did NOT match with Charlie (Unidirectional only).");
        else console.error("   ❌ FAIL: Alice matched with Charlie incorrectly.");


        // TEST 2: User B should see User A
        const matchesB = await checkMatches(tokenB, "User B (Bob)");
        const foundA_in_B = matchesB.some(m => m.email === userA.email);

        if (foundA_in_B) console.log("   ✅ SUCCESS: Bob matched with Alice.");
        else console.error("   ❌ FAIL: Bob did NOT match with Alice.");

        // TEST 3: User C (Wants Python, Offers Cooking)
        // C wants Python (A has it) -> Unidirectional OK
        // But A wants Design (C has Cooking) -> No Match.
        // So C should see NO ONE (strict bidirectional).
        const matchesC = await checkMatches(tokenC, "User C (Charlie)");
        if (matchesC.length === 0) console.log("   ✅ SUCCESS: Charlie has 0 matches (Correct, logic is strict).");
        else console.error("   ❌ FAIL: Charlie found matches incorrectly.");

    } catch (e) {
        console.error("CRASH:", e);
    }
}

runTest();
