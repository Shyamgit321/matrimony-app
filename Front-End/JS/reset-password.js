document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetForm");
    const msg = document.getElementById("msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value.trim();
        const token = localStorage.getItem("resetToken");

        if (!token) {
            msg.innerText = "Invalid session. Please try again.";
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, newPassword })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                msg.innerText = data.message;
                return;
            }

            msg.innerText = "Password reset successful!";
            localStorage.removeItem("resetToken");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            msg.innerText = "Server error.";
        }

    });

});