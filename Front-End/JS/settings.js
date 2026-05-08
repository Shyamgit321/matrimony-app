/* ------- MODAL OPEN/CLOSE ------- */
const modal = document.getElementById("passwordModal");
const openBtn = document.querySelector(".open-password-modal");
const closeBtn = document.querySelector(".close-modal");
const saveBtn = document.querySelector(".save-password");

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

/* CHANGE PASSWORD API */
saveBtn.addEventListener("click", async () => {

  const inputs = modal.querySelectorAll("input");

  const oldPassword = inputs[0].value;
  const newPassword = inputs[1].value;
  const confirmPassword = inputs[2].value;

  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        oldPassword,
        newPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Password changed successfully ✅");

    // logout user
    localStorage.removeItem("token");

    // redirect to login
    window.location.href = "/login.html";

  } catch (err) {
    console.log(err);
    alert("Server error");
  }

});

/* Close modal on outside click */
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

/* -------- EYE ICON PASSWORD TOGGLE -------- */
document.querySelectorAll(".eye-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    let input = icon.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";
  });
});

/* ------- PRIVACY BUTTON UI ------- */
const options = document.querySelectorAll(".privacy-option");

options.forEach(btn => {
btn.addEventListener("click", () => {
let group = btn.parentElement.querySelectorAll(".privacy-option");
group.forEach(opt => opt.classList.remove("active"));
btn.classList.add("active");
});
});

/* -------- DELETE PROFILE (NEXT STEP करेंगे) -------- */
const delBtn = document.querySelector(".delete-profile-btn");

if (delBtn) {
  delBtn.addEventListener("click", async () => {

    const confirmDelete = confirm(
      "⚠️ Are you sure you want to PERMANENTLY delete your profile?\n\nThis cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/delete-profile`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // logout
      localStorage.removeItem("token");

      alert("Profile deleted successfully 🗑️");

      // redirect
      window.location.href = "/home.html";

    } catch (err) {
      console.log(err);
      alert("Error deleting profile");
    }

  });
}

/* ===============================
SAVE PRIVACY
================================ */
async function savePrivacy() {

const mobile = document.querySelector(".mobile-privacy .active")?.dataset.value;
const lastSeen = document.querySelector(".lastseen-privacy .active")?.dataset.value;
const interest = document.querySelector(".interest-privacy .active")?.dataset.value;

const photoBlur = document.getElementById("blurPhotos").checked;
const photoMatchOnly = document.getElementById("photoMatch").checked;

console.log({ mobile, photoBlur, photoMatchOnly, lastSeen, interest });

try {
const res = await fetch(`${API_URL}/api/auth/privacy`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
Authorization: "Bearer " + localStorage.getItem("token")
},
body: JSON.stringify({
mobileVisibility: mobile,
photoBlur,
photoMatchOnly,
lastSeen,
interestAccess: interest
})
});

const data = await res.json();

if (!res.ok) {
  alert(data.message);
  return;
}

alert("Privacy saved successfully ✅");

} catch (err) {
console.log(err);
alert("Error saving privacy");
}
}

/* ===============================
LOAD PRIVACY
================================ */
function setActive(groupClass, value) {
document.querySelectorAll(`${groupClass} .privacy-option`)
.forEach(btn => {
btn.classList.remove("active");
if (btn.dataset.value === value) {
btn.classList.add("active");
}
});
}

async function loadPrivacy() {
try {
const res = await fetch(`${API_URL}/api/auth/profile`, {
headers: {
Authorization: "Bearer " + localStorage.getItem("token")
}
});

const user = await res.json();
const p = user.privacy || {};

document.getElementById("blurPhotos").checked = p.photoBlur || false;
document.getElementById("photoMatch").checked = p.photoMatchOnly || false;

setActive("mobile-privacy", p.mobileVisibility);
setActive("lastseen-privacy", p.lastSeen);
setActive("interest-privacy", p.interestAccess);

} catch (err) {
console.log(err);
}
}

loadPrivacy();