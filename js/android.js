if (navigator.onLine == false) {
    document.getElementById("noConnection").style.display = "flex";
    document.getElementById("stepZero").style.display = "none";
};
function exitPage() {
    document.getElementById("sideMenu").style.left = "-280px";
    document.getElementById("menuBackground").style.display = "none";
    document.getElementById("exitApp").style.display = "flex";
};
document.getElementById("cancelExit").onclick = function() {
    document.getElementById("exitApp").style.display = "none";
}
document.getElementById("doExit").onclick = function() {
    Android.exitLipighorApp();
}
document.getElementById("openMenu").onclick = function() {
    document.getElementById("sideMenu").style.left = "0px";
    document.getElementById("menuBackground").style.display = "block";
}
document.getElementById("menuBackground").onclick = function() {
    document.getElementById("sideMenu").style.left = "-280px";
    document.getElementById("menuBackground").style.display = "none";
}
document.getElementById("openAbout").onclick = function() {
    document.getElementById("sideMenu").style.left = "-280px";
    document.getElementById("menuBackground").style.display = "none";
    document.getElementById("aboutApp").style.display = "flex";
};
document.getElementById("closeAbout").onclick = function() {
    document.getElementById("aboutApp").style.display = "none";
};
$("html").on("pointerdown", ".btn", function(evt) {
    var btn = $(evt.currentTarget);
    var x = evt.pageX - btn.offset().left;
    var y = evt.pageY - btn.offset().top;

    $("<span class='ripple'/>").appendTo(btn).css({
        left: x,
        top: y
    });
});
$("html").on("pointerup", ".btn", function(evt) {
    setTimeout(function() {
        $('.ripple').remove();
    }, 500);
});