const express = require('express');
const app = express();

var rollgame = false;

var tempoRoleta = 0;
var tp = 0;

var server = app.listen(80,()=>{
    console.log("listen on 80");
});

app.use(express.static('public'));

var io = require('socket.io')(server);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    result = Math.floor(Math.random() * (max - min)) + min;
    return result;
  }

io.on("connection",(socket)=>{

    socket.on("tick",()=>{
        tp = tp +1;
        if(tp>=30){if(tempoRoleta>0){tempoRoleta = tempoRoleta -1;} tp = 0;}
        io.emit("getTime",tempoRoleta);
        if(tempoRoleta <= 0 && rollgame == false ) {
            io.emit("roll",{numb:getRandomInt(0,4)});
            rollgame = true;
        }
    });
    
    socket.on("chatMessage",(data)=>{
        io.emit("chathistory",data);
    });

    socket.on("name",(data)=>{
        socket.emit("name_ok",data);
    });

    socket.on("aposta",(data) => {
        io.emit("apostaslog",data);
    });
    socket.on("Resultado",(data)=>{
        io.emit("result",data);
        tempoRoleta = 10;
        rollgame = false;
        tp = 30;
    });
});