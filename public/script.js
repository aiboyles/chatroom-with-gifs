// Connect to the server
var socket = io()

// Prompt newcomer for username.
var username = prompt('Choose a username: ')
socket.emit('new user', username)

// Handle a new incoming message
socket.on('new message', function(msg) {
    // Display the message
    addMessage('<p><span class="username">' + msg.sender + ': </span>' + msg.message + '</p>')
})

// Handle a new user joining
socket.on('new user', function(username) {
    addMessage('<p class="join">' + username + ' has joined the room</p>')
})

// Handle a user disconnecting
socket.on('user left', function (username) {
    addMessage('<p class="leave">' + username + ' has left the room</p>')
})

// Adds a new message to the chat box
function addMessage(msg) {
  // Display the message
    document.getElementById('messages').innerHTML += msg
    
    // Scroll the messages window all the way down
    setTimeout(() => {
      document.querySelector("#messages").scrollTop = document.querySelector("#messages").scrollHeight
    }, 200); 
    
    
}

// Sends a message to the chatroom.
function postMessage() {
    var textBox = document.getElementById('message')
    socket.emit('new message', {sender: username, message: textBox.value})
    textBox.value = ''
}

// Allows me to send a message by hitting
// the "Enter" key
document.addEventListener('keydown', keyCheck)

function keyCheck(e) {
  if (e.code == "Enter") {
    postMessage()
  }
}
