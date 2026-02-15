console.log("CONTACT JS CARGADO");

const form = document.getElementById("contact-form");

if (!form) {
  console.log("FORM NO ENCONTRADO");
} else {

  /* ===============================
     UTILIDADES
  =============================== */

  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);

    return {
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmTerm: params.get("utm_term") || "",
      utmContent: params.get("utm_content") || ""
    };
  }

  /* ===============================
     SUBMIT
  =============================== */

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = form.querySelector("button");
    const messageBox = document.getElementById("form-message");

    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }

    if (messageBox) {
      messageBox.style.display = "none";
    }

    const data = new FormData(form);

    /* ---------- Honeypot ---------- */
    if (data.get("company")) {
      console.warn("Bot detectado (honeypot)");
      return;
    }

    /* ---------- Consent ---------- */
    const consentGiven = data.get("consent") === "on";
    if (!consentGiven) {
      showError("Debes aceptar la política de privacidad.");
      resetButton();
      return;
    }

    /* ---------- Validación básica ---------- */
    const name = data.get("name")?.trim();
    const email = data.get("email")?.trim();
    const phone = data.get("phone")?.trim();
    const message = data.get("message")?.trim();

    if (!name || !email || !message) {
      showError("Faltan campos obligatorios.");
      resetButton();
      return;
    }

    /* ---------- UTM ---------- */
    const utm = getUTMParams();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          consent: consentGiven,
          ...utm
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        showSuccess("Mensaje enviado correctamente.");
      } else {
        showError(result.error || "Error enviando el mensaje.");
      }

    } catch (error) {
      showError("Error de conexión.");
    }

    resetButton();

    /* ===============================
       HELPERS
    =============================== */

    function showSuccess(text) {
      if (!messageBox) return;
      messageBo
