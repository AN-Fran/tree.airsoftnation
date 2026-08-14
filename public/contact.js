const form = document.getElementById("contact-form");

if (form) {
  const params = new URLSearchParams(window.location.search);
  const reasonSelect = form.querySelector('[name="reason"]');
  const presetReason = params.get("motivo") || "";

  if (reasonSelect && presetReason) {
    const optionExists = Array.from(reasonSelect.options).some(
      (option) => option.value === presetReason
    );
    if (optionExists) reasonSelect.value = presetReason;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");
    const messageBox = document.getElementById("form-message");
    const originalButtonText = button?.textContent || "Enviar mensaje";

    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }

    const data = new FormData(form);
    const phone = String(data.get("phone") || "").trim();
    const reason = String(data.get("reason") || "").trim();

    if (!reason) {
      if (messageBox) {
        messageBox.textContent = "Selecciona el motivo de tu consulta.";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }
      if (button) {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
      return;
    }

    const compactPhone = phone.replace(/[\s().-]/g, "").replace(/^00/, "+");
    if (compactPhone && !/^\+[0-9]{8,15}$/.test(compactPhone)) {
      if (messageBox) {
        messageBox.textContent = "El teléfono debe incluir prefijo internacional. Ejemplo: +34652051753";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }
      if (button) {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
      return;
    }

    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: compactPhone,
      reason,
      message: String(data.get("message") || "").trim(),
      company: String(data.get("company") || "").trim(),
      consent: form.querySelector('[name="consent"]').checked,
      marketingConsent: form.querySelector('[name="marketingConsent"]').checked,
      landing: window.location.pathname,
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmTerm: params.get("utm_term") || "",
      utmContent: params.get("utm_content") || "",
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
        if (reasonSelect && presetReason) reasonSelect.value = presetReason;
        if (messageBox) {
          messageBox.textContent = "Mensaje enviado correctamente.";
          messageBox.className = "form-message success";
          messageBox.style.display = "block";
        }
      } else if (messageBox) {
        messageBox.textContent = result.error || "Error enviando el mensaje.";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }
    } catch {
      if (messageBox) {
        messageBox.textContent = "Error de conexión.";
        messageBox.className = "form-message error";
        messageBox.style.display = "block";
      }
    }

    if (button) {
      button.disabled = false;
      button.textContent = originalButtonText;
    }
  });
}
