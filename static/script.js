var background_check_delay = 4000

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
    $.getJSON($SCRIPT_ROOT + '/play_data/', function(data) {

        if ($('#balance').text().slice(-1) == "K"){
            $('#balance').text(String(data['balance']*1000) + "K");
        } else {
            $('#balance').text(String(data['balance']) + "M");
        }

        var current_names = [];
        for (var i = 0; i < $('#send_money_player').children().length; i++) {
            current_names.push($('#send_money_player').children()[i].text);
        }
        for (var i = 0; i < data['users'].length; i++) {
            if (!(current_names.indexOf(data['users'][i]) >= 0)){
                $('#send_money_player').append('<option value="user1">' + data['users'][i] + '</option>')
            }
        }

        if ($('#free_parking').text().slice(-1) == "K"){
            $('#free_parking').text(String(data['free_parking']*1000) + "K");
        } else {
            $('#free_parking').text(String(data['free_parking']) + "M");
        }

        var current_logs = [];
        for (var i = 0; i < $('#logs').children().length; i++) {
            current_logs.push($('#logs').children()[i].textContent );
        }
        data['logs'] = data['logs'].reverse();
        for (var i = 0; i < data['logs'].length; i++) {
            if (!(current_logs.indexOf(data['logs'][i]) >= 0)){
                $('#logs').append('<div class="play_scroll_log">' + data['logs'][i] + '</div>');
            }
        }
    });
}

bank_refresh = function(){
    $.get($SCRIPT_ROOT + '/bank_data/', function(data) {

    });
}

leave = function(){
    window.location.href = $SCRIPT_ROOT + '/clear';

}

leave_prep = function(context){
    if (window.confirm("Are you sure you want to " + context)){
        leave();
    }
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

play_background_checks = function(){
    setInterval(function() {
        play_refresh();
    }, background_check_delay);
}

bank_background_checks = function(){
    setInterval(function() {
        bank_refresh();
    }, background_check_delay);
}

send_money = function(){

}