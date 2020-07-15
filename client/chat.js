const socket=io.connect('https://realtime.nictconsultants.com')
//const socket = io.connect('http://localhost:3010')

const name = document.getElementById('name')
const message = document.getElementById('message')
const output = document.getElementById('output')
const send = document.getElementById('send')
const typing = document.getElementById('typing')



function plot_map() {
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude
            lon = position.coords.longitude
            acc = position.coords.accuracy
            ht = position.coords.height
            console.log(lat, lon, acc, ht)
            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = lon;
            document.getElementById('accuracy').textContent = acc;
            document.getElementById('height').textContent = ht;


            const mymap = L.map('mymap').setView([lat, lon], 5);
            const attribution =
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const tiles = L.tileLayer(tileUrl, { attribution });
            tiles.addTo(mymap);
            const current_marker = L.marker([lat, lon]).addTo(mymap)
                .bindPopup('My location<br>')
                .openPopup();
                
            socket.emit('map', {
                name: name.value,
                lat: lat,
                lon: lon
            })
            socket.on('map', function (data) {
                console.log(data)
                const marker = L.marker([data.lat, data.lon]).addTo(mymap)
                    .bindPopup('Remote Location<br>')
                    .openPopup();
    
            })

        })

        //typing

    /**    socket.on('map', function (data) {
            const marker = L.marker([data.lat, data.lon]).addTo(mymap)
                .bindPopup('Your location<br>')
                .openPopup();

        })
**/
    } else {
        console.log('geolocation not available');
    }

}
//invoke map function
plot_map()


send.addEventListener('click', function () {

    socket.emit('chat', {
        name: name.value,
        message: message.value
    })

    message.value = ""
})

socket.on('chat', function (data) {
    typing.innerHTML = ""
    output.innerHTML += '<p><strong>' + data.name + ':</strong>' + data.message + '</p>'

})


//typing
message.addEventListener('keypress', function () {
    socket.emit('typing', {
        name: name.value,
        lat: lat,
        lon: lon
    })
})

socket.on('typing', function (data) {
    typing.innerHTML = '<p><em>' + data.name + ' is typing a message from cordinates [' + data.lat + ':' + data.lon + ']:</em></p>'

})





