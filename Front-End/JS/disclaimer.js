// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "../HTML/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "../HTML/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;
