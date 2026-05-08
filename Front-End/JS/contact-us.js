// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;


/* FORM VALIDATION */
function submitMessage(e) {
  e.preventDefault();

  let name = cName.value.trim();
  let email = cEmail.value.trim();
  let phone = cPhone.value.trim();
  let msg = cMessage.value.trim();

  if (!name || !email || !msg) {
    alert("Please fill all required fields!");
    return false;
  }

  if (phone && phone.length !== 10) {
    alert("Phone must be 10 digits");
    return false;
  }

  // SUCCESS POPUP
  let popup = document.getElementById("successPopup");
  popup.style.display = "block";

  setTimeout(() => popup.style.display = "none", 2000);

  document.getElementById("contactForm").reset();
  return false;
}