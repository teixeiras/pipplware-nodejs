function sysStateHandler(success, content) {
    processorGraphic(content, "myChart");
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("been here, done that");
    $("#content").html($("#loginForm").html());

    //$("#content").html($("#chartProcessor").html());
    //socketHandler.addHandler("sys_state", sysStateHandler);

});
