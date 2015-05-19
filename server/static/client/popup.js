dataCtx = {};

function sysStateHandler(success, content) {
    processorGraphic(content, "myChart");
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("been here, done that");
    $("#content").html($("#loginForm").html());

    var optionsUrl = chrome.extension.getURL("gamepad.html");
    var content = '<a href="' + optionsUrl + '" target="_blank">Options</a>';

    $("#content").append($(content));


    function saveChanges() {
        // Get a value saved in a form.
        var theValue = textarea.value;
        // Check that there's some code there.
        if (!theValue) {
            message('Error: No value specified');
            return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'value': theValue}, function() {
            // Notify that we saved.
            message('Settings saved');
        });
    }

    //$("#content").html($("#chartProcessor").html());
    //socketHandler.addHandler("sys_state", sysStateHandler);

});


