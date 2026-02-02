
function toggle_menu_visibility() {
    var x = document.getElementById("menu-nav");
    if (x.className === "menu-nav") {
        x.className += " responsive";
    } else {
        x.className = "menu-nav";
    }
}