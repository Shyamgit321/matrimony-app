
const chatWindow = document.getElementById("chatWindow");
const userMsgInput = document.getElementById("userMsg");

function sendMsg() {
  let msg = userMsgInput.value.trim();
  if (!msg) return;

  addUserMsg(msg);
  userMsgInput.value = "";

  setTimeout(() => showTyping(), 400);

  setTimeout(() => botReply(msg), 1400);
}

function addUserMsg(text) {
  chatWindow.innerHTML += `<div class="bubble user-msg">${text}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  chatWindow.innerHTML += `
    <div id="typing" class="bubble bot-msg typing">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    </div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function botReply(text) {
  let reply = getSmartReply(text);

  document.getElementById("typing")?.remove();

  chatWindow.innerHTML += `<div class="bubble bot-msg">${reply}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// SMART REPLY ENGINE (B + C MIX)
function getSmartReply(userText) {
  const msg = userText.toLowerCase();

  if (msg.includes("login") || msg.includes("password")) {
    return "I understand login issues can be stressful 💗.<br>Try resetting your password or checking your network.";
  }

  if (msg.includes("photo") || msg.includes("upload")) {
    return "It seems you're having trouble uploading a photo 📸.<br>Please use JPG/PNG below 5MB and stable internet.";
  }

  if (msg.includes("match") || msg.includes("profile")) {
    return "I get it 💗 sometimes matches don't show.<br>Complete your profile & add a bright photo for best results.";
  }

  if (msg.includes("payment") || msg.includes("money")) {
    return "Your safety matters 💗.<br>If payment failed, it usually auto-refunds within 3–7 days.";
  }

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hi sweetheart 💗 I'm here for you. How can I help?";
  }

  return "I understand what you're feeling 💗.<br>Let me help you with that — can you describe the issue a bit more?";
}
