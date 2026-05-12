const token = localStorage.getItem("token");

if (!token) {
window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

/* ===============================
INTEREST STATE
=============================== */
let interestId = null;

const interestBtn = document.getElementById("interestBtn");

/* ===============================
LOAD PROFILE
=============================== */
async function loadProfile() {
try {


const res = await fetch(`${API_URL}/api/profile/${id}`, {
  headers: {
    Authorization: "Bearer " + token,
  },
});

const user = await res.json();

if (!res.ok) return;

// ===============================
// IMAGE
// ===============================
const imgSrc = user.profileImage
  ? user.profileImage
  : "/images/default-profile.png";

document.getElementById("profileImage").src = imgSrc;

// ===============================
// AGE
// ===============================
let age = "--";

if (user.dob) {
  age =
    new Date().getFullYear() -
    new Date(user.dob).getFullYear();
}

// ===============================
// BASIC
// ===============================
document.getElementById("profileName").innerText =
  `${user.name || "User"}, ${age}`;

document.getElementById("profileLocation").innerText =
  `${user.city || "—"} • ${user.occupation || "—"}`;

// ===============================
// MAIN INFO
// ===============================
document.getElementById("religion").innerText =
  user.religion || "—";

document.getElementById("language").innerText =
  user.motherTongue || "—";

document.getElementById("education").innerText =
  user.highestDegree || "—";

document.getElementById("income").innerText =
  user.annualIncome || "—";

/* ===============================
   EXTRA DATA
=============================== */
const extra = `
  <div class="extra-grid">

    <div><b>Gender:</b> ${user.gender || "—"}</div>
    <div><b>Height:</b> ${user.height || "—"}</div>

    <div><b>Religion:</b> ${user.religion || "—"}</div>
    <div><b>Caste:</b> ${user.caste || "—"}</div>

    <div><b>Marital Status:</b> ${user.maritalStatus || "—"}</div>
    <div><b>Mother Tongue:</b> ${user.motherTongue || "—"}</div>

    <div><b>Education:</b> ${user.highestDegree || "—"}</div>
    <div><b>Income:</b> ${user.annualIncome || "—"}</div>

    <div><b>Profession:</b> ${user.occupation || "—"}</div>
    <div><b>Job Type:</b> ${user.employedIn || "—"}</div>

    <div><b>Country:</b> ${user.country || "—"}</div>
    <div><b>City:</b> ${user.city || "—"}</div>

    <div><b>Family Type:</b> ${user.familyType || "—"}</div>
    <div><b>Father:</b> ${user.fatherOccupation || "—"}</div>
    <div><b>Mother:</b> ${user.motherOccupation || "—"}</div>

    <div><b>Brothers:</b> ${user.brotherCount || "0"}</div>
    <div><b>Sisters:</b> ${user.sisterCount || "0"}</div>

  </div>

  <div class="about-box">
    <b>About:</b>
    <p>${user.about || "—"}</p>
  </div>
`;

document.getElementById("extraInfo").innerHTML = extra;


} catch (err) {
console.log(err);
}
}

loadProfile();

/* ===============================
CHECK INTEREST STATUS
=============================== */
async function checkInterest() {
try {


const res = await fetch(
  `${API_URL}/api/interest/check/${id}`,
  {
    headers: {
      Authorization: "Bearer " + token,
    },
  }
);

const data = await res.json();

if (data.status === "sent") {
  interestId = data.id;
  interestBtn.innerText = "✔ Sent";
}
else {
  interestBtn.innerText = "💖 Send Interest";
}


} catch (err) {
console.log(err);
}
}

checkInterest();

/* ===============================
TOGGLE VIEW MORE
=============================== */
const toggleBtn = document.getElementById("toggleBtn");
const extraBox = document.getElementById("extraInfo");

toggleBtn.addEventListener("click", () => {

if (extraBox.style.display === "none") {


extraBox.style.display = "block";
toggleBtn.innerText = "View Less ▲";


} else {


extraBox.style.display = "none";
toggleBtn.innerText = "View More ▼";


}
});

/* ===============================
CHAT BUTTON
=============================== */
document.getElementById("chatBtn")
.addEventListener("click", async () => {


try {

  const res = await fetch(
    `${API_URL}/api/profile/${id}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const user = await res.json();

  const name = encodeURIComponent(
    user.name || "User"
  );

  const image = encodeURIComponent(
    user.profileImage
      ? user.profileImage
      : "/images/default-profile.png"
  );
  document.getElementById("profileImage").src = imgSrc;

  window.location.href =
    `./chat.html?id=${id}&name=${name}&img=${image}`;

} catch (err) {
  console.log(err);
}


});

/* ===============================
INTEREST BUTTON (TOGGLE)
=============================== */
interestBtn.addEventListener("click", async () => {

try {


// REMOVE INTEREST
if (interestId) {

  await fetch(
    `${API_URL}/api/interest/delete/${interestId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  interestId = null;

  interestBtn.innerText = "💖 Send Interest";

  return;
}

// SEND INTEREST
const res = await fetch(
  `${API_URL}/api/interest/send`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },

    body: JSON.stringify({
      to: id,
    }),
  }
);

const data = await res.json();

if (data.status === "sent") {

  interestId = data.interest._id;

  interestBtn.innerText = "✔ Sent";
}


} catch (err) {
console.log(err);
}
});
