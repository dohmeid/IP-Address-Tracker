//***************************************CONSTANTS+Initialization*****************************************8*/
// DOM Elements
const searchBar = document.getElementById("query");
const searchButton = document.getElementById("searchBtn");
const ipAddressP = document.getElementById("ipAddress");
const locationP = document.getElementById("location");
const timezoneP = document.getElementById("timezone");
const ispP = document.getElementById("isp");

// Leaflet Map Initialization
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 20, attribution: '© <a href ="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
updateMap(40.6944, -73.9918, "NY", "Brooklyn")

//constants
const API_KEY = "at_rVyIXaUDag6rJk1fMVmnwNSzOy6ju";
const IP_REGEX = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

searchButton.addEventListener('click', handleSearchButtonClick);
getInitialIP(); // get user's initial IP address on load


//***************************************FUNCTIONS*****************************************8*/
async function getInitialIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        if (!response.ok)
            throw new Error(`Status ${response.status}`);
        await fetchIPDetails(data.ip);
    }
    catch (error) {
        console.error("Failed to get initial IP:", error.message);
    }
}

async function handleSearchButtonClick(e) {
    e.preventDefault();
    const searchIP = searchBar.value.trim();

    if (!searchIP) {
        alert("Please enter an IP address.");
        return;
    }

    if (!IP_REGEX.test(searchIP)) {
        alert("Invalid IP format. It must be like x.x.x.x where x is 0-255.");
        return;
    }

    await fetchIPDetails(searchIP);
}

async function fetchIPDetails(ip) {
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ip}`);
        const data = await response.json();
        console.log('ggggggggggg');
        if (!response.ok)
            throw new Error(`Status ${response.status}`);
        updateUI(data);
    }
    catch (error) {
        console.error(`Failed to fetch IP details for ${ip}:`, error);
        alert("Failed to retrieve IP details. Please try again.");
    }
}

function updateUI(IPDetails) {
    //destructure the nested ip properties
    const { ip, location, isp } = IPDetails;
    const { country, region, city, lat, lng, postalCode, timezone } = location;

    ipAddressP.textContent = ip;
    locationP.textContent = `${country}, ${region}, ${city}, ${postalCode}`;
    timezoneP.textContent = `UTC ${timezone}`;
    ispP.textContent = isp;

    updateMap(lat, lng, country, region);
}

function updateMap(lat, lng, country, region) {
    map.setView([lat, lng], 13);
    const myMarker = L.marker([lat, lng]).addTo(map);
    myMarker.bindPopup(`Currently entered location.<br> ${region} ${country}`).openPopup();
}