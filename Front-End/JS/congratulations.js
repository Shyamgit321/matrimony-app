// ===============================
// AUTO REDIRECT (CLEAN VERSION)
// ===============================

setTimeout(() => {
  window.location.href = "user-home.html";
}, 3000);

// manual button support
const goHomeBtn = document.getElementById("goHomeBtn");

if (goHomeBtn) {
  goHomeBtn.addEventListener("click", () => {
    window.location.href = "user-home.html";
  });
}