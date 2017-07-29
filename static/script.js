switch_balance_format = function(obj){
        var MK = obj.text.slice(-1);
        if (MK == "M"){
            obj.text = String(Number(obj.text.slice(0,-1)) * 1000) + "K"
        } else {
            obj.text = String(Number(obj.text.slice(0,-1)) / 1000) + "M"
        }
    };

switch_char = function(obj){
    var MK = obj.text
    if (MK == "M"){
    obj.text = "K"
    } else {
        obj.text = "M"
    }
}

flash_red = function() {
    $("#pin").css("background", "rgba(224, 31, 31,0.35)");
    $('#pin').fadeTo('slow', 0.3, function()
    {
        $(this).css('background', 'rgba(255,255,255,0.05)');
    }).delay(1000).fadeTo('slow', 1);
}

play_refresh = function(){
    $.get($SCRIPT_ROOT + '/play_data/', function(data) {

    });
}

bank_refresh = function(){
    $.get($SCRIPT_ROOT + '/bank_data/', function(data) {

    });
}

leave = function(){
    window.location.href = $SCRIPT_ROOT + '/clear';
}

check_pin_response = function(data){
    if (data['response'] == 1) {
        window.location.href = $SCRIPT_ROOT + '/game/';
    } else if (data['response'] == 3) {
        $('#pin').val('');
        flash_red();
    } else if (data['response'] == 4) {
        $('#pin').val('');
        alert("Game is currently locked");
        flash_red();
    } else if (data['response'] == 5) {
        $('#pin').val('');
        alert("Name is already taken");
        flash_red();
    }
}

who_starts_first = function(){
    $.get($SCRIPT_ROOT + '/who_starts/', function(data) {
        alert(data['user'] + " starts");
    });
}