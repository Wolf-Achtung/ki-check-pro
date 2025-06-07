document.getElementById("kiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
const getValue = (name) => {
  const el = form[name];
  if (!el) return "";
  if (el.length && el[0].type === "radio") {
    const checked = [...el].find(e => e.checked);
    return checked ? checked.value : "";
  }
  return el.value || "";
};


  // Punkte pro Frage summieren
  let score = 0;
  for (let i = 1; i <= 10; i++) {
    score += parseInt(getValue("q" + i)) || 0;
  }

  // Bewertung & Status ableiten
  let bewertung = "";
  let status = "";

  if (score >= 24) {
    bewertung = "KI-Ready 2025";
    status = "Konform";
  } else if (score >= 18) {
    bewertung = "Solide Basis";
    status = "Ausbaufähig";
  } else {
    bewertung = "Handlungsbedarf";
    status = "Nicht konform";
  }

  // JSON-Payload erstellen
  const payload = {
    unternehmen: getValue("unternehmen"),
    branche: getValue("branche"),
    selbststaendig: getValue("selbststaendig"),
    massnahmen: getValue("massnahmen"),
    score: score,
    bewertung: bewertung,
    status: status,
    datum: new Date().toLocaleDateString("de-DE"),
    gueltig_bis: "31.12.2025"
  };

// ✅ Debug-Ausgabe prüfen:
console.log("Payload:", payload);

  // PDFMonkey-Webhook senden
  try {
    const response = await fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Vielen Dank! Ihr Zertifikat wird jetzt erstellt.");
      form.reset();
    } else {
      alert("Fehler beim Versenden: " + response.statusText);
    }
  } catch (error) {
    alert("Es ist ein technischer Fehler aufgetreten.");
    console.error(error);
  }
});
