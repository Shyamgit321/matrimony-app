/* =====================================================
AUTH
===================================================== */
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}


/* =====================================================
LOAD USER + NAVBAR IMAGE
===================================================== */
async function loadUser() {
  try {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      console.log("User fetch failed");
      return;
    }

    const user = await res.json();
    console.log("HOME USER:", user);

    // IMAGE FIX
    const imgSrc = user.profileImage?.startsWith("http")
      ? user.profileImage
      : user.profileImage
        ? `${API_URL}` + user.profileImage
        : "../images/default-profile.png";

    // CORRECT ID
    const navImg = document.getElementById("navProfileImg");
    if (navImg) navImg.src = imgSrc;

    // NAME
    const heroName = document.getElementById("userNameHero");
    if (heroName) heroName.innerText = user.name || "User";

  } catch (err) {
    console.log(err);
  }
}

loadUser();


/* =====================================================
LOAD MATCHES (WITH SEARCH)
===================================================== */
async function loadMatches(search = "") {
  try {

    const url = search
      ? `${API_URL}/api/profile/matches?search=${search}`
      : `${API_URL}/api/profile/matches`;

    const res = await fetch(url, {
      headers: { Authorization: "Bearer " + token }
    });

    const users = await res.json();
    if (!res.ok) return;

    const grid = document.getElementById("matchGrid");
    grid.innerHTML = "";

    if (users.length === 0) {
      grid.innerHTML = "<p>No matches found</p>";
      return;
    }

    users.slice(0, 8).forEach(user => {   // 🔥 LIMIT HOME TO 6

      const img = user.profileImage?.startsWith("http")
        ? user.profileImage
        : user.profileImage
          ? `${API_URL}` + user.profileImage
          : "../images/default-profile.png";

      const age = user.dob
        ? new Date().getFullYear() - new Date(user.dob).getFullYear()
        : "--";

      const card = `
        <div class="match-card">
          <img src="${img}">
          <h3>${user.name || "User"}, ${age}</h3>
          <p>${user.city || ""} • ${user.occupation || ""}</p>

          <button class="view-profile-btn"
            onclick="viewProfile('${user._id}')">
            View Profile
          </button>
        </div>
      `;

      grid.innerHTML += card;
    });

  } catch (err) {
    console.log(err);
  }
}

// INITIAL LOAD
loadMatches();


/* =====================================================
SEARCH FUNCTION
===================================================== */
function setupSearch() {
  const searchInput = document.querySelector(".nav-search input");

  if (!searchInput) return;

  let timeout;

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();

    clearTimeout(timeout);

    // Debounce (smooth UX)
    timeout = setTimeout(() => {
      loadMatches(value);
    }, 400);
  });
}

setupSearch();


/* =====================================================
VIEW PROFILE REDIRECT
===================================================== */
function viewProfile(id) {
  window.location.href = `view-profile.html?id=${id}`;
}


/* =====================================================
UI EVENTS
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

  // PROFILE DROPDOWN
  const profileMenu = document.querySelector(".profile-menu");

  if (profileMenu) {
    profileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      profileMenu.classList.remove("open");
    });
  }

  // SHOW MORE
  const showMoreBtn = document.getElementById("goToShowMore");
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      window.location.href = "/showmore.html";
    });
  }

  // CHAT BUTTON
  const chatBtn = document.getElementById("chatBtn");
  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      window.location.href = "/chat-list.html";
    });
  }

});


/* =====================================================
LOGOUT
===================================================== */
function openLogoutPopup() {
  document.getElementById("logoutModal").style.display = "flex";
}

document.addEventListener("DOMContentLoaded", () => {

  const cancelBtn = document.getElementById("cancelLogout");
  const logoutBtn = document.getElementById("confirmLogout");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      document.getElementById("logoutModal").style.display = "none";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }

});


/* =====================================================
PREMIUM
===================================================== */
function goToPremium() {
  window.location.href = "./premium-intro.html?from=user";
}