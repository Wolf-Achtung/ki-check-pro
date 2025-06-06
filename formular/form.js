document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ki-check-form");

  if (!form) {
    console.error("Formular nicht gefunden!");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    console.log("🚀 Sende Daten an Webhook:", jsonData);

    try {
      const response = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        console.log("✅ Erfolgreich gesendet");
        window.location.href = "/danke.html";
      } else {
        console.error("❌ Fehler beim Senden:", response.statusText);
        alert("Fehler beim Senden des Formulars. Bitte erneut versuchen.");
      }
    } catch (error) {
      console.error("❌ Fehler im fetch:", error);
      alert("Verbindung zum Server fehlgeschlagen.");
    }
  });
});
