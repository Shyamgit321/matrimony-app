// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;
