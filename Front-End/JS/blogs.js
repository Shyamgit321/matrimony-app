// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "../HTML/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "../HTML/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;


/* ================= BLOG CONTENT DATA ================= */
const blogs = [
  {
    title: "How to Create the Best Matrimonial Profile",
    content: `
      Your profile is your first impression.
      Use clear photos, write genuine details, and highlight your real personality.
      A good profile increases your chances of getting perfect matches.
    `
  },
  {
    title: "Top 5 Qualities to Look for in Your Life Partner",
    content: `
      Trust, respect, emotional understanding, maturity, and loyalty are the
      foundations of a long-lasting relationship. Choose wisely for a better future.
    `
  },
  {
    title: "Why Compatibility Matters More Than Looks",
    content: `
      Looks fade, but compatibility stays forever. Shared values, emotional bonding, 
      and trust create a strong healthy marriage.
    `
  }
];


/* ================= SHOW BLOG POPUP ================= */
function openBlog(i) {
  document.getElementById("popupTitle").innerText = blogs[i].title;
  document.getElementById("popupContent").innerText = blogs[i].content;
  document.getElementById("blogPopup").style.display = "flex";
}


/* ================= CLOSE POPUP ================= */
function closePopup() {
  document.getElementById("blogPopup").style.display = "none";
}
