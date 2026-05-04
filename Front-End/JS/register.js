const form = document.getElementById("registerForm");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const successMsg = document.getElementById("successMsg");

// Only numbers in phone
phone.addEventListener("input", () => {
  phone.value = phone.value.replace(/[^0-9]/g, "").slice(0, 10);
});

// Toggle password
window.togglePassword = function (id, el) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
  el.innerText = field.type === "password" ? "Show" : "Hide";
};

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  passwordError.innerText = "";

  if (password.value !== confirmPassword.value) {
    passwordError.innerText = "Passwords do not match";
    return;
  }

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: phone.value,
    password: password.value
  };

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      successMsg.style.display = "block";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      passwordError.innerText = data.message;
    }

  } catch (error) {
    console.error(error);
    passwordError.innerText = "Server error. Try again.";
  }
});