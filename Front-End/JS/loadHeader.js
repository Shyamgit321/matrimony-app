fetch("../header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header").innerHTML = html;

    const page = document.body.getAttribute("data-page");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    // default → LOGIN deep (Image 1)
    loginBtn.classList.add("active");
    registerBtn.classList.remove("active");

    // register page → Image 2
    if (page === "register") {
      registerBtn.classList.add("active");
      loginBtn.classList.remove("active");
    }
  })
  .catch(err => console.error("Header load error:", err));