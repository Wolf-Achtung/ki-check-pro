document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("ki-check-form");

  if (!form) {
    console.error("❌ Formular nicht gefunden!");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Score berechnen
    let score = 0;
    const empfehlungen = [];
    const antworten = {};

    const fields = form.querySelectorAll("input[type=radio]:checked, input[type=text]");
    fields.forEach(field => {
      const name = field.name;
      const value = field.value;
      antworten[name] = value;

      if (value === "Ja") score += 3;
      else if (value === "teilweise") score += 2;
      else if (value === "Nein") score += 1;
    });

    // Bewertung & Badge
    let bewertung = "", status = "", badge_url = "", emp1 = "", emp2 = "", emp3 = "";

    if (score >= 24) {
      bewertung = "Exzellent";
      status = "KI-Ready 2025";
      badge_url = "https://check.ki-sicherheit.jetzt/assets/KI-READY.png";
    } else if (score >= 18) {
      bewertung = "Gut vorbereitet";
      status = "Ausbaufähig";
      badge_url = "https://check.ki-sicherheit.jetzt/assets/KI-AUSBAU.png";
    } else {
      bewertung = "Kritisch";
      status = "Nicht konform";
      badge_url = "https://check.ki-sicherheit.jetzt/assets/KI-KRITISCH.png";
    }

    // Empfehlungen je nach Bewertung
    if (score < 24) emp1 = "Richten Sie ein KI-Verzeichnis mit AV-Verträgen ein.";
    if (score < 18) emp2 = "Schulen Sie gezielt Mitarbeitende im KI-Einsatz.";
    if (score < 15) emp3 = "Nutzen Sie unseren Risikoalarm oder ein Audit.";

    // Payload aufbauen
    const payload = {
      unternehmen: antworten.unternehmen || "Unbenannt",
      datum: new Date().toLocaleDateString("de-DE"),
      gueltig_bis: "31.12.2025",
      score: score,
      bewertung: bewertung,
      status: status,
      badge_url: badge_url,
      empfehlung1: emp1,
      empfehlung2: emp2,
      empfehlung3: emp3
    };

    console.log("🚀 Sende an Make:", payload);

    try {
      const res = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log("✅ Erfolgreich übertragen");
        window.location.href = "/danke.html";
      } else {
        console.error("❌ Fehler beim Senden an Make:", res.statusText);
        alert("Übertragung fehlgeschlagen.");
      }
    } catch (err) {
      console.error("❌ Fehler in fetch:", err);
      alert("Verbindung fehlgeschlagen.");
    }
  });
});
