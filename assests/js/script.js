
const searchBar = document.getElementById("query");
const searchButton = document.getElementById("searchBtn");
const ipAddressP = document.getElementById("ipAddress");
const locationP = document.getElementById("location");
const timezoneP = document.getElementById("timezone");
const ispP = document.getElementById("isp");

const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 20, attribution: '© <a href ="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);


searchButton.addEventListener('click', onSearchButtonClick);
getInitialIP();

//gets the initial ip address of the website visitor
async function getInitialIP() {
    const request = await fetch('https://api.ipify.org?format=json');
    const response = await request.json();
    if (request.ok) {
        // console.log(`your ip adderss is ${response.ip}`);
        findIPDetails(response.ip);
    }
    else {
        console.error('error in getInitialIP, error status=', request.status);
    }
}


//gets the entered ip address and validates it
async function onSearchButtonClick() {

    const searchIP = searchBar.value.trim();
    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    if (searchIP.length <= 1) {
        alert("wrong ip address");
    }
    else if (!ipRegex.test(searchIP)) {
        alert("wrong ip address format, must follow this pattern x.x.x.x, and each number x between 0 and 255 only");
    }
    else {
        //send the ip to the api to get the details of it
        findIPDetails(searchIP);
    }
}

//passes the ip to the api and returns the details of the location for the api
async function findIPDetails(ip) {
    const key = "at_rVyIXaUDag6rJk1fMVmnwNSzOy6ju";
    const request = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${ip}`);
    const response = await request.json();
    if (request.ok) {
        updateUI(response);
    }
    else {
        console.error('Error in findIPDetails, error status=', request.status);
    }
}

//destructures the nested ip properties and updates the ui
function updateUI(IPDetails) {
    const { ip, location, isp } = IPDetails;
    const { country, region, city, lat, lng, postalCode, timezone } = location;

    ipAddressP.textContent = ip;
    locationP.textContent = `${country}, ${region}, ${city}, ${postalCode}`;
    timezoneP.textContent = 'UTC' + timezone;
    ispP.textContent = isp;

    updateMap(lat, lng, country, region);
}

//updates the map with the specified location 
function updateMap(lat, lng, country, region) {
    map.setView([lat, lng], 13);
    const myMarker = L.marker([lat, lng]).addTo(map);
    myMarker.bindPopup(`Currently entered location.<br> ${region} ${country}`).openPopup();
}