var socket = io.connect("localhost:80");

var player = {
    name: "",
    money: 0
};

ibet = false;
yourbet = [];

colorTable = ["red","green","orange","blue","purple"];

$("#nickname_popup").show();

setInterval(()=>{
    socket.emit("tick");
},100);


socket.on("apostaslog",(data)=>
{
    $("#apostasLog").append("<li style='list-style:none;'><div class='alert alert-success' role='alert'>" + data["name"] + " bet "  + data["money"] + "$ on " + data["color"] + "</div></li>")
});

socket.on("getTime",(data)=>{
    $("#timeleft").text("Lefts " + data + "s for roulette roll.");
});

socket.on("result",(data)=>
{
    $("#resultColor").text(colorTable[data]);
});

socket.on("chathistory",(data)=>
{
    $("#chathistory").append("<li style='list-style:none';>" + data["name"] + ": " + data["message"] + "</li>");
});

$("#sendName").click(()=>{
    if($("#textName").val().length>0)
    {
    socket.emit("name",$("#textName").val());
    }
});

socket.on("name_ok",(data)=>{
    $("#nickname_popup").hide();
    player = {
        name: data, 
        money: 200,
    };
    $("#game").css('opacity','1');
    $("#profileName").text(player.name);
    $("#profileMoney").text("$" + player.money);
});

function updatestatus(player)
{
    $("#profileName").text(player.name);
    $("#profileMoney").text("$" + player.money);
}

  var option = {
    speed: 30,
    duration: 3,
    stopImageNumber : NaN,
};

var rouletter = $('div.roulette');
rouletter.roulette('option', option);

function roll(x) {
    var option = {
        speed: 30,
        duration: 3,
        stopImageNumber : x,
        stopCallback : () => {
            socket.emit("Resultado",x);
            if(ibet == true)
            {
                if(yourbet["color"] == colorTable[x]){
                    player.money = player.money + yourbet["money"]*2;
                    updatestatus(player);
                }
            }
            ibet = false;
            yourbet = [];
            $("#tobetBtn").show();
            $("#mybet").text("Your bet: none" );
            $("#apostasLog").empty();
            $("#chathistory").empty();
        }
    };
    rouletter.roulette('option', option);
    rouletter.roulette('start');
}


$("#clearChat").click(()=>{
    $("#chathistory").empty();
});

socket.on("roll",(data)=>{
    roll(data["numb"]);
});

$("#tobetBtn").click(()=> {
    $(".hover_bkgr_fricc").show();
});

$(".popupCloseButton").click(()=>{ $(".hover_bkgr_fricc").hide();});

$("#betSend").click(()=>{
    var bet = {
        name: player.name,
        color: $("#colorValue").val(),
        money: $("#moneyValue").val() 
    };
    if(player.money >= bet.money){
        player.money = player.money - bet.money;
        updatestatus(player);
        yourbet = bet;
        ibet = true;
        $("#mybet").text("Your bet: " + bet.color);
        $("#tobetBtn").hide();
        $(".hover_bkgr_fricc").hide();
        socket.emit("aposta",bet);
    }else{
        alert("You don't have money for that.");
    }
});

$("#sendMessage").click(()=>{
    socket.emit("chatMessage",{
        name:player.name,
        message:$("#chatMessage").val()
    });
});