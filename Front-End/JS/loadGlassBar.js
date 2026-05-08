fetch("/glass-bar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("glassBar").innerHTML = data;
  });
