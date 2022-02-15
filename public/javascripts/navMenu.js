const navButton = document.getElementById("nav-button");
const navMenu = document.getElementById("nav-menu");

navButton.addEventListener("click", () => {
    if (navMenu.classList.length == 0) {
        navMenu.classList.add("expand");
    }
    else {
        navMenu.classList.remove("expand");
    }
})