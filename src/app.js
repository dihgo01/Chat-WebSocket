const { static } = require('express');
const express = require('express');
const { dirname } = require('path');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

var clients = {};

app.use(express.static(path.join(__dirname, '..' ,'public')));
app.set('views', path.join(__dirname, '..','public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
  });

io.on("connection", function (client) {  
    client.on("join", function(name){
    	console.log(name + "entrou na sala!");
        clients[client.id] = name;
        client.emit("update", "Você entrou na sala.");
        client.broadcast.emit("update", name + " entrou na sala.")
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " saiu da sala.");
        delete clients[client.id];
    });
});
  
  http.listen(3000, function(){
    console.log('listening on port 3000');
  });
