document.getElementById("kiForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = e.target;
  const getVal = (name) => form[name]?.value?.trim() || "";

  let score = 0;
  for (let i = 1; i <= 10; i++) {
    score += parseInt(getVal("q" + i)) || 0;
  }

  const payload = {
  unternehmen: getVal("unternehmen"),
  datum: new Date().toLocaleDateString("de-DE"),
  gueltig: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("de-DE"),
  score,
  status: getStatus(score),
  bewertung: getBewertung(score),
  badge_url: getBadge(score),
  empfehlung1: getEmpfehlung(score, 0),
  empfehlung2: getEmpfehlung(score, 1),
  empfehlung3: getEmpfehlung(score, 2)
};

  console.log("📦 Payload an Make:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Vielen Dank – Ihr Zertifikat wird erstellt!");
      form.reset();
    } else {
      alert("Fehler beim Versenden: " + res.statusText);
    }
  } catch (err) {
    console.error("❌ Fehler beim Webhook:", err);
    alert("Technischer Fehler – später erneut versuchen.");
  }
});

function getBewertung(score) {
  if (score >= 24) return "KI-Ready 2025";
  if (score >= 18) return "Solide Basis";
  return "Handlungsbedarf";
}

function getStatus(score) {
  if (score >= 24) return "Konform";
  if (score >= 18) return "Ausbaufähig";
  return "Nicht konform";
}

function getBadge(score) {
  if (score >= 24) return "https://check.ki-sicherheit.jetzt/badges/ki-ready-2025.png";
  return "https://check.ki-sicherheit.jetzt/badges/neutral.png";
}

function getEmpfehlung(score, index) {
  const tipps = {
    low: [
      "Erarbeiten Sie eine KI-Strategie.",
      "Führen Sie ein KI-Systemverzeichnis.",
      "Schulen Sie Ihre Mitarbeitenden."
    ],
    medium: [
      "Führen Sie Risikoanalysen durch.",
      "Verstärken Sie Datenschutzmaßnahmen.",
      "Binden Sie externe Beratung ein."
    ],
    high: [
      "Zeigen Sie Best Practices öffentlich.",
      "Nutzen Sie KI-Labels.",
      "Dokumentieren Sie laufende Reviews."
    ]
  };

  if (score < 15) return tipps.low[index];
  if (score < 24) return tipps.medium[index];
  return tipps.high[index];
}
