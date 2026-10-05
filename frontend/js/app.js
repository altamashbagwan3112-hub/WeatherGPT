document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("app");

    app.innerHTML = `
        <div id="navbar-container"></div>

        <main id="page-content"></main>
    `;

    loadNavbar();
    loadHome();

});