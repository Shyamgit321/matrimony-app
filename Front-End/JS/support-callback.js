
/* SUBMIT */
function submitCallback() {

  let name = document.getElementById("cb_name").value.trim();
  let code = document.getElementById("cb_code").value.trim();
  let phone = document.getElementById("cb_phone").value.trim();
  let issue = document.getElementById("cb_issue").value;
  let message = document.getElementById("cb_message").value.trim();

  // VALIDATION
  if (!name || !code || !phone || !message || issue === "Select Issue Type") {
    alert("Please fill all details!");
    return;
  }

  // COUNTRY CODE VALIDATION
  if (!/^\+\d{1,4}$/.test(code)) {
    alert("Please enter a valid country code (Example: +91, +1, +44)!");
    return;
  }

  // PHONE LENGTH FIX
  if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits!");
    return;
  }

  // STORE
  let entry = { name, phone: code + phone, issue, message, time: Date.now() };

  let list = JSON.parse(localStorage.getItem("callbackRequests") || "[]");
  list.push(entry);
  localStorage.setItem("callbackRequests", JSON.stringify(list));

  alert("Your callback request has been submitted!");
  location.reload();
}
function limitMobile(input) {
  input.value = input.value.replace(/\D/g, "").slice(0, 10);
}
function allowCountryCode(input) {
  input.value = input.value
    .replace(/[^+\d]/g, "")   // allow only + and digits
    .replace(/(?!^)\+/g, ""); // allow + only at first position
}