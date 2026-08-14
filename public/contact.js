const form = document.getElementById("contact-form");

if (form) {
  const params = new URLSearchParams(window.location.search);
  const reasonSelect = form.querySelector('[name="reason"]');
  const needSelect = form.querySelector('[name="need"]');
  const hpaFields = document.getElementById("hpa-fields");
  const workshopFields = document.getElementById("workshop-fields");
  const serviceType = form.querySelector('[name="serviceType"]');
  const brand = form.querySelector('[name="brand"]');
  const phone = form.querySelector('[name="phone"]');
  const presetReason = params.get("motivo") || "";

  function isHpaWorkshop() {
    return reasonSelect?.value === "upgrade_hpa" && ["installation", "technical_problem", "technical_quote"].includes(needSelect?.value || "");
  }

  function updateConditionalFields() {
    const reason = reasonSelect?.value || "";
    const showHpa = reason === "upgrade_hpa";
    const showWorkshop = reason === "workshop" || isHpaWorkshop();
    if (hpaFields) hpaFields.hidden = !showHpa;
    if (workshopFields) workshopFields.hidden = !showWorkshop;
    if (needSelect) needSelect.required = showHpa;
    if (serviceType) {
      serviceType.required = reason === "workshop";
      serviceType.disabled = reason === "upgrade_hpa" && showWorkshop;
    }
    if (brand) brand.required = showWorkshop;
    if (phone) phone.required = showWorkshop;
  }

  if (reasonSelect && presetReason && Array.from(reasonSelect.options).some((option) => option.value === presetReason)) reasonSelect.value = presetReason;
  updateConditionalFields();
  reasonSelect?.addEventListener("change", updateConditionalFields);
  needSelect?.addEventListener("change", updateConditionalFields);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    updateConditionalFields();
    const button = form.querySelector("button");
    const messageBox = document.getElementById("form-message");
    const originalButtonText = button?.textContent || "Enviar solicitud";

    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (button) { button.disabled = true; button.textContent = "Enviando..."; }

    const data = new FormData(form);
    const rawPhone = String(data.get("phone") || "").trim();
    const compactPhone = rawPhone.replace(/[\s().-]/g, "").replace(/^00/, "+");
    if (compactPhone && !/^\+[0-9]{8,15}$/.test(compactPhone)) {
      if (messageBox) { messageBox.textContent = "El teléfono debe incluir prefijo internacional. Ejemplo: +34652051753"; messageBox.className = "form-message error"; }
      if (button) { button.disabled = false; button.textContent = originalButtonText; }
      return;
    }

    const payload = {
      name: String(data.get("name") || "").trim(), email: String(data.get("email") || "").trim(), phone: compactPhone,
      reason: String(data.get("reason") || "").trim(), need: String(data.get("need") || "").trim(),
      serviceType: String(data.get("serviceType") || "").trim(), brand: String(data.get("brand") || "").trim(),
      model: String(data.get("model") || "").trim(), serialNumber: String(data.get("serialNumber") || "").trim(),
      message: String(data.get("message") || "").trim(), company: String(data.get("company") || "").trim(),
      consent: form.querySelector('[name="consent"]').checked, marketingConsent: form.querySelector('[name="marketingConsent"]').checked,
      landing: window.location.pathname, utmSource: params.get("utm_source") || "", utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "", utmTerm: params.get("utm_term") || "", utmContent: params.get("utm_content") || "",
    };

    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (response.ok && result.success) {
        form.reset();
        if (reasonSelect && presetReason) reasonSelect.value = presetReason;
        updateConditionalFields();
        if (messageBox) { messageBox.textContent = result.route === "workshop" ? "Solicitud de taller creada correctamente." : "Mensaje enviado correctamente."; messageBox.className = "form-message success"; }
      } else if (messageBox) { messageBox.textContent = result.error || "Error enviando el mensaje."; messageBox.className = "form-message error"; }
    } catch {
      if (messageBox) { messageBox.textContent = "Error de conexión."; messageBox.className = "form-message error"; }
    }
    if (button) { button.disabled = false; button.textContent = originalButtonText; }
  });
}
