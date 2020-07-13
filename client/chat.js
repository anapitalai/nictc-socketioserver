const socket=io.connect('https://realtime.nictconsultants.com')


const name=document.getElementById('name')
const message=document.getElementById('message')
const output=document.getElementById('output')
const send=document.getElementById('send')
const typing=document.getElementById('typing')



send.addEventListener('click',function(){
    socket.emit('chat',{
        name:name.value,
        message:message.value    
    })

message.value=""
})

socket.on('chat',function(data){
    typing.innerHTML=""
    output.innerHTML += '<p><strong>' + data.name + ':</strong>'+ data.message + '</p>'

})


//typing
message.addEventListener('keypress',function(){
    socket.emit('typing',name.value)
})

socket.on('typing',function(data){
    typing.innerHTML = '<p><em>' + data + ' is typing a message...' + ':</em></p>'

})

