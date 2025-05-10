// Leaflet map initialization
        var map = L.map('map').setView([35.6895, 139.6917], 13); // Default to Tokyo

        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '&copy; <a href="https://www.google.com/intl/ja/help/terms_maps.html">Google</a>'
        }).addTo(map);

        // Load JSON data and add markers
        fetch('全国の地震観測者MAP- 地震観測.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(user => {
                    L.marker([user.latitude, user.longitude]).addTo(map)
                        .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a>`);
                });
            });

        // Load JSON data for inactive users and add gray markers
        fetch('全国の地震観測者MAP- 活動休止.json')
            .then(response => response.json())
            .then(data => {
                var grayIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
                
                data.forEach(user => {
                    L.marker([user.latitude, user.longitude], { 
                        icon: grayIcon
                    }).addTo(map)
                        .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a><br><a href="${user.description2}" target="_blank">${user.description2}</a>`);
                });
            });

        // Load JSON data for invalid users and add red cross markers
        fetch('全国の地震観測者MAP- あり得ない人.json')
            .then(response => response.json())
            .then(data => {
                const customIcon = L.divIcon({
                    html: '<div style="color: red; font-size: 32px;">❌</div>', // サイズを24pxから32pxに変更
                    className: 'custom-div-icon',
                    iconSize: [40, 40], // サイズを[30, 30]から[40, 40]に変更
                    iconAnchor: [20, 20]  // アンカーポイントも調整
                });
                
                data.forEach(user => {
                    L.marker([user.latitude, user.longitude], { 
                        icon: customIcon 
                    }).addTo(map)
                        .bindPopup(`<b>${user.name}</b><br><a href="${user.description}" target="_blank">${user.description}</a>`);
                });
            });
            