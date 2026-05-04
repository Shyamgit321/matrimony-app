// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "../HTML/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "../HTML/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;

/* ================= PR DATA ================= */
const prData = [
  {
    title: "MySoul Ranked as Fastest Growing Matrimonial Platform",
    content: `
      MySoul has officially become one of India's fastest-growing matchmaking platforms.
      With over 1 million daily users and thousands of verified profiles, MySoul continues 
      to shape the future of meaningful relationships.
    `
  },
  {
    title: "How MySoul is Changing Digital Matchmaking in India",
    content: `
      With advanced compatibility algorithms, modern design, and verified profiles,
      MySoul is redefining trust and simplicity in the digital marriage world.
    `
  },
  {
    title: "Exclusive Interview With MySoul Founder",
    content: `
      The founder talks about building a platform based on emotions, transparency, 
      and long-term compatibility rather than just looks or caste preferences.
    `
  }
];

/* ================= OPEN POPUP ================= */
function openPR(i) {
  document.getElementById("popupTitle").innerText = prData[i].title;
  document.getElementById("popupContent").innerText = prData[i].content;
  document.getElementById("prPopup").style.display = "flex";
}
/* ================= CLOSE POPUP ================= */
function closePopup() {
  document.getElementById("prPopup").style.display = "none";
}
