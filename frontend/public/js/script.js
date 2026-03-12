if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "dashboard.html";
}

const API_BASE_URL = "http://localhost:5000/api";

// ✅ Login/Signup switch logic
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const formTitle = document.getElementById("form-title");
const otpSection = document.getElementById("otp-section");

showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  if (otpSection) otpSection.style.display = "none";
  formTitle.innerText = "Sign Up";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  if (otpSection) otpSection.style.display = "none";
  formTitle.innerText = "Login";
});

// ✅ Background slideshow logic
const slides = document.querySelectorAll(".slideshow img");
let current = 0;

setInterval(() => {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
}, 4000);

// =============================================
// ✅ INPUT VALIDATION
// =============================================

// Name validation: No numbers allowed
function validateName(name) {
  if (!name) return { valid: false, msg: "Name is required" };
  if (/\d/.test(name)) return { valid: false, msg: "Name cannot contain numbers" };
  if (name.length < 2) return { valid: false, msg: "Name must be at least 2 characters" };
  if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, msg: "Name can only contain letters and spaces" };
  return { valid: true, msg: "✓ Looks good!" };
}

// Username validation
function validateUsername(username) {
  if (!username) return { valid: false, msg: "Username is required" };
  if (username.length < 3) return { valid: false, msg: "Username must be at least 3 characters" };
  if (/\s/.test(username)) return { valid: false, msg: "Username cannot contain spaces" };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { valid: false, msg: "Only letters, numbers, and underscores" };
  return { valid: true, msg: "✓ Username available!" };
}

// Email validation
function validateEmail(email) {
  if (!email) return { valid: false, msg: "Email is required" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, msg: "Please enter a valid email" };
  return { valid: true, msg: "✓ Valid email!" };
}

// Password validation: must have upper, lower, number, special char
function validatePassword(password) {
  if (!password) return { valid: false, msg: "Password is required", strength: 0 };
  
  let strength = 0;
  const checks = [];
  
  if (password.length >= 8) { strength++; } else { checks.push("at least 8 characters"); }
  if (/[a-z]/.test(password)) { strength++; } else { checks.push("a lowercase letter"); }
  if (/[A-Z]/.test(password)) { strength++; } else { checks.push("an uppercase letter"); }
  if (/[0-9]/.test(password)) { strength++; } else { checks.push("a number"); }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) { strength++; } else { checks.push("a special character"); }
  
  if (strength === 5) {
    return { valid: true, msg: "✓ Strong password!", strength: 100 };
  }
  
  return { 
    valid: false, 
    msg: `Needs: ${checks.join(", ")}`, 
    strength: (strength / 5) * 100 
  };
}

// Attach live validation listeners
const nameInput = document.getElementById("signup-name");
const usernameInput = document.getElementById("signup-username");
const emailInput = document.getElementById("signup-email");
const passwordInput = document.getElementById("signup-password");

function showValidation(input, msgEl, result) {
  if (!msgEl) return;
  msgEl.textContent = result.msg;
  msgEl.className = 'validation-msg ' + (result.valid ? 'success' : 'error');
  if (input) {
    input.classList.remove('input-error', 'input-success');
    input.classList.add(result.valid ? 'input-success' : 'input-error');
  }
}

if (nameInput) {
  nameInput.addEventListener("input", () => {
    const result = validateName(nameInput.value);
    showValidation(nameInput, document.getElementById("name-validation"), result);
  });
}

if (usernameInput) {
  usernameInput.addEventListener("input", () => {
    const result = validateUsername(usernameInput.value);
    showValidation(usernameInput, document.getElementById("username-validation"), result);
  });
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    const result = validateEmail(emailInput.value);
    showValidation(emailInput, document.getElementById("email-validation"), result);
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const result = validatePassword(passwordInput.value);
    showValidation(passwordInput, document.getElementById("password-validation"), result);
    
    // Update strength bar
    const bar = document.getElementById("strength-bar");
    if (bar) {
      bar.style.width = result.strength + "%";
      if (result.strength <= 20) bar.style.background = "#ff4444";
      else if (result.strength <= 40) bar.style.background = "#ff8800";
      else if (result.strength <= 60) bar.style.background = "#ffcc00";
      else if (result.strength <= 80) bar.style.background = "#88cc00";
      else bar.style.background = "#00cc66";
    }
  });
}

// =============================================
// ✅ LOGIN LOGIC
// =============================================
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const emailOrUser = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!emailOrUser || !password) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailOrUser, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Success
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("email", data.user.email);
      
      // Determine welcome message
      const isNewUser = localStorage.getItem("isNewUser");
      if (isNewUser === "true") {
        localStorage.setItem("welcomeType", "new");
        localStorage.removeItem("isNewUser");
      } else {
        localStorage.setItem("welcomeType", "returning");
      }
      
      alert(data.message || "Login successful! 🎉");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Invalid credentials!");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Server error. Please check if your backend is running.");
  }
});

// =============================================
// ✅ SIGNUP LOGIC WITH OTP
// =============================================
const signupBtn = document.getElementById("signup-btn");
let signupData = {};

signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signup-name")?.value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  // Validate all fields
  const nameResult = validateName(name);
  const usernameResult = validateUsername(username);
  const emailResult = validateEmail(email);
  const passwordResult = validatePassword(password);

  if (!nameResult.valid) { alert(nameResult.msg); return; }
  if (!usernameResult.valid) { alert(usernameResult.msg); return; }
  if (!emailResult.valid) { alert(emailResult.msg); return; }
  if (!passwordResult.valid) { alert("Password " + passwordResult.msg); return; }

  signupData = { name, username, email, password };
  
  try {
    signupBtn.disabled = true;
    signupBtn.innerText = "Sending OTP...";

    const response = await fetch(`${API_BASE_URL}/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      // Show OTP section
      signupForm.style.display = "none";
      otpSection.style.display = "block";
      formTitle.innerText = "Verify Email";
      
      const otpDisplay = document.getElementById("otp-email-display");
      if (otpDisplay) {
        otpDisplay.textContent = `OTP sent to ${email}`;
      }
      
      alert(data.message || "OTP sent! Please check your email.");
      
      // Focus first OTP input
      const firstOtpInput = document.querySelector('.otp-digit[data-index="0"]');
      if (firstOtpInput) firstOtpInput.focus();
    } else {
      alert(data.message || "Failed to send OTP.");
    }
  } catch (error) {
    console.error("OTP Send Error:", error);
    alert("Error sending OTP. Is the backend running?");
  } finally {
    signupBtn.disabled = false;
    signupBtn.innerText = "Sign Up";
  }
});

// ✅ OTP Input Navigation
const otpInputs = document.querySelectorAll('.otp-digit');
otpInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    if (value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
  
  // Only allow numbers
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
});

// ✅ Verify OTP
const verifyOtpBtn = document.getElementById("verify-otp-btn");
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async () => {
    const enteredOTP = Array.from(otpInputs).map(i => i.value).join('');
    
    if (enteredOTP.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }
    
    try {
      // 1. Verify OTP with backend
      const verifyResponse = await fetch(`${API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email, otp: enteredOTP })
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        // 2. OTP verified, now create the account
        const signupResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: signupData.username, 
            email: signupData.email, 
            password: signupData.password, 
            age: 18 // Default age for now since we don't have an age field in UI
          })
        });

        const signupResult = await signupResponse.json();

        if (signupResponse.ok) {
          // Success! Save to localStorage for migration/UI
          localStorage.setItem("fullName", signupData.name);
          localStorage.setItem("username", signupData.username);
          localStorage.setItem("email", signupData.email);
          localStorage.setItem("isLoggedIn", "false");
          localStorage.setItem("isNewUser", "true"); 
          
          alert("Account created successfully! 🎉 Please login.");
          
          // Switch to login view
          otpSection.style.display = "none";
          loginForm.style.display = "block";
          formTitle.innerText = "Login";
        } else {
          alert(signupResult.message || "Signup failed.");
        }
      } else {
        alert(verifyData.message || "Invalid OTP!");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error during verification. Please try again.");
    }
  });
}

// ✅ Resend OTP
const resendOtp = document.getElementById("resend-otp");
if (resendOtp) {
  resendOtp.addEventListener("click", (e) => {
    e.preventDefault();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("pendingOTP", newOtp);
    localStorage.setItem("otpTimestamp", Date.now().toString());
    alert(`📧 New OTP: ${newOtp}\n\n(In production, this would be sent via SMTP email)`);
    otpInputs.forEach(i => i.value = '');
    otpInputs[0].focus();
  });
}
