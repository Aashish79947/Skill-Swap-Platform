
const testBackend = async () => {
    try {
        console.log("Testing Backend connection...");
        const res = await fetch("http://localhost:8000/");
        const text = await res.text();
        console.log("Root endpoint response:", text);

        if (text.includes("API running")) {
            console.log("✅ Backend is reachable");
        } else {
            console.log("❌ Backend response unexpected");
        }
    } catch (e) {
        console.error("❌ Backend connection failed:", e.message);
    }
};

testBackend();
