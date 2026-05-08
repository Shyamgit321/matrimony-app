// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/user-home.html"; // DEFAULT

if (ref.includes("home.html")) {
  backURL = "/home.html";
}

document.getElementById("dynamicBack").href = backURL;
