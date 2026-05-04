document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }

  const familyForm = document.getElementById("familyForm");
  if (!familyForm) return;

  const familyTypeInput = document.getElementById("familyTypeInput");
  const fatherOccupation = document.getElementById("fatherOccupation");
  const motherOccupation = document.getElementById("motherOccupation");

  const brotherCountInput = document.getElementById("brotherCount");
  const sisterCountInput = document.getElementById("sisterCount");

  const familyCountry = document.getElementById("familyCountry");
  const familyState = document.getElementById("familyState");
  const familyCity = document.getElementById("familyCity");

  const familyAbout = document.getElementById("familyAbout");

  /* ===============================
     AUTO LOAD USER DATA
  ============================== */
  fetch("http://localhost:5000/api/auth/profile", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(user => {

    if (user.familyType) familyTypeInput.value = user.familyType;
    if (user.fatherOccupation) fatherOccupation.value = user.fatherOccupation;
    if (user.motherOccupation) motherOccupation.value = user.motherOccupation;
    if (user.brotherCount) brotherCountInput.value = user.brotherCount;
    if (user.sisterCount) sisterCountInput.value = user.sisterCount;
    if (user.familyCountry) familyCountry.value = user.familyCountry;
    if (user.familyState) familyState.value = user.familyState;
    if (user.familyCity) familyCity.value = user.familyCity;
    if (user.familyAbout) familyAbout.value = user.familyAbout;

  });

  /* ===============================
     OPTION GROUP ACTIVE + SAVE
  ============================== */
  function activateGroup(group, hiddenInput) {
    if (!group) return;

    const buttons = group.querySelectorAll("button");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (hiddenInput) {
          hiddenInput.value = btn.textContent.trim();
        }
      });
    });
  }

  activateGroup(document.querySelector(".family-type"), familyTypeInput);
  activateGroup(document.querySelector(".brother-options"), brotherCountInput);
  activateGroup(document.querySelector(".sister-options"), sisterCountInput);

  /* ===============================
     FORM SUBMIT
  ============================== */
  familyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!familyForm.checkValidity()) {
      familyForm.reportValidity();
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/profile/family-details",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            familyType: familyTypeInput.value,
            fatherOccupation: fatherOccupation.value,
            motherOccupation: motherOccupation.value,
            brotherCount: brotherCountInput.value,
            sisterCount: sisterCountInput.value,
            familyCountry: familyCountry.value,
            familyState: familyState.value,
            familyCity: familyCity.value,
            familyAbout: familyAbout.value
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      window.location.href = "congratulations.html";

    } catch (error) {
      console.error(error);
      alert("Server error. Try again.");
    }
  });

});
