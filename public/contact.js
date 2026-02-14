document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contact-form");
  if (!form) return;

  const messageBox = document.getElementById("form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");

    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }

    const data = new FormData(form);

    // Honeypot anti-spam
    if (data.get("company")) {
      if (button) {
        button.disabled = false;
        button.textContent = "Enviar mensaje";
      }
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message")
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {

        form.reset();

        if (messageBox) {
          messageBox.textContent =
            "Mensaje enviado correctamente. Te responderemos pronto.";
          messageBox.className = "form-message success";
          messageBox.style.display = "block";
        }

        window.scrollTo({ top: 0, behavior: "smooth" });

      } else {

        if (messageBox) {
          messageBox.textContent =
            result.error || "Error enviando el mensaje.";
          messageBox.className = "form-message error";
          messageBox.style.display = "block";
        }
      }

    } catch {

      if (messageBox) {
        messageBox.textContent = "Error de conexión.";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }

    } finally {

      if (button) {
        button.disabled = false;
        button.textContent = "Enviar mensaje";
      }

    }
  });
});
