console.log("TALLER JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("ticket-form");
  const button = document.getElementById("ticket-submit");
  const messageBox = document.getElementById("form-message");

  if (!form || !button) {
    console.log("Formulario no encontrado");
    return;
  }

  button.addEventListener("click", async () => {

    console.log("CLICK DETECTADO");

    const data = new FormData(form);

    const name = data.get("name")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const phone = data.get("phone")?.toString().trim();
    const brand = data.get("brand")?.toString().trim();
    const model = data.get("model")?.toString().trim();
    const serialNumber = data.get("serialNumber")?.toString().trim();
    const message = data.get("message")?.toString().trim();

    console.log("VALORES FORMULARIO:", {
      name,
      email,
      phone,
      brand,
      model,
      serialNumber,
      message
    });

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
          brand,
          model,
          serialNumber,
          message
        })
      });

      console.log("FETCH EJECUTADO - STATUS:", response.status);

      const result = await response.json();
      console.log("RESPUESTA API:", result);

      if (response.ok) {
        messageBox.innerText = "Respuesta recibida. Revisa consola.";
        messageBox.classList.add("success");
      } else {
        messageBox.innerText = "Error en API. Revisa consola.";
        messageBox.classList.add("error");
      }

    } catch (error) {
      console.log("ERROR FETCH:", error);
      messageBox.innerText = "Error de conexión.";
      messageBox.classList.add("error");
    }

  });

});
