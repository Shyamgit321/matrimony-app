/* ===============================
   DOM READY
================================ */
document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }

  const careerDetailsForm = document.getElementById("careerDetailsForm");

  const countryInput = document.getElementById("countryInput");
  const stateInput = document.getElementById("stateInput");
  const cityInput = document.getElementById("cityInput");

  const degreeInput = document.getElementById("degreeInput");
  const employedInput = document.getElementById("employedInput");
  const occupationInput = document.getElementById("occupationInput");
  const occupationField = document.getElementById("occupationField");

  const incomeSelect = document.querySelector(".income-select");
  const langToggle = document.getElementById("langToggle");
  const aboutInput = document.getElementById("aboutInput");

  const stateField = document.getElementById("stateField");
  const cityField = document.getElementById("cityField");

  /* ===============================
     AUTO LOAD USER DATA
  ================================= */
  fetch(`${API_URI}/api/auth/profile`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
  .then(res => res.json())
  .then(user => {
    if (user.country) {
      countryInput.value = user.country;
      stateField.style.display = "block";
    }
    if (user.state) {
      stateInput.value = user.state;
      cityField.style.display = "block";
    }
    if (user.city) cityInput.value = user.city;
    if (user.highestDegree) degreeInput.value = user.highestDegree;
    if (user.employedIn) {
      employedInput.value = user.employedIn;
      occupationField.style.display = "block";
    }
    if (user.occupation) occupationInput.value = user.occupation;
    if (user.annualIncome) incomeSelect.value = user.annualIncome;
    if (user.about) aboutInput.value = user.about;
  });

  /* ===============================
     LANGUAGE TOGGLE
  ================================= */
  if (langToggle && aboutInput) {
    langToggle.addEventListener("change", () => {
      aboutInput.placeholder = langToggle.checked
        ? "अपने बारे में लिखें..."
        : "Introduce yourself (Do not share phone or personal contact details)";
    });
  }

  /* COUNTRY → STATE */
  if (countryInput && stateField && cityField) {
    countryInput.addEventListener("input", () => {
      stateInput.value = "";
      cityInput.value = "";

      if (countryInput.value.trim() !== "") {
        stateField.style.display = "block";
        cityField.style.display = "none";
      } else {
        stateField.style.display = "none";
        cityField.style.display = "none";
      }
    });
  }

  /* STATE → CITY */
  if (stateInput && cityField) {
    stateInput.addEventListener("input", () => {
      cityInput.value = "";

      if (stateInput.value.trim() !== "") {
        cityField.style.display = "block";
      } else {
        cityField.style.display = "none";
      }
    });
  }

  /* EMPLOYED → OCCUPATION */
  if (employedInput && occupationField) {
    employedInput.addEventListener("input", () => {
      occupationInput.value = "";

      if (employedInput.value.trim() !== "") {
        occupationField.style.display = "block";
      } else {
        occupationField.style.display = "none";
      }
    });
  }

  function getVal(el) {
    return el && el.value ? el.value.trim() : "";
  }

  /* ===============================
     FORM SUBMIT
  ================================= */
  if (careerDetailsForm) {
    careerDetailsForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!careerDetailsForm.checkValidity()) {
        careerDetailsForm.reportValidity();
        return;
      }

      if (!getVal(countryInput)) return alert("Please select country");
      if (stateInput && stateInput.offsetParent !== null && !getVal(stateInput))
        return alert("Please select state");
      if (cityInput && cityInput.offsetParent !== null && !getVal(cityInput))
        return alert("Please select city");

      try {
        const response = await fetch(
          `${API_URL}/api/profile/career-details`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              country: getVal(countryInput),
              state: getVal(stateInput),
              city: getVal(cityInput),
              highestDegree: getVal(degreeInput),
              employedIn: getVal(employedInput),
              occupation: getVal(occupationInput),
              annualIncome: incomeSelect ? incomeSelect.value : "",
              about: getVal(aboutInput),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Something went wrong");
          return;
        }

        window.location.href = "lifestyle-family.html";

      } catch (error) {
        console.error("Career Save Error:", error);
        alert("Server error. Try again.");
      }
    });
  }

});
