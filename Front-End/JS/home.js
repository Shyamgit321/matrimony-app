let sliderPos = 0;
const track = document.getElementById("matchedTrack");
const cardWidth = 350; // card + gap
const maxSlide = -cardWidth * 3;

/* BUTTONS */
function slideRight() {
  if (sliderPos > maxSlide) {
    sliderPos -= cardWidth;
  } else {
    sliderPos = 0;
  }
  track.style.transform = `translateX(${sliderPos}px)`;
}

function slideLeft() {
  if (sliderPos < 0) {
    sliderPos += cardWidth;
  }
  track.style.transform = `translateX(${sliderPos}px)`;
}

/* AUTO SLIDE */
setInterval(slideRight, 4000);

/* MOBILE SWIPE */
let startX = 0;

track.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) slideRight();
  if (endX - startX > 50) slideLeft();
});

const data = {
  mother: [
    "Bihari","Bengali","Hindi","Gujarati","Kannada","Malayalam",
    "Marathi","Punjabi","Tamil","Telugu","Oriya","Assamese"
  ],

  caste: [
    "Agarwal","Brahmin","Rajput","Kayastha","Baniya",
    "Khatri","Arora","Jat","Gupta","Yadav","General",
  "OBC"
  ],

  religion: [
    "Hindu","Muslim","Christian","Sikh",
    "Jain","Buddhist","Parsi","Jewish"
  ],

  city: [
    "Delhi","Mumbai","Bangalore","Hyderabad","Chennai",
    "Kolkata","Pune","Ahmedabad","Jaipur","Chandigarh"
  ],

  occupation: [
    "Engineer","Doctor","Teacher","Business",
    "IT Professional","Government Job",
    "Lawyer","Chartered Accountant"
  ],

  state: [
    "Delhi","Maharashtra","Karnataka","Tamil Nadu",
    "Uttar Pradesh","Rajasthan",
    "Gujarat","Punjab","West Bengal"
  ]
};

const tabs = document.querySelectorAll(".tab");
const list = document.getElementById("browseList");

function render(type) {
  list.innerHTML = "";
  data[type].forEach(item => {
    list.innerHTML += `<a href="#">${item}</a>`;
  });
}

// Default load
render("mother");

// Tab click
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    render(tab.dataset.type);
  });
});
