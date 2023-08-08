var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fetch = require('node-fetch');

app.use(express.static(path.join(__dirname, 'public')));

const giphyApiKey = process.env['GIPHY_API_KEY']

// Handle a new connection
io.on('connection', function(socket) {
    var username
    // When someone creates a username and joins, tell everyone
    socket.on('new user', function(user) {
      username = user
      io.emit('new user', user)
    })
    
    // When someone sends a message, send it out to everyone
    socket.on('new message', function(msg) {

      console.log(msg.message.substring(0, 2))

      console.log(msg.message.substring(3).trim())

      if (msg.message.substring(0, 2) === "/g") {
        var search = msg.message.substring(3).trim()

        var requrl = "http://api.giphy.com/v1/gifs/translate?api_key=" + giphyApiKey + "&weirdness=5&s=" + search
  
        fetch(requrl)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          msg.message = "</br><img src='" + data.data.images.fixed_height.url + "'></br>"

          console.log(msg.message)
          io.emit('new message', msg)
        })
        .catch(err => 
          console.log(err)
        )
      } else {
        io.emit('new message', msg)
      }

      
    })
    
    // When someone disconnects, tell everyone
    socket.on('disconnect', function() {
      io.emit('user left', username)
    })
})

http.listen(3000, function() {
    console.log('Listening on port 3000')
})