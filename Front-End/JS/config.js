const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

window.API_URL = isLocal
  ? "http://localhost:5000"
  : "https://matrimony-app-ntxj.onrender.com";