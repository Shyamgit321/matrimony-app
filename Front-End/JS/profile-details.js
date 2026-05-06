document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // TOKEN CHECK
  // ===============================
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }

  // ===============================
  // ELEMENTS
  // ===============================
  const religionSelect = document.getElementById("religionSelect");
  const casteInput = document.getElementById("casteInput");
  const casteDropdown = document.getElementById("casteDropdown");

  const motherInput = document.getElementById("motherInput");
  const motherDropdown = document.getElementById("motherDropdown");

  const dobBoxes = document.querySelectorAll(".dob-box");
  const dobDropdown = document.getElementById("dobDropdown");
  const dobHiddenInput = document.getElementById("dob");

  let dobValue = { date: "", month: "", year: "" };

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // ===============================
  // DOB PICKER LOGIC
  // ===============================
  dobBoxes.forEach(box => {
    box.addEventListener("click", () => {
      dobBoxes.forEach(b => b.classList.remove("active"));
      box.classList.add("active");
      showDobOptions(box.dataset.type);
    });
  });

  function showDobOptions(type) {
    dobDropdown.innerHTML = "";
    dobDropdown.style.display = "block";

    const grid = document.createElement("div");
    grid.className = "dob-grid";

    if (type === "date") {
      for (let d = 1; d <= 31; d++) {
        addDobItem(grid, d, () => setDob("date", d));
      }
    }

    if (type === "month") {
      months.forEach((m, i) => {
        addDobItem(grid, m, () => setDob("month", i + 1, m));
      });
    }

    if (type === "year") {
      for (let y = 2005; y >= 1950; y--) {
        addDobItem(grid, y, () => setDob("year", y));
      }
    }

    dobDropdown.appendChild(grid);
  }

  function addDobItem(grid, text, onClick) {
    const div = document.createElement("div");
    div.className = "dob-item";
    div.innerText = text;
    div.addEventListener("click", onClick);
    grid.appendChild(div);
  }

  function setDob(type, value, label) {
    dobValue[type] = value;

    dobBoxes.forEach(box => {
      if (box.dataset.type === type) {
        box.innerText = label || value;
      }
    });

    dobDropdown.style.display = "none";

    if (dobValue.date && dobValue.month && dobValue.year) {
      dobHiddenInput.value =
        `${dobValue.year}-${String(dobValue.month).padStart(2,"0")}-${String(dobValue.date).padStart(2,"0")}`;
    }
  }

  document.addEventListener("click", e => {
    if (!e.target.closest(".dob-field")) {
      dobDropdown.style.display = "none";
    }
  });

  // ===============================
  // FETCH RELIGIONS
  // ===============================
  fetch(`${API_URL}/api/master/religions`)
  .then(res => res.json())
  .then(data => {
    data.forEach(r => {
      const option = document.createElement("option");
      option.value = r.name;
      option.textContent = r.name;
      religionSelect.appendChild(option);
    });
  });

  // ===============================
  // RELIGION CHANGE → LOAD CASTE
  // ===============================
  religionSelect.addEventListener("change", () => {

    casteInput.value = "";
    casteDropdown.innerHTML = "";
    casteInput.disabled = false;

    fetch(`${API_URL}/api/master/castes/${religionSelect.value}`)
    .then(res => res.json())
    .then(data => {

      data.forEach(c => {
        const div = document.createElement("div");
        div.innerText = c.name;
        div.onclick = () => {
          casteInput.value = c.name;
          casteDropdown.style.display = "none";
        };
        casteDropdown.appendChild(div);
      });

    });
  });

  casteInput.addEventListener("focus", () => {
    casteDropdown.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".caste-field")) {
      casteDropdown.style.display = "none";
    }
  });

  // ===============================
  // FETCH MOTHER TONGUE
  // ===============================
  fetch(`${API_URL}/api/master/mother-tongues`)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const div = document.createElement("div");
      div.innerText = item.name;
      div.onclick = () => {
        motherInput.value = item.name;
        motherDropdown.style.display = "none";
      };
      motherDropdown.appendChild(div);
    });
  });

  motherInput.addEventListener("focus", () => {
    motherDropdown.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".mother-field")) {
      motherDropdown.style.display = "none";
    }
  });

  // ===============================
  // FETCH USER PROFILE (AUTO LOAD)
  // ===============================
  fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(user => {

    if (user.name) {
      document.getElementById("fullName").value = user.name;
    }

    // DOB AUTO FILL
    if (user.dob) {
      const dateObj = new Date(user.dob);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      dobValue = { date: day, month: month, year: year };

      dobHiddenInput.value =
        `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

      dobBoxes.forEach(box => {
        if (box.dataset.type === "date") box.innerText = day;
        if (box.dataset.type === "month") box.innerText = months[month - 1];
        if (box.dataset.type === "year") box.innerText = year;
      });
    }

    // RELIGION + CASTE AUTO FILL
    if (user.religion) {
      religionSelect.value = user.religion;
      casteInput.disabled = false;

      fetch(`${API_URL}/api/master/castes/${user.religion}`)
      .then(res => res.json())
      .then(data => {

        casteDropdown.innerHTML = "";

        data.forEach(c => {
          const div = document.createElement("div");
          div.innerText = c.name;
          div.onclick = () => {
            casteInput.value = c.name;
            casteDropdown.style.display = "none";
          };
          casteDropdown.appendChild(div);
        });

        if (user.caste) {
          casteInput.value = user.caste;
        }

      });
    }

    if (user.motherTongue) {
      motherInput.value = user.motherTongue;
    }

  });

  // ===============================
  // 18+ VALIDATION
  // ===============================
  function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }

  // ===============================
// FIX BUTTON ACTIVE (Manglik + Marital)
// ===============================

let selectedManglik = "";
let selectedMarital = "";

// Manglik buttons
const manglikButtons = document.querySelectorAll("#manglikGroup .select-box");

manglikButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    manglikButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    selectedManglik = this.innerText.trim();
  });
});

// Marital buttons
const maritalButtons = document.querySelectorAll("#maritalGroup .select-box");

maritalButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    maritalButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    selectedMarital = this.innerText.trim();
  });
});

  // ===============================
  // FORM SUBMIT
  // ===============================
  const form = document.getElementById("profileDetailsForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    if (!dobHiddenInput.value) {
      alert("Please select Date of Birth");
      return;
    }

    const age = calculateAge(dobHiddenInput.value);
    if (age < 18) {
      alert("You must be at least 18 years old.");
      return;
    }
    if (!selectedManglik || !selectedMarital) {
  alert("Please select Manglik and Marital Status.");
  return;
}

    const data = {
      fullName: document.getElementById("fullName").value,
      dob: dobHiddenInput.value,
      motherTongue: motherInput.value,
      religion: religionSelect.value,
      caste: casteInput.value
    };

    try {
      const response = await fetch(
        `${API_URL}/api/profile/profile-details`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify(data)
        }
      );

      if (response.ok) {
        window.location.href = "career-details.html";
      } else {
        const result = await response.json();
        alert(result.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }

  });

});
