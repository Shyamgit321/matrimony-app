document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
  AUTH
  =============================== */
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  /* ===============================
  STATE
  =============================== */
  let allUsers = [];
  let filteredUsers = [];
  let index = 0;

  const PAGE_SIZE = 6;

  /* ===============================
  AGE GENERATE
  =============================== */
  function generateAge() {


    const ageSelect =
      document.getElementById("ageSelect");

    if (!ageSelect) return;

    ageSelect.innerHTML =
      `<option value="">Any</option>`;

    for (let i = 18; i <= 60; i++) {

      ageSelect.innerHTML +=
        `<option value="${i}">${i}</option>`;
    }


  }

  /* ===============================
  PROFESSION GENERATE
  =============================== */
  function populateProfessions(users) {


    const select =
      document.getElementById("professionSelect");

    if (!select) return;

    const unique = [
      ...new Set(
        users
          .map(u => u.occupation)
          .filter(Boolean)
      )
    ];

    select.innerHTML =
      `<option value="">Any</option>`;

    unique.forEach(p => {

      select.innerHTML +=
        `<option value="${p}">${p}</option>`;
    });


  }

  /* ===============================
  LOAD MATCHES
  =============================== */
  async function loadMatches(search = "") {


    try {

      const url = search
        ? `${API_URL}/api/profile/matches?search=${search}`
        : `${API_URL}/api/profile/matches`;

      const res = await fetch(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const users = await res.json();

      if (!res.ok) return;

      allUsers = users || [];
      filteredUsers = users || [];

      index = 0;

      document.getElementById(
        "matchGrid"
      ).innerHTML = "";

      populateProfessions(users);

      render();

    } catch (err) {

      console.log("ERROR:", err);
    }


  }

  /* ===============================
  LOAD MATCHES WITH FILTER
  =============================== */
  async function loadMatchesWithFilter(
    query = ""
  ) {


    try {

      const res = await fetch(
        `${API_URL}/api/profile/matches${query}`,
        {
          headers: {
            Authorization:
              "Bearer " + token,
          },
        }
      );

      const users = await res.json();

      if (!res.ok) return;

      allUsers = users || [];
      filteredUsers = users || [];

      index = 0;

      document.getElementById(
        "matchGrid"
      ).innerHTML = "";

      render();

    } catch (err) {

      console.log(
        "Filter ERROR:",
        err
      );
    }


  }

  /* ===============================
  RENDER
  =============================== */
  function render() {


    const grid =
      document.getElementById("matchGrid");

    if (!grid) return;

    const slice =
      filteredUsers.slice(
        index,
        index + PAGE_SIZE
      );

    if (
      slice.length === 0 &&
      index === 0
    ) {

      grid.innerHTML =
        "<p>No matches found</p>";

      return;
    }

    slice.forEach(user => {

      // ===============================
      // IMAGE
      // ===============================
      const imgSrc =
        user.profileImage
          ? user.profileImage
          : "/images/default-profile.png";

      // ===============================
      // AGE
      // ===============================
      const age = user.dob
        ? new Date().getFullYear() -
        new Date(user.dob).getFullYear()
        : "--";

      grid.innerHTML += `
    <div class="match-card">

      <img src="${imgSrc}" >

      <h3>
        ${user.name || "User"}, ${age}
      </h3>

      <p>
        ${user.city || ""}
        •
        ${user.occupation || ""}
      </p>

      <button
        onclick="openProfile('${user._id}')"
      >
        View Profile
      </button>

    </div>
  `;
    });

    index += PAGE_SIZE;

    const btn =
      document.getElementById(
        "loadMoreBtn"
      );

    if (btn) {

      btn.style.display =
        index >= filteredUsers.length
          ? "none"
          : "block";
    }


  }

  /* ===============================
  FILTER APPLY
  =============================== */
  const applyBtn =
    document.querySelector(".apply-btn");

  if (applyBtn) {


    applyBtn.addEventListener(
      "click",
      () => {

        const age =
          document.getElementById(
            "ageSelect"
          )?.value;

        const religion =
          document.getElementById(
            "religionSelect"
          )?.value;

        const profession =
          document.getElementById(
            "professionSelect"
          )?.value;

        const country =
          document.getElementById(
            "countrySelect"
          )?.value;

        const marital =
          document.getElementById(
            "maritalSelect"
          )?.value;

        let query = [];

        if (age)
          query.push(`age=${age}`);

        if (religion)
          query.push(
            `religion=${religion}`
          );

        if (profession)
          query.push(
            `profession=${profession}`
          );

        if (country)
          query.push(
            `country=${country}`
          );

        if (marital)
          query.push(
            `marital=${marital}`
          );

        const queryString =
          query.length
            ? "?" + query.join("&")
            : "";

        loadMatchesWithFilter(
          queryString
        );
      }
    );


  }

  /* ===============================
  CLEAR FILTER
  =============================== */
  const clearBtn =
    document.querySelector(".clear-btn");

  if (clearBtn) {


    clearBtn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".filter-panel select"
          )
          .forEach(
            s => (s.value = "")
          );

        allUsers = [];
        filteredUsers = [];
        index = 0;

        document.getElementById(
          "matchGrid"
        ).innerHTML = "";

        loadMatches();
      }
    );


  }

  /* ===============================
  LOAD MORE
  =============================== */
  const loadBtn =
    document.getElementById(
      "loadMoreBtn"
    );

  if (loadBtn) {


    loadBtn.addEventListener(
      "click",
      render
    );


  }

  /* ===============================
  SEARCH
  =============================== */
  const searchInput =
    document.querySelector(
      ".nav-search input"
    );

  if (searchInput) {


    let timeout;

    searchInput.addEventListener(
      "input",
      function () {

        const value =
          this.value.trim();

        clearTimeout(timeout);

        timeout = setTimeout(() => {

          loadMatches(value);

        }, 400);
      }
    );


  }

  /* ===============================
  NAVIGATION
  =============================== */
  window.openProfile = function (id) {


    window.location.href =
      `view-profile.html?id=${id}`;


  };

  /* ===============================
  INIT
  =============================== */
  generateAge();

  loadMatches();

});
