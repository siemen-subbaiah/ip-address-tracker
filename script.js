const mapid = document.querySelector('#mapid');
const form = document.querySelector('#form');
const ip = document.querySelector('#ip');
const error = document.querySelector('#error');
const card = document.querySelector('.cards');

let mymap = L.map(mapid);
let lat;
let lng;
let popUptxt1;
let popUptxt2;
let popUptxt3;

//REGEX FOR IP ADDRESS!
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

//INITIALIZE THE MAP!
const displayMap = () => {
  mymap.setView([lat, lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false,
  }).addTo(mymap);
  let marker = L.marker([lat, lng]).addTo(mymap);
  marker.bindPopup(`<b>${popUptxt1}</b><br>${popUptxt2}<br>${popUptxt3}`);
};

//SHOW THE DATA!
const displayData = (data) => {
  card.innerHTML = `
        <div class="card">
          <p>IP Address</p>
          <h1>${data.ip}</h1>
        </div>
        <div class="card">
          <p>Location</p>
          <h1>${data.location.city}, ${data.location.country} ${data.location.postalCode}</h1>
        </div>
        <div class="card">
          <p>Timezone</p>
          <h1>UTC-${data.location.timezone}</h1>
        </div>
        <div class="card">
          <p>ISP</p>
          <h1>${data.isp}</h1>
        </div>
  `;
};

//GET IP INFO!
const getInfo = async () => {
  const res = await fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_QEHVU8EElFhUwd3QEasIsZf1nJkTj&ipAddress=${ip.value}`
  );
  const data = await res.json();
  lat = data.location.lat;
  lng = data.location.lng;
  popUptxt1 = data.location.country;
  popUptxt2 = data.location.city;
  popUptxt3 = data.location.region;
  displayData(data);
  displayMap();
};

//GET INITIAL IP INFO!
const getInitialInfo = async () => {
  const res = await fetch(
    `https://geo.ipify.org/api/v1?apiKey=at_QEHVU8EElFhUwd3QEasIsZf1nJkTj`
  );
  const data = await res.json();
  lat = data.location.lat;
  lng = data.location.lng;
  popUptxt1 = data.location.country;
  popUptxt2 = data.location.city;
  popUptxt3 = data.location.region;
  displayData(data);
  displayMap();
};

//INITIALIZE FORM!
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (ip.value.match(ipRegex)) {
    getInfo();
    ip.value = '';
    error.textContent = '';
  } else {
    error.textContent = 'Enter a valid IP Address';
  }
});

//LOAD IP ON LOAD!
window.addEventListener('load', getInitialInfo);
