const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 19, attribution: '© <a href ="https://www.openstreetmap.org/copyright"> OpenStreetMap </a> contributors' }).addTo(map);
// Customize the initial view, lat=51 lon=-0.09
map.setView([51.505, -0.09], 13);

//add a marker 
const myMarker = L.marker([51.5, -0.09]).addTo(map);
myMarker.bindPopup("Currently entered location.<br> Easily customizable.").openPopup();

const searchBar = document.getElementById("query");
const searchButton = document.getElementById("searchBtn");
const ipAddressP = document.getElementById("ipAddress");
const locationP = document.getElementById("location");
const timezoneP = document.getElementById("timezone");
const ispP = document.getElementById("isp");

searchButton.addEventListener('click', onSearchButtonClick);

getInitialIP();

async function onSearchButtonClick() {
    //get the search ip and validate it
    const searchIP = searchBar.value.trim();
    console.log(searchIP);

    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

    if (searchIP.length <= 1) {
        alert("wrong ip address");
    }
    else if (!ipRegex.test(searchIP)) {
        alert("wrong ip address format, must follow this pattern n.n.n.n, and each number n between 0 and 255 only");
    }
    else {
        alert("good");
    }

    //send the search ip to the api to get the details of it
    const data = await getIPDetails(searchIP);
    setResults(data);
    //getIPDetails("8.8.8.8");
    // map.setView([data.location.lng,  data.location.lat], 13);
}

async function getIPDetails(ip) {
    console.log("the ip is ", ip);
    const key = "at_rVyIXaUDag6rJk1fMVmnwNSzOy6ju";
    try {
        const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${key}&ipAddress=${ip}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return null;
    }
}

function setResults(IPdata) {
    // Destructure nested properties
    const { ip, location, isp } = IPdata;
    const { country, region, city, lat, lng, postalCode, timezone } = location;

    ipAddressP.textContent = ip;
    locationP.textContent = `${country}, ${region}, ${city}, ${postalCode}`;
    timezoneP.textContent = timezone;
    ispP.textContent = isp;

    map.setView([lat, lng], 13);
    const myMarker2 = L.marker([lat, lng]).addTo(map);
    myMarker2.bindPopup(`${country}, ${region}, ${city}, ${postalCode} <br> Easily customizable.`).openPopup();
}

async function getInitialIP() {

    const data = await getIPDetails("");
    setResults(data);
}



//getInitialIP()
// let cachedIP = null;
/*
async function getInitialIP() {
    if (!cachedIP) {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            alert(`your ip adderss is ${data.ip}`);
            cachedIP = data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    }
}
    */