document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Antworten erfassen
    const getValue = (name) => parseInt(formData.get(name)) || 0;

    const score =
      getValue("q1") +
      getValue("q2") +
      getValue("q3") +
      getValue("q4") +
      getValue("q5") +
      getValue("q6") +
      getValue("q7") +
      getValue("q8") +
      getValue("q9") +
      getValue("q10");

    // Zusatzinfos
    const unternehmen = formData.get("unternehmen") || "Muster GmbH";
    const datum = new Date().toLocaleDateString("de-DE");

    const bewertung = getBewertung(score);
    const status = getStatus(score);
    const badge = getBadge(score);
    const gueltig = getValidUntil();

    // Empfehlungen (3 Tipps passend zum Score)
    const empfehlung1 = getRecommendation(score, 1);
    const empfehlung2 = getRecommendation(score, 2);
    const empfehlung3 = getRecommendation(score, 3);

    const payload = {
      unternehmen,
      datum,
      score,
      bewertung,
      status,
      badge,
      gueltig,
      empfehlung1,
      empfehlung2,
      empfehlung3,
    };

    console.log("📦 Gesendeter Payload:", payload); // Debugausgabe

    // Senden an Make Webhook
    try {
      const res = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Zertifikat wird generiert!");
        form.reset();
      } else {
        alert("Fehler beim Senden. Bitte erneut versuchen.");
      }
    } catch (error) {
      console.error("❌ Fehler beim Webhook-Aufruf:", error);
      alert("Verbindungsfehler. Bitte später erneut versuchen.");
    }
  });

  function getBewertung(score) {
    if (score >= 25) return "Sehr gut – Ihre KI-Prozesse sind weitgehend konform.";
    if (score >= 18) return "Solide – einige Optimierungen empfehlenswert.";
    return "Kritisch – es besteht akuter Handlungsbedarf.";
  }

  function getStatus(score) {
    if (score >= 25) return "KI-Ready 2025";
    if (score >= 18) return "Ausbaufähig";
    return "Nicht konform";
  }

  function getBadge(score) {
  if (score >= 24) {
    return "https://check.ki-sicherheit.jetzt/badges/ki-ready-2025.png";
  }
  return ""; // Kein Badge anzeigen
}

  function getValidUntil() {
    const now = new Date();
    return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear() + 1}`;
  }

  function getRecommendation(score, index) {
    const tipps = {
      low: [
        "Erarbeiten Sie eine grundlegende KI-Strategie.",
        "Erstellen Sie ein vollständiges KI-Verzeichnis.",
        "Definieren Sie Verantwortlichkeiten & Prozesse."
      ],
      medium: [
        "Ergänzen Sie Ihre Risikoanalyse nach EU AI Act.",
        "Überprüfen Sie Datenschutz & Auftragsverarbeitung.",
        "Implementieren Sie eine interne Auditierung."
      ],
      high: [
        "Planen Sie ein externes Assessment Ihrer KI-Systeme.",
        "Nutzen Sie Transparenz-Labels für mehr Vertrauen.",
        "Kommunizieren Sie Ihr KI-Governance-Modell klar."
      ]
    };

    if (score <= 14) return tipps.low[index - 1];
    if (score <= 24) return tipps.medium[index - 1];
    return tipps.high[index - 1];
  }
});
