var socket = io.connect("localhost:80");

var player = {
    name: "",
    money: 0
};

colorTable = ["Vermelho","Verde","Laranja","Azul","Roxo"];

$("#nickname_popup").show();

setInterval(()=>{
    socket.emit("tick");
},100);


socket.on("getTime",(data)=>{
    $("#timeleft").text("Lefts " + data + "s for roulette roll.");
});

socket.on("result",(data)=>
{
    var color = "";
    if(colorTable[data] == "Vermelho")
    {
        color = "red";
    }
    if(colorTable[data] == "Verde"){
        color = "verde";
    }
    if(colorTable[data] == "Laranja"){
        color = "orange";
    }
    if(colorTable[data] == "Azul"){
        color = "blue";
    }
    if(colorTable[data] === "Roxo"){
        color = "purple";
    }
    $("#resultColor").text(colorTable[data]);
    $("#resultColor").css("color", color);
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
        }
    };
    rouletter.roulette('option', option);
    rouletter.roulette('start');
}


socket.on("roll",(data)=>{
    roll(data["numb"]);
});

$("#tobetBtn").click(()=> {
    $(".hover_bkgr_fricc").show();
});

$(".popupCloseButton").click(()=>{ $(".hover_bkgr_fricc").hide();});
