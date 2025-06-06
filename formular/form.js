document.getElementById("ki-check-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const form = event.target;

  const formData = new FormData(form);
  const data = {
    unternehmen: formData.get("unternehmen"),
    name: formData.get("name"),
    branche: formData.get("branche"),
    selbststaendig: formData.get("selbststaendig"),
    massnahme: formData.get("massnahme"),
  };

  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const val = parseInt(formData.get(`q${i}`), 10);
    if (!val) {
      alert(`Frage ${i} bitte ausfüllen.`);
      return;
    }
    data[`q${i}`] = val;
    score += val;
  }

  data.score = score;

  if (score >= 26) {
    data.bewertung = "KI-Ready 2025";
    data.status = "Konform";
    data.badge_url = "https://check.ki-sicherheit.jetzt/badges/ki-ready.png";
  } else if (score >= 18) {
    data.bewertung = "Basis-Check bestanden";
    data.status = "Teilweise konform";
    data.badge_url = "https://check.ki-sicherheit.jetzt/badges/basischeck.png";
  } else {
    data.bewertung = "Kritisch";
    data.status = "Nicht konform";
    data.badge_url = "https://check.ki-sicherheit.jetzt/badges/risikoalarm.png";
  }

  const heute = new Date();
  const gueltigBis = new Date(heute.getFullYear() + 1, 11, 31);
  data.datum = heute.toLocaleDateString("de-DE");
  data.gueltig_bis = gueltigBis.toLocaleDateString("de-DE");

  // Empfehlungen bei Bedarf hier setzen
  data.empfehlung1 = "Richten Sie ein KI-Verzeichnis ein.";
  data.empfehlung2 = "Schulen Sie Mitarbeitende im KI-Einsatz.";
  data.empfehlung3 = "Nutzen Sie unseren Risikoalarm oder ein Audit.";

  try {
    const response = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Webhook-Fehler");
    alert("Vielen Dank! Ihr Zertifikat wird jetzt erstellt.");
    form.reset();
  } catch (err) {
    console.error("Fehler beim Absenden:", err);
    alert("Es gab ein Problem. Bitte später erneut versuchen.");
  }
});
