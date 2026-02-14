document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contact-form");
  if (!form) return;

  const messageBox = document.getElementById("form-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Enviando...";

    const data = new FormData(form);

    // Honeypot anti-spam
    if (data.get("company")) {
      button.disabled = false;
      button.textContent = "Enviar mensaje";
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
        messageBox.textContent = "Mensaje enviado correctamente.";
        messageBox.className = "form-message success";
        form.reset();
      } else {
        messageBox.textContent = result.error || "Error enviando el mensaje.";
        messageBox.className = "form-message error";
      }

    } catch (err) {
      messageBox.textContent = "Error de conexión.";
      messageBox.className = "form-message error";
    }

    button.disabled = false;
    button.textContent = "Enviar mensaje";
  });

});
