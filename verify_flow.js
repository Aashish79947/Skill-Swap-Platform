// Native fetch is available in Node 18+

// If node < 18, we might need a polyfill, but let's assume native fetch or common environment.
// Actually, standard 'http' might be safer if dependencies aren't guaranteed, but let's try native fetch first (Node 18+).

async function verifyFlow() {
    const baseUrl = "http://localhost:8000/api";
    const timestamp = Date.now();
    const user = {
        name: `User${timestamp}`,
        email: `user${timestamp}@test.com`,
        password: "password123"
    };

    console.log("🚀 Starting Verification Flow...");

    // 1. REGISTER
    console.log(`\n1️⃣ Testing Registration for ${user.email}...`);
    try {
        const regRes = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (regRes.status !== 201) {
            console.error(`❌ Registration Failed: ${regRes.status}`);
            const txt = await regRes.text();
            console.error(txt);
            return;
        }

        const regData = await regRes.json();
        console.log("Response:", regData);

        // SECURITY CHECK
        if (regData.password || regData.password_hash) {
            console.error("❌ CRITICAL: Password hash leaked in response!");
        } else if (regData.message === "User registered successfully") {
            console.log("✅ Security Check Passed: Password not returned.");
        } else {
            console.log("⚠️ Response format different than expected, but successful.");
        }

    } catch (e) {
        console.error("❌ Registration Error:", e.message);
        return;
    }

    // 2. LOGIN
    console.log(`\n2️⃣ Testing Login...`);
    let token = "";
    try {
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (loginRes.status !== 200) {
            console.error(`❌ Login Failed: ${loginRes.status}`);
            return;
        }

        const loginData = await loginRes.json();
        if (loginData.token) {
            console.log("✅ Login Successful. Token received.");
            token = loginData.token;
        } else {
            console.error("❌ Login succeeded but no token returned.");
            return;
        }

    } catch (e) {
        console.error("❌ Login Error:", e.message);
        return;
    }

    // 3. ACCESS PROTECTED ROUTE (Skills - reusing getMySkills logic)
    console.log(`\n3️⃣ Testing Protected Route (Skills) with Token...`);
    try {
        const skillRes = await fetch(`${baseUrl}/skills/my`, {
            headers: {
                'Authorization': `Bearer ${token}` // Assuming middleware expects this or just token
                // NOTE: The auth middleware usually expects "x-auth-token" or Bearer.
                // Let's check auth.middleware.js if needed, but standard is often Bearer or x-auth-token.
                // Based on typically MERN projects, let's try header 'x-auth-token' if 'Authorization' fails, 
                // but let's check the code if possible. For now I'll send both common ones.
            }
        });

        // Wait, looking at previous file views, I didn't verify auth middleware.
        // Let's assume standard "Authorization: Bearer" or "x-auth-token". 
        // I will try to inspect auth.middleware.js if this fails.
        // But let's proceed.

        // Actually, let's peek auth middleware quickly using tool? No, let's just run it. 
        // Most JWT middlewares check 'x-auth-token' or header authorization.

        // Let's retry with a custom header just in case. 
        const resWithAuth = await fetch(`${baseUrl}/skills/my`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
            }
        });

        if (resWithAuth.status === 200) {
            console.log("✅ Protected Route Accessed Successfully.");
            const skills = await resWithAuth.json();
            console.log(`Got ${skills.length} skills (Expected 0 for new user).`);
        } else {
            console.error(`❌ Protected Route Failed: ${resWithAuth.status}`);
        }

    } catch (e) {
        console.error("❌ Protected Route Error:", e.message);
    }

    console.log("\n✅ VERIFICATION COMPLETE");
}

verifyFlow();
