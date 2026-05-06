// ===============================
// TOKEN CHECK
// ===============================
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}


// ===============================
// AUTO LOAD USER EMAIL (from backend, not localStorage)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const emailInput = document.getElementById("email");

  fetch(`${API_URL}/api/auth/profile`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(user => {
    if (emailInput) {
      emailInput.value = user.email;
      emailInput.setAttribute("readonly", true); // prevent editing
    }
  });

});


// ===============================
// MOBILE NUMBER
// ===============================
const phone = document.getElementById("phone");

phone.addEventListener("input", () => {
  phone.value = phone.value.replace(/[^0-9]/g, "").slice(0, 10);
});


// ===============================
// PROFILE FOR + GENDER
// ===============================
const profileBtns = document.querySelectorAll("#profileFor button");
const genderField = document.getElementById("genderField");
const genderBtns = document.querySelectorAll("#genderGroup button");

let profileSelected = "";
let genderSelected = "";

profileBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    profileBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    profileSelected = btn.innerText;

    if (btn.dataset.showGender === "yes") {
      genderField.style.display = "block";
      genderSelected = "";
      genderBtns.forEach(g => g.classList.remove("active"));
    } else {
      genderField.style.display = "none";
      genderSelected = "Not Required";
    }
  });
});

genderBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    genderBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    genderSelected = btn.innerText;
  });
});


// ===============================
// FORM SUBMIT
// ===============================
const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!profileSelected) {
    alert("Please select profile for.");
    return;
  }

  if (genderField.style.display === "block" && !genderSelected) {
    alert("Please select gender.");
    return;
  }

  const data = {
    phone: phone.value,
    profileFor: profileSelected,
    gender: genderSelected
  };

  try {
    const response = await fetch(
      `${API_URL}/api/profile/setup-step1`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if (response.ok) {
      window.location.href = "profile-details.html";
    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Server error. Try again.");
  }
});