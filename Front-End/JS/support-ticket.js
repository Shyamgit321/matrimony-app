
// PREVIEW IMAGE
document.getElementById("t_file").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById("filePreview");
    img.src = e.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// SUBMIT TICKET
function submitTicket() {
  let name = document.getElementById("t_name").value.trim();
  let email = document.getElementById("t_email").value.trim();
  let issue = document.getElementById("t_issue").value;
  let msg = document.getElementById("t_msg").value.trim();

  if (!name || !email || !issue || !msg) {
    alert("Please fill all required fields!");
    return;
  }

  // Show popup
  document.getElementById("successPopup").style.display = "flex";

  // Clear form
  document.getElementById("t_name").value = "";
  document.getElementById("t_email").value = "";
  document.getElementById("t_issue").value = "";
  document.getElementById("t_msg").value = "";
  document.getElementById("t_file").value = "";
  document.getElementById("filePreview").style.display = "none";
}

function closePopup() {
  document.getElementById("successPopup").style.display = "none";
}
