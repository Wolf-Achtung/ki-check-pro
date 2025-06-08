document.getElementById("kiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

const form = e.target; // wichtig für form.reset()
  const formData = new FormData(form);

  const unternehmen = formData.get("unternehmen")?.trim();
  const name = formData.get("name")?.trim();
  const branche = formData.get("branche")?.trim();
  const freiberuflich = formData.get("selbststaendig");
  const maßnahme = formData.get("massnahmen");

  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const val = parseInt(formData.get(`q1${i > 9 ? 0 : i}`));
    if (!isNaN(val)) score += val;
  }

  let status = "";
  let bewertung = "";
  let badge = "";

  if (score >= 25) {
    status = "konform & zukunftsfit";
    bewertung = "Sehr guter Stand – Ihr Unternehmen ist KI-ready.";
    badge = "https://ki-sicherheit.jetzt/assets/ki-ready-2025.png";
  } else if (score >= 17) {
    status = "teils konform, erweiterbar";
    bewertung = "Guter Ansatz – punktuelle Verbesserungen sinnvoll.";
    badge = "https://ki-sicherheit.jetzt/assets/ki-ready-2025.png";
  } else {
    status = "Grundlagen fehlen";
    bewertung = "Wichtige Voraussetzungen müssen noch geschaffen werden.";
    badge = "https://ki-sicherheit.jetzt/assets/ki-ready-2025.png";
  }

  const empfehlungen = [
    "Nutzen Sie gezielte Schulungen für Mitarbeitende im Umgang mit KI.",
    "Erstellen Sie ein zentrales Verzeichnis der KI-Systeme.",
    "Integrieren Sie Datenschutz und Risikoprüfung frühzeitig in Ihre KI-Projekte."
  ];

  const datum = new Date().toLocaleDateString("de-DE");
  const gueltig = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString("de-DE");


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
    empfehlung3: empfehlungen[2]
  };

    try {
      const res = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Vielen Dank - Ihr Zertifikat wird erstellt!");
        form.reset();
      } else {
        alert("Fehler beim Senden. Bitte erneut versuchen.");
      }
    } catch (error) {
      console.error("Fehler beim Webhook-Aufruf:", error);
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
