const express = require('express');
const app = express();

var gameTimeNormal = 10;
var gameTimeRelease = 0;

var rollgame = false;

var server = app.listen(80,()=>{
    console.log("listen on 80");
});

app.use(express.static('public'));

var io = require('socket.io')(server);

io.on("connection",(socket)=>{
    io.emit("welcome");
    socket.on("updateReleased",()=>{
        gameTimeRelease = gameTimeRelease +1;
        if(gameTimeRelease>=90){
            gameTimeRelease = 0;
            if(gameTimeNormal>0)
            {
             gameTimeNormal -=1;
            }
            if(gameTimeNormal <= 0){
                if(rollgame == false){
                io.emit("roll");
                rollgame = true;
                }
            }
        }
        io.emit("gameUpdated",{time:gameTimeNormal});
    });
    socket.on("name",(data)=>{
        io.emit("name_ok",data);
    });
    socket.on("Resultado",(data)=>{
        io.emit("result",data);
        rollgame = false;
         gameTimeNormal = 10;
         gameTimeRelease = 0;

    });
});