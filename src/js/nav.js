"use strict";
document
    .querySelectorAll("a")
    .forEach((anchor) => (anchor.href += `?user=${JSON.parse(localStorage.getItem("currentUser"))}`));
const logoutButton = document.querySelector("#logout");
logoutButton.textContent = `logout(${JSON.parse(localStorage.getItem("currentUser"))})`;
logoutButton.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../../index.html";
});
