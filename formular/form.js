document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const unternehmen = document.querySelector("input[name='unternehmen']").value;
    const branche = document.querySelector("select[name='branche']").value;
    const selbststaendig = document.querySelector("input[name='selbststaendig']:checked").value;
    const massnahmen = document.querySelector("select[name='massnahmen']").value;
    const datum = new Date().toLocaleDateString("de-DE");
    const gueltig_bis = "31.12.2025";

    // Alle 10 Fragen abfragen
    const antworten = {};
    for (let i = 1; i <= 10; i++) {
      const selected = document.querySelector(`input[name='q${i}']:checked`);
      antworten[`q${i}`] = selected ? parseInt(selected.value) : 0;
    }

    const score = Object.values(antworten).reduce((sum, val) => sum + val, 0);

    let bewertung = "";
    let status = "";
    let badge_url = "";

    if (score >= 25) {
      bewertung = "KI-Ready 2025";
      status = "Konform";
      badge_url = "https://check.ki-sicherheit.jetzt/badges/ki-ready.png";
    } else if (score >= 18) {
      bewertung = "Auf gutem Weg";
      status = "Teilweise konform";
      badge_url = "https://check.ki-sicherheit.jetzt/badges/ki-vorbereitet.png";
    } else {
      bewertung = "Kritisch";
      status = "Nicht konform";
      badge_url = "https://check.ki-sicherheit.jetzt/badges/ki-kritisch.png";
    }

    const empfehlungen = [
      "Richten Sie ein KI-Verzeichnis mit AV-Verträgen ein.",
      "Schulen Sie gezielt Mitarbeitende im KI-Einsatz.",
      "Nutzen Sie unseren Risikoalarm oder ein Audit."
    ];

    const payload = {
      unternehmen,
      branche,
      selbststaendig,
      massnahmen,
      datum,
      gueltig_bis,
      score,
      bewertung,
      status,
      badge_url,
      empfehlung1: empfehlungen[0],
      empfehlung2: empfehlungen[1],
      empfehlung3: empfehlungen[2],
      ...antworten
    };

    fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (response.ok) {
          alert("Vielen Dank! Ihr Zertifikat wird jetzt erstellt.");
          form.reset();
        } else {
          alert("Fehler beim Senden des Formulars.");
        }
      })
      .catch((error) => {
        console.error("Fehler:", error);
        alert("Es ist ein technischer Fehler aufgetreten.");
      });
  });
});
