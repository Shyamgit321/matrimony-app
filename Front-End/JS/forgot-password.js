document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("forgotForm");
    const infoMsg = document.getElementById("infoMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        try {
            const response = await fetch(
                `${API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                infoMsg.innerText = data.message;
                return;
            }

            // Store token temporarily
            localStorage.setItem("resetToken", data.token);

            infoMsg.innerText = "Redirecting to reset page...";
            setTimeout(() => {
                window.location.href = "reset-password.html";
            }, 1000);

        } catch (error) {
            infoMsg.innerText = "Server error. Try again.";
        }

    });

});