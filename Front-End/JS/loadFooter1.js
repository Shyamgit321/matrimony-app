fetch("/user-footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("user-footer").innerHTML = html;

    // FORCE LOAD CSS
    loadFooterCSS("../CSS/user-footer.css");
  });

function loadFooterCSS(path) {
  fetch(path)
    .then(res => res.text())
    .then(css => {
      const styleTag = document.createElement("style");
      styleTag.textContent = css;
      document.head.appendChild(styleTag);
      console.log("User-footer CSS applied successfully!");
    })
    .catch(err => console.error("CSS load error:", err));
}
