// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;

/* TABS */
const tabs = document.querySelectorAll(".tab");
const groups = document.querySelectorAll(".faq-group");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    let type = tab.dataset.type;

    groups.forEach(g => {
      g.style.display = (g.dataset.type === type) ? "block" : "none";
    });
  });
});

/* ACCORDION */
document.querySelectorAll(".faq-item").forEach(item => {
  item.onclick = () => {
    let ans = item.querySelector(".faq-answer");
    ans.style.display = ans.style.display === "block" ? "none" : "block";
  };
});

/* SEARCH FILTER */
document.getElementById("faqSearch").addEventListener("keyup", function () {
  let value = this.value.toLowerCase();

  document.querySelectorAll(".faq-item").forEach(item => {
    let text = item.innerText.toLowerCase();
    item.style.display = text.includes(value) ? "block" : "none";
  });
});