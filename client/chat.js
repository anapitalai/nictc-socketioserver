const socket = io.connect('https://realtime.nictconsultants.com')


const name = document.getElementById('name')
const message = document.getElementById('message')
const output = document.getElementById('output')
const send = document.getElementById('send')
const typing = document.getElementById('typing')



send.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(post => {
        const latitude = post.coords.latitude
        let longitude = post.coords.longitude

        socket.emit('chat', {
            name: name.value,
            latitude: latitude,
            longitude: longitude,
            message: message.value
        })


        message.value = ""
    })



})

socket.on('chat', function (data) {
    typing.innerHTML = ""
    output.innerHTML += '<p><strong>' + data.name + ':</strong>' + data.message + '</p>'

})


//typing
message.addEventListener('keypress', function () {
    socket.emit('typing', name.value)
})

socket.on('typing', function (data) {
    typing.innerHTML = '<p><em>' + data.name + ' is typing a message...' + ' at the coordinates' + latitude + ':' + longitude + ':</em></p>'

})

