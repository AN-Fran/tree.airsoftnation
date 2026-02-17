console.log("TALLER JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("ticket-form");
  const button = document.getElementById("ticket-submit");
  const messageBox = document.getElementById("form-message");
  const privacyCheck = document.getElementById("privacy-check");

  if (!form || !button) return;

  button.addEventListener("click", async () => {

    console.log("CLICK DETECTADO");

    const data = new FormData(form);

    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const phone = data.get("phone")?.toString().trim();
    const serviceType = data.get("serviceType")?.toString().trim();
    const brand = data.get("brand")?.toString().trim();
    const model = data.get("model")?.toString().trim();
    const serialNumber = data.get("serialNumber")?.toString().trim();
    const message = data.get("message")?.toString().trim();

    console.log("VALORES FORMULARIO:", {
      name,
      email,
      phone,
      serviceType,
      brand,
      model,
      serialNumber,
      message
    });

    if (!privacyCheck.checked) {
      messageBox.innerText = "Debes aceptar la política de privacidad.";
      messageBox.className = "form-message error";
      return;
    }

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          serviceType,
          brand,
          model,
          serialNumber,
          message
        })
      });

      const result = await response.json();

      console.log("RESPUESTA API:", result);

      if (response.ok) {
        messageBox.innerText = "Orden creada correctamente.";
        messageBox.className = "form-message success";
        form.reset();
      } else {
        messageBox.innerText = "Error en API. Revisa consola.";
        messageBox.className = "form-message error";
      }

    } catch (error) {
      console.log("ERROR FETCH:", error);
      messageBox.innerText = "Error de conexión.";
      messageBox.className = "form-message error";
    }

  });

});
