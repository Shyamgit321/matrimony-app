console.log("Activity page loaded!");

document.addEventListener("DOMContentLoaded", () => {

  const listBox = document.getElementById("activityList");
  const activity = JSON.parse(localStorage.getItem("activity")) || [];

  if (activity.length === 0) {
    listBox.innerHTML = `
      <div class="empty-box">No recent activity yet ✨</div>
    `;
    return;
  }

  let html = "";

  activity.forEach(a => {
    html += `
      <div class="activity-item">
        
        <div class="icon-box">💖</div>
        
        <div class="details">
          <p><strong>${a.from}</strong> sent interest to <strong>${a.to}</strong></p>
          <span>${a.time}</span>
        </div>

      </div>
    `;
  });

  listBox.innerHTML = html;
});
