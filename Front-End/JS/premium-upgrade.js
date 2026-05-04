// TOGGLE BUTTONS
const selfBtn = document.getElementById("selfBtn");
const assistBtn = document.getElementById("assistBtn");

const plansRow = document.getElementById("plansRow");
const assistedBox = document.getElementById("assistedBox");
const upgradeBtn = document.getElementById("upgradeBtn");

// SELF-SERVICE CLICK
selfBtn.onclick = () => {
  selfBtn.classList.add("active");
  assistBtn.classList.remove("active");

  plansRow.classList.remove("hidden");
  upgradeBtn.classList.remove("hidden");

  assistedBox.classList.add("hidden");
};

// ASSISTED CLICK
assistBtn.onclick = () => {
  assistBtn.classList.add("active");
  selfBtn.classList.remove("active");

  plansRow.classList.add("hidden");
  upgradeBtn.classList.add("hidden");

  assistedBox.classList.remove("hidden");
};



// ================= PLAN SELECTION =================
const planCards = document.querySelectorAll(".plan-card");

planCards.forEach(card => {
  card.addEventListener("click", () => {

    // remove active from all
    planCards.forEach(c => c.classList.remove("active-plan"));

    // add active to clicked
    card.classList.add("active-plan");

    // Update button text
    const planName = card.querySelector("h3").innerText;
    upgradeBtn.innerText = `Upgrade to ${planName} →`;
  });
});


// ================= ASSISTED PLAN SELECTION =================
const assistPlans = document.querySelectorAll(".assist-plan-card");
const assistUpgradeBtn = document.getElementById("assistUpgradeBtn");

assistPlans.forEach(card => {
  card.addEventListener("click", () => {

    // deselect all
    assistPlans.forEach(c => c.classList.remove("active-assist-plan"));

    // select clicked
    card.classList.add("active-assist-plan");

    // change button text
    const duration = card.querySelector("h4").innerText;
    assistUpgradeBtn.innerText = `Get ${duration} Exclusive →`;
  });
});

// Toggle Assisted / Self UI visibility
assistBtn.onclick = () => {
  assistBtn.classList.add("active");
  selfBtn.classList.remove("active");

  plansRow.classList.add("hidden");
  upgradeBtn.classList.add("hidden");

  assistedBox.classList.remove("hidden");
  assistedPlans.classList.remove("hidden");
};

selfBtn.onclick = () => {
  selfBtn.classList.add("active");
  assistBtn.classList.remove("active");

  plansRow.classList.remove("hidden");
  upgradeBtn.classList.remove("hidden");

  assistedBox.classList.add("hidden");
};
function goToSupport() {
  window.location.href = "./support-callback.html";
}
