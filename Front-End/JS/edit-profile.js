/* ===============================
TOKEN CHECK
=============================== */
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

/* ===============================
PHOTO DELETE FLAG
=============================== */
let isPhotoDeleted = false;


/* ===============================
GET ELEMENTS
=============================== */
const e_name = document.getElementById("e_name");
const e_gender = document.getElementById("e_gender");
const e_matchPref = document.getElementById("e_matchPref");
const e_religion = document.getElementById("e_religion");
const e_caste = document.getElementById("e_caste");
const e_city = document.getElementById("e_city");
const e_profession = document.getElementById("e_profession");

const e_mother = document.getElementById("e_mother");
const e_income = document.getElementById("e_income");
const e_about = document.getElementById("e_about");

const e_height = document.getElementById("e_height");
const e_marital = document.getElementById("e_marital");
const e_degree = document.getElementById("e_degree");

const e_familyType = document.getElementById("e_familyType");
const e_father = document.getElementById("e_father");
const e_motherOcc = document.getElementById("e_motherOcc");
const e_brother = document.getElementById("e_brother");
const e_sister = document.getElementById("e_sister");

const dobDate = document.getElementById("dobDate");
const dobMonth = document.getElementById("dobMonth");
const dobYear = document.getElementById("dobYear");

const photoInput = document.getElementById("photoInput");
const editPhotoPreview = document.getElementById("editPhotoPreview");
const photoPopup = document.getElementById("photoPopup");


/* ===============================
LOAD PROFILE
=============================== */
async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: "Bearer " + token }
    });

    const user = await res.json();
    if (!res.ok) return;

    // IMAGE FIX (Google + Local)
    const imgSrc = user.profileImage
      ? user.profileImage
      : "/images/default-profile.png";

    editPhotoPreview.src = imgSrc;

    // BASIC
    e_name.value = user.name || "";
    e_gender.value = user.gender || "";
    e_matchPref.value = user.matchPreference || "opposite";
    e_religion.value = user.religion || "";
    e_caste.value = user.caste || "";
    e_city.value = user.city || "";
    e_profession.value = user.occupation || "";

    // EXTRA
    e_mother.value = user.motherTongue || "";
    e_income.value = user.annualIncome || "";
    e_about.value = user.about || "";

    e_height.value = user.height || "";
    e_marital.value = user.maritalStatus || "";
    e_degree.value = user.highestDegree || "";

    e_familyType.value = user.familyType || "";
    e_father.value = user.fatherOccupation || "";
    e_motherOcc.value = user.motherOccupation || "";
    e_brother.value = user.brotherCount || "";
    e_sister.value = user.sisterCount || "";

    // DOB
    if (user.dob) {
      const d = new Date(user.dob);
      dobDate.value = d.getDate();
      dobMonth.value = d.getMonth() + 1;
      dobYear.value = d.getFullYear();
    }

  } catch (err) {
    console.log("Load error:", err);
  }
}

loadProfile();


/* ===============================
DOB OPTIONS
=============================== */
for (let d = 1; d <= 31; d++) {
  dobDate.innerHTML += `<option value="${d}">${d}</option>`;
}

["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  .forEach((m, i) => {
    dobMonth.innerHTML += `<option value="${i + 1}">${m}</option>`;
  });

for (let y = 2005; y >= 1950; y--) {
  dobYear.innerHTML += `<option value="${y}">${y}</option>`;
}


/* ===============================
UPLOAD PHOTO
=============================== */
photoInput.addEventListener("change", async () => {

  const file = photoInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(`${API_URL}/api/profile/upload-image`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    editPhotoPreview.src = `${API_URL}` + data.image;

    // reset delete flag
    isPhotoDeleted = false;

    alert("Photo updated");

  } catch (err) {
    console.log(err);
    alert("Upload failed");
  }
});


/* ===============================
PHOTO POPUP
=============================== */
function handlePhotoClick() {
  photoPopup.style.display = "flex";
}

function closePopup() {
  photoPopup.style.display = "none";
}

function triggerPhotoInput() {
  closePopup();
  photoInput.click();
}


/* ===============================
DELETE PHOTO
=============================== */
function deletePhoto() {
  editPhotoPreview.src = "../images/default-profile.png";

  // FLAG SET
  isPhotoDeleted = true;

  closePopup();
}


/* ===============================
SAVE PROFILE
=============================== */
async function saveAll() {

  if (!dobDate.value || !dobMonth.value || !dobYear.value) {
    alert("Please select complete Date of Birth");
    return;
  }

  const dob = `${dobYear.value}-${dobMonth.value.padStart(2, "0")}-${dobDate.value.padStart(2, "0")}`;

  const data = {
    fullName: e_name.value,
    dob,
    gender: e_gender.value,
    matchPreference: e_matchPref.value,

    religion: e_religion.value,
    caste: e_caste.value,
    motherTongue: e_mother.value,

    city: e_city.value,
    occupation: e_profession.value,
    annualIncome: e_income.value,
    about: e_about.value,

    height: e_height.value,
    maritalStatus: e_marital.value,
    highestDegree: e_degree.value,

    familyType: e_familyType.value,
    fatherOccupation: e_father.value,
    motherOccupation: e_motherOcc.value,
    brotherCount: e_brother.value,
    sisterCount: e_sister.value,

    // IMPORTANT
    deletePhoto: isPhotoDeleted
  };

  try {
    const res = await fetch(`${API_URL}/api/profile/update-all`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    alert("Profile updated successfully");

    window.location.href = "profile.html";

  } catch (err) {
    console.log("Save error:", err);
    alert("Server error");
  }
}