console.log("TALLER JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("ticket-form");
  const button = document.getElementById("ticket-submit");
  const messageBox = document.getElementById("form-message");
  const privacyCheck = document.getElementById("privacy-check");

  if (!form || !button) {
    console.log("Formulario no encontrado");
    return;
  }

  const phoneRegex = /^\+\d{9,15}$/;

  button.addEventListener("click", async () => {

    console.log("CLICK DETECTADO");

    messageBox.innerText = "";
    messageBox.classList.remove("success", "error");

    const data = new FormData(form);

    if (data.get("company")) return;

    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const phone = data.get("phone")?.toString().trim();
    const brand = data.get("brand")?.toString().trim();
    const message = data.get("message")?.toString().trim();

  console.log("VALORES FORMULARIO:", {
    name,
    email,
    phone,
    brand,
    message,
    privacy: privacyCheck.checked
  });


    if (!name || !email || !phone || !brand || !message) {
      messageBox.innerText = "Todos los campos obligatorios deben completarse.";
      messageBox.classList.add("error");
      return;
    }

    if (!privacyCheck.checked) {
      messageBox.innerText = "Debes aceptar la política de privacidad.";
      messageBox.classList.add("error");
      return;
    }

    if (!phoneRegex.test(phone)) {
      messageBox.innerText =
        "El teléfono debe estar en formato internacional. Ejemplo: +34660000000";
      messageBox.classList.add("error");
      return;
    }

    button.disabled = true;
    button.innerText = "Enviando...";

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          brand,
          model: data.get("model"),
          serialNumber: data.get("serialNumber"),
          message
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        messageBox.innerText = "Orden creada correctamente.";
        messageBox.classList.add("success");
        form.reset();
      } else {
        messageBox.innerText = "Error enviando la orden.";
        messageBox.classList.add("error");
      }

    } catch {
      messageBox.innerText = "Error de conexión.";
      messageBox.classList.add("error");
    }

    button.disabled = false;
    button.innerText = "Crear orden de servicio";
  });

});
