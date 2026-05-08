// AUTO BACK LOGIC — no need for ?from=user
let ref = document.referrer;

let backURL = "/home.html"; // DEFAULT

if (ref.includes("user-home.html")) {
  backURL = "/user-home.html";
}

document.getElementById("dynamicBack").href = backURL;


/* =========================================
   SLIDER GLOBAL VARIABLES
========================================= */
let slideIndex = 0;
let slider = document.getElementById("successSlider");
let slides, dotsContainer, dots;


/* =========================================
   INIT SLIDER
========================================= */
function initSlider() {
  slides = document.querySelectorAll(".slide");
  dotsContainer = document.querySelector(".slider-dots");

  // Remove old dots
  dotsContainer.innerHTML = "";

  // Create new dots
  slides.forEach((_, i) => {
    let dot = document.createElement("div");
    dot.onclick = () => showSlide(i);
    dotsContainer.appendChild(dot);
  });

  dots = document.querySelectorAll(".slider-dots div");

  showSlide(0);
}


/* =========================================
   SHOW SLIDE
========================================= */
function showSlide(n) {
  slideIndex = n;

  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active-dot"));

  slides[n].classList.add("active");
  dots[n].classList.add("active-dot");
}


/* =========================================
   ARROW CONTROLS
========================================= */
document.querySelector(".next").onclick = () => {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
};

document.querySelector(".prev").onclick = () => {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
};


/* =========================================
   AUTO SLIDE
========================================= */
setInterval(() => {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}, 4000);


/* =========================================
   LOAD USER STORIES (NO DUPLICATES)
========================================= */
function loadUserStories() {
  let stored = JSON.parse(localStorage.getItem("successStories") || "[]");

  // Save default slides
  const defaultSlides = Array.from(slider.children);

  // Reset slider completely
  slider.innerHTML = "";

  // Add default slides back only once
  defaultSlides.forEach(s => slider.appendChild(s));

  // Add user stories
  stored.forEach(s => {
    slider.innerHTML += `
      <div class="slide">
        <img class="story-img" src="${s.photo || '../images/default-couple.jpg'}">
        <h3>${s.name}</h3>
        <p>${s.story}</p>
      </div>
    `;
  });

  // Re-init slider
  initSlider();
}

loadUserStories();


/* =========================================
   PHOTO PREVIEW
========================================= */
document.getElementById("storyPhoto").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById("storyPreview");
    img.src = e.target.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
});


/* =========================================
   SAVE STORY (NAME + STORY + PHOTO)
========================================= */
function saveStory() {
  let name = document.getElementById("coupleName").value.trim();
  let story = document.getElementById("coupleStory").value.trim();
  let photo = document.getElementById("storyPreview").src;

  if (!name || !story) {
    alert("Please fill all fields!");
    return;
  }

  if (!photo || photo.length < 10) {
    photo = "";  // no photo uploaded
  }

  let stories = JSON.parse(localStorage.getItem("successStories") || "[]");
  stories.push({ name, story, photo });

  localStorage.setItem("successStories", JSON.stringify(stories));

  alert("Your story has been submitted!");

  // Reset form
  document.getElementById("coupleName").value = "";
  document.getElementById("coupleStory").value = "";
  document.getElementById("storyPhoto").value = "";
  document.getElementById("storyPreview").style.display = "none";
  document.getElementById("storyPreview").src = "";

  // Refresh page
  setTimeout(() => {
    location.reload();
  }, 200);
}
