console.log("CONTACT JS CARGADO");

const form = document.getElementById("contact-form");
console.log("FORM:", form);

if (!form) {
  console.log("FORM NO ENCONTRADO");
} else {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("SUBMIT REAL EJECUTADO");

    const button = form.querySelector("button");
    if (button) {
      button.disabled = true;
      button.textContent = "Enviando...";
    }

    const data = new FormData(form);

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

      const messageBox = document.getElementById("form-message");

      if (response.ok && result.success) {
        form.reset();
        if (messageBox) {
          messageBox.textContent = "Mensaje enviado correctamente.";
          messageBox.className = "form-message success";
          messageBox.style.display = "block";
        }
      } else {
        if (messageBox) {
          messageBox.textContent = result.error || "Error enviando el mensaje.";
          messageBox.className = "form-message error";
          messageBox.style.display = "block";
        }
      }

    } catch {
      const messageBox = document.getElementById("form-message");
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
