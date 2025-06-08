document.getElementById("ki-check-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  const unternehmen = formData.get("unternehmen") || "Muster GmbH";
  const name = formData.get("name") || "Max Mustermann";
  const branche = formData.get("branche") || "Nicht angegeben";
  const freiberuflich = formData.get("freiberuflich") === "ja";
  const maßnahme = formData.get("maßnahme") || "Nicht angegeben";
  const benchmark = formData.get("benchmark") === "ja";

  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const val = parseInt(formData.get(`q${i}`)) || 0;
    score += val;
  }

  let bewertung, status, badge;
  if (score >= 25) {
    bewertung = "Exzellent";
    status = "KI-Ready 2025";
    badge = "https://check.ki-sicherheit.jetzt/badges/ki-ready-2025.png";
  } else if (score >= 18) {
    bewertung = "Solide Basis";
    status = "In Vorbereitung";
    badge = "https://check.ki-sicherheit.jetzt/badges/neutral.png";
  } else {
    bewertung = "Ausbaufähig";
    status = "Handlungsbedarf";
    badge = "https://check.ki-sicherheit.jetzt/badges/neutral.png";
  }

  const datum = new Date().toLocaleDateString("de-DE");
  const gueltig = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("de-DE");

  // Handlungsempfehlungen
  const empfehlungen = getEmpfehlungen(score);

  // Benchmark-Daten laden (nur wenn Opt-in)
  let benchmark_durchschnitt = null;
  let benchmark_vergleich = null;

  if (benchmark) {
    const benchmarkData = getBenchmarkData(branche);
    benchmark_durchschnitt = benchmarkData.durchschnitt;
    benchmark_vergleich = benchmarkData.vergleich;
  }

 const payload = {
  unternehmen,
  name,
  branche,
  freiberuflich,
  maßnahme,
  score,
  bewertung,
  status,
  badge,
  datum,
  gueltig,
  empfehlung1: empfehlungen[0],
  empfehlung2: empfehlungen[1],
  empfehlung3: empfehlungen[2],
  benchmark: benchmark
};

// Nur wenn Benchmark aktiv ist und Werte vorhanden sind
if (benchmark && benchmark_durchschnitt && benchmark_vergleich) {
  payload.benchmark_durchschnitt = benchmark_durchschnitt;
  payload.benchmark_vergleich = benchmark_vergleich;
}

console.log("📦 Payload an Make:", JSON.stringify(payload, null, 2));

  try {
    await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    alert("Ihre Eingaben wurden erfolgreich übermittelt.");
    this.reset();
  } catch (error) {
    alert("Fehler beim Absenden. Bitte später erneut versuchen.");
    console.error(error);
  }
});

// Hilfsfunktionen

function getEmpfehlungen(score) {
  if (score >= 25) {
    return [
      "Nutzen Sie Ihre starke Ausgangslage, um KI aktiv in Ihre Kernprozesse zu integrieren.",
      "Skalieren Sie bestehende Pilotprojekte in die Breite.",
      "Stellen Sie ein internes KI-Governance-Team auf."
    ];
  } else if (score >= 18) {
    return [
      "Definieren Sie konkrete Ziele für Ihre KI-Strategie.",
      "Identifizieren Sie datenbasierte Prozesse mit Potenzial.",
      "Sensibilisieren Sie Ihre Teams für KI-Ethik und Datenschutz."
    ];
  } else {
    return [
      "Starten Sie mit einer Bestandsaufnahme Ihrer Daten und IT-Infrastruktur.",
      "Definieren Sie ein Pilotprojekt mit klarem Business-Nutzen.",
      "Holen Sie externe Expertise zur KI-Einführung ins Haus."
    ];
  }
}

function getBenchmarkData(branche) {
  const daten = {
    "Industrie": { durchschnitt: 19, vergleich: "Sie liegen im Mittelfeld der Industrie." },
    "Medien": { durchschnitt: 22, vergleich: "Medienhäuser setzen KI bereits stark ein." },
    "Gesundheitswesen": { durchschnitt: 17, vergleich: "Im Gesundheitsbereich besteht Nachholbedarf." },
    "Bildung": { durchschnitt: 18, vergleich: "Bildungseinrichtungen starten meist noch Pilotprojekte." },
    "Verwaltung": { durchschnitt: 16, vergleich: "Öffentliche Stellen stehen oft noch am Anfang." },
    "Handel": { durchschnitt: 21, vergleich: "Viele Handelsunternehmen nutzen KI in Kundenanalysen." },
    "IT / Software": { durchschnitt: 24, vergleich: "Die IT-Branche ist bei KI führend." },
    "Nicht angegeben": { durchschnitt: null, vergleich: "Kein Benchmark möglich ohne Branchenangabe." }
  };

  return daten[branche] || daten["Nicht angegeben"];
}
