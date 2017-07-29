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