// -----------------------------
// REGISTER
// -----------------------------
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const res = document.getElementById("registerResult");

  if (!name || !email || !password) {
    res.textContent = "⚠️ All fields are required.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      res.textContent = "✅ Registered successfully! Redirecting...";
      setTimeout(() => (window.location.href = "login.html"), 1000);
    } else {
      res.textContent = "❌ " + (data.message || "Registration failed.");
    }
  } catch (err) {
    res.textContent = "❌ Network error: " + err.message;
  }
}

// -----------------------------
// LOGIN
// -----------------------------
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const res = document.getElementById("loginResult");

  if (!email || !password) {
    res.textContent = "⚠️ Please enter both email and password.";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      res.textContent = "✅ Login successful! Redirecting...";
      setTimeout(() => (window.location.href = "notes.html"), 1000);
    } else {
      res.textContent = "❌ Invalid credentials.";
    }
  } catch (err) {
    res.textContent = "❌ Network error: " + err.message;
  }
}

// -----------------------------
// LOGOUT
// -----------------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
