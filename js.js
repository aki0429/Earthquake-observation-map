// Create base layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
var stamenToner = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors'
});

// Initialize map with center set to Tokyo Station (35.681236, 139.767125) for both PC and smartphone
var zoomLevel = (window.innerWidth <= 600) ? 11 : 13;
var map = L.map('map', {
    center: [35.681236, 139.767125],
    zoom: zoomLevel,
    layers: [osmLayer]  // default base layer
});
console.log("Map initialized");

// 新たなレイヤーグループを作成
var earthquakeLayer = L.layerGroup().addTo(map);
var inactiveLayer   = L.layerGroup().addTo(map);
var invalidLayer    = L.layerGroup().addTo(map);

// Load JSON for 地震観測者 and add markers to earthquakeLayer
fetch('全国の地震観測者MAP- 地震観測.json')
    .then(response => response.json())
    .then(data => {
        console.log("Loaded 地震観測.json", data);
        data.forEach(user => {
            L.marker([user.latitude, user.longitude])
                .addTo(earthquakeLayer)
                .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a>`);
        });
    })
    .catch(error => console.error("Error loading 地震観測.json:", error));

// Load JSON for 活動休止 and add markers to inactiveLayer
fetch('全国の地震観測者MAP- 活動休止.json')
    .then(response => response.json())
    .then(data => {
        console.log("Loaded 活動休止.json", data);
        var grayIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
        data.forEach(user => {
            L.marker([user.latitude, user.longitude], { icon: grayIcon })
                .addTo(inactiveLayer)
                .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a><br><a href="${user.description2}" target="_blank">${user.description2}</a>`);
        });
    })
    .catch(error => console.error("Error loading 活動休止.json:", error));

// Load JSON for あり得ない人 and add markers to invalidLayer
fetch('全国の地震観測者MAP- あり得ない人.json')
    .then(response => response.json())
    .then(data => {
        console.log("Loaded あり得ない人.json", data);
        const customIcon = L.divIcon({
            html: '<div style="color: red; font-size: 32px;">❌</div>',
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        data.forEach(user => {
            L.marker([user.latitude, user.longitude], { icon: customIcon })
                .addTo(invalidLayer)
                .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a>`);
        });
    })
    .catch(error => console.error("Error loading あり得ない人.json:", error));

// Base layers object for control
var baseLayers = {
    "OpenStreetMap": osmLayer,
    "Stamen Toner": stamenToner
};

// Overlay layers object for control
var overlays = {
    "地震観測者": earthquakeLayer,
    "活動休止": inactiveLayer,
    "あり得ない人": invalidLayer
};

// Add layers control
L.control.layers(baseLayers, overlays).addTo(map);
