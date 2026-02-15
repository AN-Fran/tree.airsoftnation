console.log("CONTACT JS CARGADO");

const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");
    const messageBox = document.getElementById("form-message");

    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }

    const data = new FormData(form);

    let phone = (data.get("phone") || "").trim();

    // 🔎 Validación formato internacional
    if (phone && !/^\+[0-9]{8,15}$/.test(phone)) {
      if (messageBox) {
        messageBox.textContent =
          "El teléfono debe incluir prefijo internacional. Ejemplo: +34652051753";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }

      if (button) {
        button.disabled = false;
        button.textContent = "Enviar mensaje";
      }

      return;
    }

    const payload = {
      name: (data.get("name") || "").trim(),
      email: (data.get("email") || "").trim(),
      phone: phone,
      message: (data.get("message") || "").trim(),
      company: (data.get("company") || "").trim(),
      consent: form.querySelector('[name="consent"]').checked,

      utmSource: new URLSearchParams(window.location.search).get("utm_source") || "",
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || "",
      utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
      utmTerm: new URLSearchParams(window.location.search).get("utm_term") || "",
      utmContent: new URLSearchParams(window.location.search).get("utm_content") || "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        if (messageBox) {
          messageBox.textContent = "Mensaje enviado correctamente.";
          messageBox.className = "form-message success";
          messageBox.style.display = "block";
        }
      } else {
        if (messageBox) {
          messageBox.textContent =
            result.error || "Error enviando el mensaje.";
          messageBox.className = "form-message error";
          messageBox.style.display = "block";
        }
      }

    } catch (error) {
      if (messageBox) {
        messageBox.textContent = "Error de conexión.";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }
    }

    if (button) {
      button.disabled = false;
      button.textContent = "Enviar mensaje";
    }
  });
}
