const form = document.getElementById("form-busca");
const input = document.getElementById("cidade-input");
const statusEl = document.getElementById("status");
const resultadoEl = document.getElementById("resultado");

function interpretarClima(codigo) {
  const mapa = {
    0: { texto: "Céu limpo", icone: "☀️" },
    1: { texto: "Predominantemente limpo", icone: "🌤️" },
    2: { texto: "Parcialmente nublado", icone: "⛅" },
    3: { texto: "Nublado", icone: "☁️" },
    45: { texto: "Neblina", icone: "🌫️" },
    48: { texto: "Nevoeiro", icone: "🌫️" },
    51: { texto: "Garoa leve", icone: "🌦️" },
    53: { texto: "Garoa moderada", icone: "🌦️" },
    55: { texto: "Garoa intensa", icone: "🌧️" },
    61: { texto: "Chuva fraca", icone: "🌧️" },
    63: { texto: "Chuva moderada", icone: "🌧️" },
    65: { texto: "Chuva forte", icone: "⛈️" },
    80: { texto: "Pancadas de chuva", icone: "🌦️" },
    95: { texto: "Trovoada", icone: "⛈️" }
  };
  return mapa[codigo] || { texto: "Condição variável", icone: "🌡️" };
}

async function buscarClima(cidade) {
  statusEl.textContent = "Buscando...";
  resultadoEl.classList.add("oculto");

  try {
    const geoUrl = `https://open-meteo.com{encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      statusEl.textContent = "Cidade não encontrada.";
      return;
    }
    const local = geoData.results[0];
    const climaUrl = `https://open-meteo.com{local.latitude}&longitude=${local.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const climaRes = await fetch(climaUrl);
    const climaData = await climaRes.json();
    const atual = climaData.current;

    const infoClima = interpretarClima(atual.weather_code);
    const regiao = local.admin1 ? `, ${local.admin1}` : "";

    document.getElementById("nome-cidade").textContent = `${local.name}${regiao} - ${local.country}`;
    document.getElementById("icone-clima").textContent = infoClima.icone;
    document.getElementById("temperatura").textContent = `${Math.round(atual.temperature_2m)}°C`;
    document.getElementById("descricao-clima").textContent = infoClima.texto;
    document.getElementById("umidade").textContent = `${atual.relative_humidity_2m}%`;
    document.getElementById("vento").textContent = `${Math.round(atual.wind_speed_10m)} km/h`;

    statusEl.textContent = "";
    resultadoEl.classList.remove("oculto");
  } catch {
    statusEl.textContent = "Erro ao carregar os dados. Verifique sua conexão.";
  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cidade = input.value.trim();
  if (cidade) buscarClima(cidade);
});

buscarClima("Olinda");

