const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const chatListBox = document.getElementById("chatList");

/* ===============================
LOAD ALL (CHAT + INTEREST)
=============================== */
async function loadAll() {
  try {

    const [chatRes, interestRes] = await Promise.all([
      fetch(`${API_URL}/api/chat/list/all`, {
        headers: {
          Authorization: "Bearer " + token
        }
      }),

      fetch(`${API_URL}/api/interest/received`, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
    ]);

    const chats = await chatRes.json();
    const interests = await interestRes.json();

    const map = {};

    // CHAT DATA
    chats.forEach(c => {
      map[c.userId] = {
        userId: c.userId,
        name: c.name,
        image: c.image,
        lastMessage: c.lastMessage,
        time: c.time,
        hasInterest: false
      };
    });

    // INTEREST DATA
    interests.forEach(i => {

      if (map[i.userId]) {

        map[i.userId].hasInterest = true;

        if (
          new Date(i.time) >
          new Date(map[i.userId].time)
        ) {
          map[i.userId].time = i.time;
        }

      } else {

        map[i.userId] = {
          userId: i.userId,
          name: i.name,
          image: i.image,
          lastMessage: "",
          time: i.time,
          hasInterest: true
        };
      }
    });

    // FINAL ARRAY
    const all = Object.values(map);

    // SORT
    all.sort(
      (a, b) =>
        new Date(b.time) - new Date(a.time)
    );

    chatListBox.innerHTML = "";

    // EMPTY
    if (all.length === 0) {
      chatListBox.innerHTML =
        "<p>No activity yet</p>";
      return;
    }

    // RENDER
    all.forEach(item => {

      // IMAGE
      const imgSrc = item.image
        ? item.image
        : "/images/default-profile.png";

      // MESSAGE
      let message = "";

      if (item.lastMessage) {
        message = item.lastMessage;
      }

      // INTEREST
      if (item.hasInterest) {

        if (message) {
          message = "💖 • " + message;
        } else {
          message = "💖 Sent you an interest";
        }
      }

      // CARD
      const div = document.createElement("div");

      div.className = "chat-item";

      div.innerHTML = `
        <img src="${imgSrc}" class="chat-img">

        <div class="chat-info">
          <h3>${item.name}</h3>
          <p>${message}</p>
        </div>

        <span class="chat-time">
          ${new Date(item.time).toLocaleDateString()}
        </span>
      `;

      // OPEN CHAT
      div.onclick = () => {

        window.location.href =
          `./chat.html?id=${item.userId}&name=${encodeURIComponent(item.name)}&img=${encodeURIComponent(imgSrc)}`;
      };

      chatListBox.appendChild(div);
    });

  } catch (err) {
    console.log("ERROR:", err);
  }
}

loadAll();