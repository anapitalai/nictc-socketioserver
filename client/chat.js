const socket=io.connect('https://realtime.nictconsultants.com')
//const socket = io.connect('http://localhost:3010')

const name = document.getElementById('name')
const message = document.getElementById('message')
const output = document.getElementById('output')
const send = document.getElementById('send')
const typing = document.getElementById('typing')



function plot_map() {

    state = {
        location:
            { lat: null, lon: null}
    }
    if ('geolocation' in navigator) {
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude
            lon = position.coords.longitude
            acc = position.coords.accuracy
            ht = position.coords.height

            console.log(lat, lon, acc, ht)
            this.state = {
                location: {
                    lat: lat,
                    lon: lon
                }
            }

            document.getElementById('latitude').textContent = lat
            document.getElementById('longitude').textContent = lon
            document.getElementById('accuracy').textContent = acc
            document.getElementById('height').textContent = ht

            
            const cords = [this.state.location.lat, this.state.location.lon]
            socket.emit('markers', cords)
            const mymap = L.map('mymap').setView(cords, 6)
            const attribution =
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            const tiles = L.tileLayer(tileUrl, { attribution })
            tiles.addTo(mymap)


            const greenIcon = L.icon({
                iconUrl: 'leaf-green.png',
                shadowUrl: 'leaf-shadow.png',
            
                iconSize:     [38, 95], // size of the icon
                shadowSize:   [50, 64], // size of the shadow
                iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
//L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
            socket.on('marker_location', function(data){

                data.forEach(function(i){

                    L.marker(i).addTo(mymap)
                        .bindPopup('I am at ' + i)
                        .openPopup();

                });
            })

        })


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

//receives the message from the server
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








