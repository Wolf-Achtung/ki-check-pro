document.getElementById("kiCheckForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let score = 0;
  for (let i = 1; i <= 10; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) score += parseInt(selected.value);
  }

  const ergebnis = document.getElementById("ergebnis");
  const text = document.getElementById("bewertungText");
  const proBtn = document.getElementById("proLink");

  ergebnis.classList.remove("hidden");

  let bewertung = "";
  let status = "";
  let badge = "";

  if (score <= 7) {
    bewertung = "Kritisch";
    status = "Nicht konform";
    badge = "https://check.ki-sicherheit.jetzt/badges/badge-kritisch.png";
    text.innerHTML = "<strong>Kritisch:</strong> Ihr KI-Einsatz weist gravierende Lücken auf.";
  } else if (score <= 13) {
    bewertung = "Ausbaufähig";
    status = "Teilkonform";
    badge = "https://check.ki-sicherheit.jetzt/badges/badge-ausbau.png";
    text.innerHTML = "<strong>Ausbaufähig:</strong> Erste Strukturen sind erkennbar – handeln Sie jetzt!";
  } else {
    bewertung = "KI-Ready 2025";
    status = "Konform";
    badge = "https://check.ki-sicherheit.jetzt/badges/KI-READY.png";
    text.innerHTML = "<strong>KI-Ready 2025:</strong> Sie erfüllen zentrale Anforderungen – gut gemacht!";
  }

  proBtn.classList.remove("hidden");
  proBtn.href = "https://check.ki-sicherheit.jetzt/zertifikat";

  // ✉️ Payload für PDFMonkey über Make
  const payload = {
    score: score,
    bewertung: bewertung,
    status: status,
    empfehlung1: "Führen Sie ein zentrales Verzeichnis über eingesetzte KI-Systeme.",
    empfehlung2: "Prüfen Sie AV-Verträge mit Anbietern wie OpenAI oder Microsoft.",
    empfehlung3: "Ergänzen Sie Ihre Datenschutzerklärung um Informationen zum KI-Einsatz.",
    badge_url: badge,
    unternehmen: "Muster GmbH",
    datum: new Date().toLocaleDateString("de-DE"),
    gueltig_bis: "30.06.2026"
  };

  // 🚀 Webhook-Aufruf an Make.com (hier DEINE URL einsetzen!)
fetch("https://hook.eu2.make.com/kuupzg3nxvpy5xm84zb7j8pmrcon2r2r", {
  method: "POST",
  body: JSON.stringify(payload),
  headers: { "Content-Type": "application/json" }
})
.then(() => {
  window.location.href = "/danke.html"; // oder "./danke.html" bei Unterverzeichnis
})
.catch(() => {
  alert("Es ist ein Fehler aufgetreten. Bitte erneut versuchen.");
});

<script>
let current = 0;
const testimonials = document.querySelectorAll('.testimonial');

function showNextTestimonial() {
  testimonials[current].classList.remove('active');
  current = (current + 1) % testimonials.length;
  testimonials[current].classList.add('active');
}

setInterval(showNextTestimonial, 6000); // alle 6 Sekunden wechseln
</script>
