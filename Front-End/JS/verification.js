console.log("Verification page loaded!");

// ===============================
// TOKEN CHECK
// ===============================
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// ===============================
// UTILITY
// ===============================
const show = el => el.hidden = false;
const hide = el => el.hidden = true;

// ===============================
// 1️⃣ GESTURE UPLOAD
// ===============================
const gestureUpload = document.getElementById("gestureUpload");
const gesturePreview = document.getElementById("gesturePreview");
const deleteGesture = document.getElementById("deleteGesture");

gestureUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  gesturePreview.src = URL.createObjectURL(file);
  show(gesturePreview);
  show(deleteGesture);
});

deleteGesture.onclick = () => {
  gestureUpload.value = "";
  hide(gesturePreview);
  hide(deleteGesture);
};

// ===============================
// 2️⃣ LIVE SELFIE
// ===============================
const selfieBtn = document.getElementById("selfieBtn");
const video = document.getElementById("cameraStream");
const canvas = document.getElementById("selfieCanvas");
const selfieResult = document.getElementById("selfieResult");
const deleteSelfie = document.getElementById("deleteSelfie");

let camStream = null;
let isCameraOn = false;

selfieBtn.addEventListener("click", async () => {
  try {

    if (!isCameraOn) {
      camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = camStream;

      show(video);
      selfieBtn.innerText = "📸 Take Photo";
      isCameraOn = true;
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    const photo = canvas.toDataURL("image/jpeg");

    selfieResult.src = photo;

    show(selfieResult);
    show(deleteSelfie);

    camStream.getTracks().forEach(t => t.stop());
    hide(video);

    selfieBtn.innerText = "✔ Captured";
    selfieBtn.disabled = true;

  } catch (error) {
    alert("Camera access denied or not available.");
  }
});

deleteSelfie.onclick = () => {
  selfieBtn.disabled = false;
  selfieBtn.innerText = "📸 Capture Now";
  hide(selfieResult);
  hide(deleteSelfie);
  isCameraOn = false;
};

// ===============================
// 3️⃣ VOICE RECORD
// ===============================
const voiceBtn = document.getElementById("voiceRecordBtn");
const voiceStatus = document.getElementById("voiceStatus");
const audioPlayback = document.getElementById("audioPlayback");
const deleteVoice = document.getElementById("deleteVoice");

let recorder = null;
let chunks = [];
let recording = false;

voiceBtn.addEventListener("click", async () => {

  try {

    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);

      recorder.start();
      recording = true;

      voiceBtn.innerText = "⏹ Stop Recording";
      voiceStatus.innerText = "Recording...";

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        audioPlayback.src = url;
        show(audioPlayback);
        show(deleteVoice);

        voiceStatus.innerText = "✔ Voice Recorded Successfully";
        chunks = [];
      };

    } else {
      recorder.stop();
      recording = false;
      voiceBtn.innerText = "🎤 Start Recording";
    }

  } catch (error) {
    alert("Microphone access denied.");
  }
});

deleteVoice.onclick = () => {
  audioPlayback.src = "";
  hide(audioPlayback);
  hide(deleteVoice);
  voiceStatus.innerText = "";
};

// ===============================
// 4️⃣ EDUCATION DOC
// ===============================
const eduUpload = document.getElementById("eduUpload");
const eduName = document.getElementById("eduName");
const deleteEdu = document.getElementById("deleteEdu");

eduUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  eduName.innerText = file.name;
  show(deleteEdu);
});

deleteEdu.onclick = () => {
  eduUpload.value = "";
  eduName.innerText = "";
  hide(deleteEdu);
};

// ===============================
// 5️⃣ JOB DOC
// ===============================
const jobUpload = document.getElementById("jobUpload");
const jobName = document.getElementById("jobName");
const deleteJob = document.getElementById("deleteJob");

jobUpload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  jobName.innerText = file.name;
  show(deleteJob);
});

deleteJob.onclick = () => {
  jobUpload.value = "";
  jobName.innerText = "";
  hide(deleteJob);
};

// ===============================
// 6️⃣ CONTINUE BUTTON → BACKEND SAVE
// ===============================
const continueBtn = document.getElementById("verifyContinueBtn");

continueBtn.addEventListener("click", async () => {

  let errors = [];

  if (!gestureUpload.files.length)
    errors.push("Please upload your Gesture Photo.");

  if (selfieResult.hidden || !selfieResult.src)
    errors.push("Please capture your Live Selfie.");

  if (audioPlayback.hidden || !audioPlayback.src)
    errors.push("Please record your Voice Verification.");

  if (!eduUpload.files.length)
    errors.push("Please upload your Education Document.");

  if (!jobUpload.files.length)
    errors.push("Please upload your Job Proof.");

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  try {

    const response = await fetch(
      `${API_URL}/api/auth/complete-verification`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          verificationComplete: true
        })
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Verification Completed Successfully!");
      window.location.href = "home.html";
    } else {
      alert(result.message);
    }

  } catch (error) {
    alert("Server error. Try again.");
  }

});