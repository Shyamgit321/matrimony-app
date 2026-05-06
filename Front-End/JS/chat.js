// ================= TOKEN =================
const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const receiverId = params.get("id");

// ================= HEADER =================
const name = params.get("name");
const img = params.get("img");

const headerName = document.getElementById("chatHeaderName");
const headerImg = document.getElementById("chatHeaderImg");
const headerStatus = document.getElementById("chatHeaderStatus");

headerName.innerText = decodeURIComponent(name || "User");
headerImg.src = decodeURIComponent(img || "../images/default-profile.png");

// ================= SOCKET =================
const socket = io(`${API_URL}`);
const myId = JSON.parse(atob(token.split(".")[1])).id;

socket.emit("join", myId);

// ================= SELECTORS =================
const messagesBox = document.getElementById("messagesArea");
const chatMsg = document.getElementById("chatMsg");
const sendBtn = document.getElementById("sendBtn");

// ================= MENU =================
let selectedMsgId = null;
const menu = document.getElementById("msgMenu");
const editOption = document.getElementById("editOption");
const deleteOption = document.getElementById("deleteOption");

// ================= MESSAGE UI =================
function addMyMessage(text, seen = false, id = "") {
  const div = document.createElement("div");
  div.className = "msg msg-right";
  div.dataset.id = id;

  div.innerHTML = `
    <div class="msg-text">${text}</div>
    <span class="tick">${seen ? "✔✔" : "✔"}</span>
  `;

  if (seen) {
    div.querySelector(".tick").style.color = "blue";
  }

  // RIGHT CLICK (desktop)
  div.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    selectedMsgId = id;
    menu.style.display = "block";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
  });

  // LONG PRESS (mobile)
  let pressTimer;
  div.addEventListener("touchstart", (e) => {
    pressTimer = setTimeout(() => {
      selectedMsgId = id;
      menu.style.display = "block";
      menu.style.left = e.touches[0].pageX + "px";
      menu.style.top = e.touches[0].pageY + "px";
    }, 500);
  });

  div.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
  });

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function addOtherMessage(text) {
  const div = document.createElement("div");
  div.className = "msg msg-left";
  div.innerText = text;

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// ================= LOAD MESSAGES =================
async function loadMessages() {
  try {
    const res = await fetch(`${API_URL}/api/chat/${receiverId}`, {
      headers: { Authorization: "Bearer " + token }
    });

    const msgs = await res.json();
    messagesBox.innerHTML = "";

    msgs.forEach(m => {
      if (m.sender === myId) {
        addMyMessage(
          m.text + (m.edited ? " (edited)" : ""),
          m.seen,
          m._id
        );
      } else {
        addOtherMessage(m.text);
      }
    });

    // mark seen in DB
    await fetch(`${API_URL}/api/chat/seen/${receiverId}`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token }
    });

    socket.emit("seen", { senderId: myId, receiverId });

  } catch (err) {
    console.log(err);
  }
}

loadMessages();

// ================= SEND =================
async function sendMessage() {
  const text = chatMsg.value.trim();
  if (!text) return;

  const res = await fetch(`${API_URL}/api/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ receiverId, text })
  });

  const data = await res.json();

  addMyMessage(text, false, data._id);

  socket.emit("sendMessage", {
    senderId: myId,
    receiverId,
    text
  });

  chatMsg.value = "";
}

sendBtn.addEventListener("click", sendMessage);
chatMsg.addEventListener("keydown", e => e.key === "Enter" && sendMessage());

// ================= RECEIVE =================
socket.on("receiveMessage", (data) => {
  if (data.senderId !== receiverId) return;

  addOtherMessage(data.text);

  fetch(`${API_URL}/api/chat/seen/${receiverId}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + token }
  });

  socket.emit("seen", { senderId: myId, receiverId });
});

// ================= ONLINE =================
socket.on("onlineUsers", (users) => {
  headerStatus.innerText = users.includes(receiverId) ? "online" : "offline";
});

// ================= TYPING =================
chatMsg.addEventListener("input", () => {
  socket.emit("typing", { senderId: myId, receiverId });
});

socket.on("typing", (data) => {
  if (data.senderId !== receiverId) return;

  headerStatus.innerText = "typing...";
  setTimeout(() => headerStatus.innerText = "online", 1500);
});

// ================= SEEN UI =================
socket.on("seen", () => {
  const ticks = document.querySelectorAll(".msg-right .tick");

  ticks.forEach(t => {
    t.innerText = "✔✔";
    t.style.color = "blue";
  });
});

// ================= MENU ACTIONS =================
editOption.addEventListener("click", () => {
  const newText = prompt("Edit message:");
  if (newText) editMessage(selectedMsgId, newText);
  menu.style.display = "none";
});

deleteOption.addEventListener("click", () => {
  if (confirm("Delete message?")) {
    deleteMessage(selectedMsgId);
  }
  menu.style.display = "none";
});

window.addEventListener("click", () => {
  menu.style.display = "none";
});

// ================= EDIT =================
async function editMessage(id, text) {
  await fetch(`${API_URL}/api/chat/edit/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ text })
  });

  loadMessages();
}

// ================= DELETE =================
async function deleteMessage(id) {
  await fetch(`${API_URL}/api/chat/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadMessages();
}