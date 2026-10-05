function loadNavbar() {

    const navbarContainer =
        document.getElementById("navbar-container");

    if (!navbarContainer) {

        console.error(
            "Navbar container not found."
        );

        return;
    }


    navbarContainer.innerHTML = `

        <nav class="navbar navbar-expand-lg weather-navbar">

            <div class="container">

                <!-- =================================================
                     BRAND
                ================================================== -->

                <a
                    class="navbar-brand weather-brand"
                    href="#"
                    data-page="home"
                >

                    <span class="brand-mark">
                        W
                    </span>

                    <span>
                        WeatherGPT
                    </span>

                </a>


                <!-- =================================================
                     MOBILE MENU BUTTON
                ================================================== -->

                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >

                    <span class="navbar-toggler-icon"></span>

                </button>


                <!-- =================================================
                     NAVIGATION
                ================================================== -->

                <div
                    class="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <ul class="navbar-nav ms-auto align-items-lg-center">


                        <!-- ================= HOME ================= -->

                        <li class="nav-item">

                            <a
                                class="nav-link active"
                                href="#"
                                data-page="home"
                            >
                                Home
                            </a>

                        </li>


                        <!-- ================= WEATHER ================= -->

                        <li class="nav-item">

                            <a
                                class="nav-link"
                                href="#"
                                data-page="weather"
                            >
                                Weather
                            </a>

                        </li>


                        <!-- ================= ALERTS ================= -->

                        <li class="nav-item">

                            <a
                                class="nav-link"
                                href="#"
                                data-page="alerts"
                            >
                                Alerts
                            </a>

                        </li>


                        <!-- ================= ADVISORY ================= -->

                        <li class="nav-item">

                            <a
                                class="nav-link"
                                href="#"
                                data-page="advisory"
                            >
                                Advisory
                            </a>

                        </li>


                        <!-- ================= INSIGHTS ================= -->

                        <li class="nav-item">

                            <a
                                class="nav-link"
                                href="#"
                                data-page="insights"
                            >
                                Insights
                            </a>

                        </li>


                    </ul>

                </div>

            </div>

        </nav>

    `;


    initializeNavbar();

}


/* =========================================================
   NAVBAR EVENTS
========================================================= */

function initializeNavbar() {

    const navLinks =
        document.querySelectorAll(".nav-link");

    const brand =
        document.querySelector(".weather-brand");


    /* =====================================================
       NAVIGATION LINKS
    ====================================================== */

    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const page =
                    this.getAttribute("data-page");


                console.log(
                    "Navigating to:",
                    page
                );


                setActiveNav(this);


                loadPage(page);


                closeMobileNavbar();

            }
        );

    });


    /* =====================================================
       WEATHERGPT LOGO
    ====================================================== */

    if (brand) {

        brand.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const homeLink =
                    document.querySelector(
                        '.nav-link[data-page="home"]'
                    );


                setActiveNav(homeLink);


                loadPage("home");


                closeMobileNavbar();

            }
        );

    }

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function setActiveNav(activeLink) {

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach((link) => {

        link.classList.remove("active");

    });


    if (activeLink) {

        activeLink.classList.add("active");

    }

}


/* =========================================================
   MOBILE NAVBAR
========================================================= */

function closeMobileNavbar() {

    const navbarCollapse =
        document.getElementById("mainNavbar");


    if (
        navbarCollapse &&
        navbarCollapse.classList.contains("show")
    ) {

        const toggleButton =
            document.querySelector(".navbar-toggler");


        if (toggleButton) {

            toggleButton.click();

        }

    }

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function loadPage(page) {

    console.log(
        "Loading page:",
        page
    );


    /* =====================================================
       HOME
    ====================================================== */

    if (page === "home") {

        if (
            typeof loadHome ===
            "function"
        ) {

            loadHome();

        } else {

            console.error(
                "loadHome() function not found."
            );

        }

        return;
    }


    /* =====================================================
       WEATHER
    ====================================================== */

    if (page === "weather") {

        if (
            typeof loadWeather ===
            "function"
        ) {

            loadWeather();

        } else {

            console.error(
                "loadWeather() function not found. Check weather.js."
            );


            showPageError(
                "Weather page could not be loaded."
            );

        }

        return;
    }


    /* =====================================================
       ALERTS
    ====================================================== */

    if (page === "alerts") {

        if (
            typeof loadAlerts ===
            "function"
        ) {

            loadAlerts();

        } else {

            console.error(
                "loadAlerts() function not found. Check alerts.js."
            );


            showPageError(
                "Alerts page could not be loaded."
            );

        }

        return;
    }


    /* =====================================================
       ADVISORY
    ====================================================== */

    if (page === "advisory") {

        if (
            typeof loadAdvisory ===
            "function"
        ) {

            loadAdvisory();

        } else {

            console.error(
                "loadAdvisory() function not found. Check advisory.js."
            );


            showPageError(
                "Advisory page could not be loaded."
            );

        }

        return;
    }


    /* =====================================================
       INSIGHTS
    ====================================================== */

    if (page === "insights") {

        if (
            typeof loadInsights ===
            "function"
        ) {

            console.log(
                "WeatherGPT: Loading professional Insights dashboard..."
            );

            loadInsights();

        } else {

            console.error(
                "loadInsights() function not found. Check insights.js."
            );


            showPageError(
                "Insights page could not be loaded."
            );

        }

        return;
    }


    /* =====================================================
       UNKNOWN PAGE
    ====================================================== */

    console.error(
        "Unknown page:",
        page
    );

}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showPageError(message) {

    const pageContent =
        document.getElementById("page-content");


    if (!pageContent) {

        return;

    }


    pageContent.innerHTML = `

        <main class="simple-page">

            <div class="container">

                <div class="simple-page-content">


                    <h1 class="simple-page-title">

                        Something went wrong

                    </h1>


                    <p class="simple-page-description">

                        ${message}

                    </p>


                </div>

            </div>

        </main>

    `;

}