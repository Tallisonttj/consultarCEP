let map = L.map("map").setView([-15.7801, -47.9292], 4); // posição inicial Brasil

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// ícone personalizado
let Icon = L.icon({
  iconUrl: "../images/icon-location.svg",
  iconSize: [20, 40],
});

let marker;

let error = document.querySelector(".errorArea");
let msg = document.querySelector(".msg");
async function consultCep(cep) {
  let url = `https://cep.awesomeapi.com.br/json/${cep}`;
  const res = await fetch(url);
  const json = await res.json();

  if (res.status == "400") {
    error.style.display = "flex";
    msg.textContent = "CEP invalido!";
    map.setView([-15.7801, -47.9292], 4);
  }
  if (res.status == "404") {
    error.style.display = "flex";
    msg.textContent = `O CEP ${cep} não foi encontrado!`;
    map.setView([-15.7801, -47.9292], 4);
  }

  console.log(json);
  document.querySelector(".cep").textContent = json.cep || '';
  document.querySelector(".address").textContent = json.address || '';
  document.querySelector(".district").textContent = json.district || '';
  document.querySelector(".city").textContent = json.city || '';
  document.querySelector(".state").textContent = json.state || '';

  let lat = json.lat;
  let lng = json.lng;

  if (marker) {
    map.removeLayer(marker);
  }
  map.setView([lat, lng], 15);

  marker = L.marker([lat, lng], { icon: Icon }).addTo(map);
}
function addCEP() {
  let cep = document.querySelector("#cep");
  if (cep) {
    cep.addEventListener("input", (e) => {
      let cep = e.target.value;
      cep = cep.replace(/\D/g, "");
      cep = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
      e.target.value = cep;
    });
  }

  document.querySelector("#seta").addEventListener("click", () => {
    consultCep(cep.value);
    cep.value = "";
  })
  ;
  document.querySelector("#fechar").addEventListener("click", () => {
    error.style.display = "none";
  });
}

addCEP();
