// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;

/* OPEN APPLY POPUP */
function openApply(job) {
  document.getElementById("jobTitle").innerText = job;
  document.getElementById("applyPopup").style.display = "flex";
}

/* CLOSE POPUP */
function closePopup() {
  document.getElementById("applyPopup").style.display = "none";
}

/* SUBMIT APPLICATION */
function submitApplication() {
  let name = document.getElementById("applicantName").value.trim();
  let email = document.getElementById("applicantEmail").value.trim();
  let msg = document.getElementById("applicantMsg").value.trim();

  if (!name || !email || !msg) {
    alert("Please fill all details!");
    return;
  }

  alert("Your application has been submitted!");
  closePopup();
}
