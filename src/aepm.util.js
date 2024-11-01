function settings()
{
    document.getElementById("settings").style.display="block"
    document.getElementById("settings").style.animation="settingsanim 1.25s ease-out"
}

function home()
{
    document.getElementById("settings").style.animation="settingsout 1.25s ease-out forwards"
}

function home2()
{
    document.body.style="overflow-y:hidden;"
    document.getElementById("mngm").style.animation="mnout 2s forwards";
    window.scrollTo({ top: 0 });
    document.getElementById("main").style.animation="m2in2 1s forwards";
}

