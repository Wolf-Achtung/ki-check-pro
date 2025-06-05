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

  if (score <= 7) {
    text.innerHTML = "<strong>Kritisch:</strong> Ihr KI-Einsatz weist gravierende Lücken auf.";
    proBtn.classList.remove("hidden");
  } else if (score <= 13) {
    text.innerHTML = "<strong>Ausbaufähig:</strong> Erste Strukturen sind erkennbar – handeln Sie jetzt!";
    proBtn.classList.remove("hidden");
  } else {
    text.innerHTML = "<strong>AI-Ready 2025:</strong> Sie erfüllen zentrale Anforderungen – gut gemacht!";
    proBtn.classList.remove("hidden");
  }

  // Pro-Link z. B. zur Zertifikat-Seite
  proBtn.href = "https://check.ki-sicherheit.jetzt/zertifikat";
});
