document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  async function loadProfile() {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      const user = await res.json();
      console.log("PROFILE DATA:", user);

      // IMAGE FIX
      const imgSrc = user.profileImage
        ? user.profileImage
        : "/images/default-profile.png";

      // CORRECT ID
      const img = document.getElementById("profilePreview");
      if (img) img.src = imgSrc;

      // TEXT DATA
      document.getElementById("p_name").innerText = user.name || "—";
      document.getElementById("p_gender").innerText = user.gender || "—";
      document.getElementById("p_city").innerText = user.city || "—";
      document.getElementById("p_profession").innerText = user.occupation || "—";
      document.getElementById("p_religion").innerText = user.religion || "—";
      document.getElementById("p_caste").innerText = user.caste || "—";

      if (user.dob) {
        const dob = new Date(user.dob);
        document.getElementById("p_dob").innerText =
          dob.toISOString().split("T")[0];

        const age = new Date().getFullYear() - dob.getFullYear();
        document.getElementById("p_age").innerText = age;
      }

      document.getElementById("p_mother").innerText = user.motherTongue || "—";
      document.getElementById("p_income").innerText = user.annualIncome || "—";
      document.getElementById("p_about").innerText = user.about || "—";

      document.getElementById("p_height").innerText = user.height || "—";
      document.getElementById("p_marital").innerText = user.maritalStatus || "—";
      document.getElementById("p_degree").innerText = user.highestDegree || "—";

      document.getElementById("p_familyType").innerText = user.familyType || "—";
      document.getElementById("p_father").innerText = user.fatherOccupation || "—";
      document.getElementById("p_motherOcc").innerText = user.motherOccupation || "—";
      document.getElementById("p_brother").innerText = user.brotherCount || "0";
      document.getElementById("p_sister").innerText = user.sisterCount || "0";

    } catch (err) {
      console.log(err);
    }
  }

  loadProfile();

});
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("toggleMoreBtn");
  const more = document.getElementById("moreDetails");

  if (btn && more) {
    btn.addEventListener("click", () => {

      if (more.style.display === "none" || more.style.display === "") {
        more.style.display = "block";
        btn.innerText = "Show Less ▲";
      } else {
        more.style.display = "none";
        btn.innerText = "Show More ▼";
      }

    });
  }

});