const loginForm = document.getElementById("loginForm");
const loginId = document.getElementById("loginId");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.innerText = "";

  const userData = {
    email: loginId.value.trim(),
    password: loginPassword.value.trim()
  };

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem("token", data.token);

      alert("✅ Login Successful");

      if (data.user && data.user.isProfileComplete) {
        window.location.href = "user-home.html";
      } else {
        window.location.href = "profile-setup.html";
      }

    } else {
      loginError.innerText = data.message || "Login failed";
    }

  } catch (error) {
    console.error(error);
    loginError.innerText = "Server error. Try again.";
  }
});
/* ================= GOOGLE LOGIN ================= */

window.onload = function () {

  google.accounts.id.initialize({
    client_id: "378197059644-qtt4cdi56pni0lfarl3n066959ehmdpj.apps.googleusercontent.com", // 🔥 replace करना
    callback: handleGoogleResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    {
      theme: "outline",
      size: "large"
    }
  );

};


/* ================= HANDLE GOOGLE RESPONSE ================= */

async function handleGoogleResponse(response) {

  try {
    const res = await fetch(`${API_URL}/api/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: response.credential
      })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);

if (!data.user.isProfileComplete) {
  window.location.href = "./profile-setup.html";
} else {
  window.location.href = "./user-home.html";
}

  } catch (err) {
    console.log(err);
  }
}