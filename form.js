document.getElementById("kiCheckForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const payload = {};

  // Allgemeine Felder auslesen
  payload.unternehmen = form.unternehmen.value || "Unbekannt";
  payload.branche = form.branche.value || "nicht angegeben";
  payload.massnahme = form.massnahme.value || "nicht angegeben";
  payload.freelancer = form.freelancer?.checked ? "ja" : "nein";
  payload.expertenprofil = form.expertenprofil?.value || "";

  // Score berechnen
  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const selected = form[`q${i}`].value;
    if (selected) score += parseInt(selected);
    payload[`q${i}`] = selected;
  }

  payload.score = score;

  // Bewertung
  if (score <= 7) {
    payload.bewertung = "Kritisch";
    payload.status = "Nicht konform";
    payload.badge_url = "https://check.ki-sicherheit.jetzt/badges/badge-kritisch.png";
  } else if (score <= 13) {
    payload.bewertung = "Ausbaufähig";
    payload.status = "Teilkonform";
    payload.badge_url = "https://check.ki-sicherheit.jetzt/badges/badge-ausbau.png";
  } else {
    payload.bewertung = "KI-Ready 2025";
    payload.status = "Konform";
    payload.badge_url = "https://check.ki-sicherheit.jetzt/badges/KI-READY.png";
  }

  // Datum
  const today = new Date();
  payload.datum = today.toLocaleDateString("de-DE");
  const expiry = new Date(today.getFullYear() + 1, 5, 30); // 30.06. nächstes Jahr
  payload.gueltig_bis = expiry.toLocaleDateString("de-DE");

  // Empfehlungen dynamisch (hier vereinfacht – kann noch optimiert werden)
  payload.empfehlung1 = "Führen Sie ein zentrales Verzeichnis über Ihre KI-Systeme.";
  payload.empfehlung2 = "Prüfen Sie AV-Verträge und rechtliche Vereinbarungen.";
  payload.empfehlung3 = "Stellen Sie eine verständliche KI-Dokumentation bereit.";

  // Senden an Make.com Webhook
  fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    window.location.href = "/danke.html";
  })
  .catch((error) => {
    console.error("Fehler beim Absenden:", error);
    alert("Es ist ein Fehler aufgetreten. Bitte erneut versuchen.");
  });
});
