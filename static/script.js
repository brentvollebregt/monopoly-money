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

        if (jQuery.isEmptyObject(data)){
            window.location.reload(true);
            return;
        }

        if ($('#balance').text().slice(-1) == "K"){
            $('#balance').text(String(data['balance']) + "K");
        } else {
            $('#balance').text(String(data['balance']/1000) + "M");
        }

        var current_names = [];
        for (var i = 0; i < $('#send_money_player').children().length; i++) {
            current_names.push($('#send_money_player').children()[i].text);
        }
        for (var i = 0; i < data['users'].length; i++) {
            if (!(current_names.indexOf(data['users'][i]) >= 0)){
                $('#send_money_player').append('<option value="' + data['users'][i] + '">' + data['users'][i] + '</option>')
            }
        }
        for (var i = 0; i < $('#send_money_player').children().length; i++) {
            if (["Bank", "Free Parking", "Player"].indexOf($('#send_money_player').children()[i].text) !== -1){
                continue;
            }
            if (data['users'].indexOf($('#send_money_player').children()[i].text) == -1){
                $('#send_money_player').children()[i].remove();
            }
        }

        if ($('#free_parking').text().slice(-1) == "K"){
            $('#free_parking').text(String(data['free_parking']) + "K");
        } else {
            $('#free_parking').text(String(data['free_parking']/1000) + "M");
        }

        var current_logs = [];
        for (var i = 0; i < $('#logs').children().length; i++) {
            current_logs.push($('#logs').children()[i].textContent );
        }
        data['logs'] = data['logs'];
        for (var i = 0; i < data['logs'].length; i++) {
            if (!(current_logs.indexOf(data['logs'][i]) >= 0)){
                $('#logs').prepend('<div class="play_scroll_log">' + data['logs'][i] + '</div>');
            }
        }
    });
}

bank_refresh = function(){
    $.get($SCRIPT_ROOT + '/bank_data/', function(data) {

        if (jQuery.isEmptyObject(data)){
            window.location.reload(true);
            return;
        }

        if ($('#free_parking').text().slice(-1) == "K"){
            $('#free_parking').text("Amount: " + String(data['free_parking']) + "K");
        } else {
            $('#free_parking').text("Amount: " + String(data['free_parking']/1000) + "M");
        }

        var current_names = [];
        for (var i = 0; i < $('#send_money_player').children().length; i++) {
            current_names.push($('#send_money_player').children()[i].text);
        }
        for (var i = 0; i < data['users'].length; i++) {
            if (!(current_names.indexOf(data['users'][i]) >= 0)){
                $('#send_money_player').append('<option value="' + data['users'][i] + '">' + data['users'][i] + '</option>')
                $('#send_free_parking_player').append('<option value="' + data['users'][i] + '">' + data['users'][i] + '</option>')
                $('#set_player_bal_player').append('<option value="' + data['users'][i] + '">' + data['users'][i] + '</option>')
                $('#active_players').append('<div style="width: 100%; height: 30%; display: block;"><div style="width: 50%; height: 100%; margin-left: 15%; margin-right: 0px; float: left;"><div class="outer_rel"><div class="middle"><div class="inner"><a class="white_text" style="font-size: 350%; float: left;">' + data['users'][i] + '</a></div></div></div></div><div style="width: 10%; height: 100%; float: right; margin-right: 15%;"><img onclick="javascript:remove_player(this);" value="' + data['users'][i] + '" src="' + close_png_src +'" style="height: 100%;"></div><div style="width: 10%; height: 100%; float: right;"><img onclick="javascript:edit_player_name(this);" value="' + data['users'][i] + '" src="' + edit_png_src +'" class="banker_switch"></div></div>')
            }
        }
        for (var i = 0; i < $('#send_money_player').children().length; i++) {
            if (["Bank", "Free Parking", "Player"].indexOf($('#send_money_player').children()[i].text) !== -1){
                continue;
            }
            var name = $('#send_money_player').children()[i].text
            if (data['users'].indexOf(name) == -1){
                $('#send_money_player').children()[i].remove();
                for (var i = 0; i < $('#send_free_parking_player').children().length; i++){
                    if ($('#send_free_parking_player').children()[i].text == name){
                        $('#send_free_parking_player').children()[i].remove()
                    }
                }
                for (var i = 0; i < $('#set_player_bal_player').children().length; i++){
                    if ($('#set_player_bal_player').children()[i].text == name){
                        $('#set_player_bal_player').children()[i].remove()
                    }
                }
                for (var i = 0; i < $('#active_players').children().length; i++){
                    if ($($('#active_players').children()[i]).find('a').text() == name){
                        $('#active_players').children()[i].remove()
                    }
                }
            }
        }

        if (data['open']){
            if($('#lock_button').text() == "Closed"){
                $('#lock_button').text("Open");
            }
        } else {
            if($('#lock_button').text() == "Open"){
                $('#lock_button').text("Closed");
            }
        }
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

edit_player_name = function(obj){
    var new_name = prompt("New name for " + $(obj).attr('value') + "?");
    if (!(new_name == "" || new_name == null)){
        $.post($SCRIPT_ROOT + '/edit_player_name/', {
            player_name_to_change: $(obj).attr('value'),
            new_name: new_name
        });
    }

    bank_refresh();
}

remove_player = function(obj){
    if (window.confirm("Are you sure you want to remove " + $(obj).attr('value') + "?")){
        $.post($SCRIPT_ROOT + '/remove_player/', {
            player_name_to_remove: $(obj).attr('value')
        });
    }

    bank_refresh();
}

send_money = function(isBank){
    if($('#send_money_amount').val() == ""){
        alert("No amount entered");
        return;
    }
    if($('#send_money_player').val() == null){
        alert("No player selected");
        return;
    }

    if ($('#send_money_MK').text() == "K"){
        var amount = Number($('#send_money_amount').val())
    } else {
        var amount = Number($('#send_money_amount').val()*1000)
    }
    var player = $('#send_money_player').val()

    var success = true;
    $.post($SCRIPT_ROOT + '/send_money/', {
        transfer_amount: amount,
        player_receiving: player,
        banker: isBank
    }, function(data){
        var response = jQuery.parseJSON(data);
        if (!(response['success'])){
            alert(response['reason']);
            success = false;
        }
    });

    if (!success){
        return;
    }

    $('#send_money_player').val("")
    $('#send_money_amount').val("")

    if (window.location['pathname'] == "/bank/"){
        bank_refresh();
    } else {
        play_refresh();
    }
}

send_free_parking = function(){
    $.post($SCRIPT_ROOT + '/send_free_parking/', {
        player: $('#send_free_parking_player').val()
    });

    $('#send_free_parking_player').val("")

    bank_refresh();
}

set_balance = function(){
    if($('#set_player_bal_amount').val() == ""){
        alert("No amount entered");
        return;
    }
    if($('#set_player_bal_player').val() == null){
        alert("No player selected");
        return;
    }

    if ($('#set_player_bal_MK').text() == "K"){
        var amount = Number($('#set_player_bal_amount').val())
    } else {
        var amount = Number($('#set_player_bal_amount').val())*1000
    }
    var player = $('#set_player_bal_player').val()

    $.post($SCRIPT_ROOT + '/set_balance/', {
        set_amount: amount,
        player_to_set: player,
    });

    $('#set_player_bal_player').val("")
    $('#set_player_bal_amount').val("")

    bank_refresh();
}

switch_lock = function(){
    $.post($SCRIPT_ROOT + '/switch_lock/');

    bank_refresh();
}
