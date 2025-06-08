document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const getValue = (name) => parseInt(formData.get(name)) || 0;

    const score =
      getValue("q1") + getValue("q2") + getValue("q3") + getValue("q4") + getValue("q5") +
      getValue("q6") + getValue("q7") + getValue("q8") + getValue("q9") + getValue("q10");

    const unternehmen = formData.get("unternehmen") || "Muster GmbH";
    const branche = formData.get("branche") || "Nicht angegeben";
const benchmarking = formData.get("benchmarking")?.toLowerCase() === "ja";
    const datum = new Date().toLocaleDateString("de-DE");

    const bewertung = getBewertung(score);
    const status = getStatus(score);
    const badge = getBadge(score);
    const gueltig = getValidUntil();

    const empfehlung1 = getRecommendation(score, 1);
    const empfehlung2 = getRecommendation(score, 2);
    const empfehlung3 = getRecommendation(score, 3);

    const benchmarkData = benchmarking ? getBenchmarkData(branche) : null;

    const payload = {
      unternehmen,
      branche,
      benchmarking,
      datum,
      score,
      bewertung,
      status,
      badge,
      gueltig,
      empfehlung1,
      empfehlung2,
      empfehlung3,
      benchmark: benchmarkData
    };

    console.log("📦 Gesendeter Payload:", payload);

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
    return "";
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

  function getBenchmarkData(branche) {
    const data = {
      "Industrie": { durchschnitt: 19, vergleich: "Sie liegen im Mittelfeld der Industrie." },
      "Medien": { durchschnitt: 22, vergleich: "Medienhäuser setzen KI bereits stark ein." },
      "Gesundheitswesen": { durchschnitt: 17, vergleich: "Im Gesundheitsbereich besteht Nachholbedarf." },
      "Bildung": { durchschnitt: 18, vergleich: "Bildungseinrichtungen starten meist noch Pilotprojekte." },
      "Verwaltung": { durchschnitt: 16, vergleich: "Öffentliche Stellen stehen oft noch am Anfang." },
      "Handel": { durchschnitt: 21, vergleich: "Viele Handelsunternehmen nutzen KI in Kundenanalysen." },
      "IT / Software": { durchschnitt: 24, vergleich: "Die IT-Branche ist bei KI führend." },
      "Nicht angegeben": { durchschnitt: null, vergleich: "Kein Benchmark möglich ohne Branchenangabe." }
    };

    return data[branche] || data["Nicht angegeben"];
  }
});
