/* =========================================================
   WEATHERGPT
   PROFESSIONAL WEATHER ALERT CENTER
========================================================= */

const ALERTS_API_URL =
    "http://127.0.0.1:8000/api/alerts";

let alertsPageInstance = 0;
let alertsRequestInstance = 0;


/* =========================================================
   LOAD ALERTS PAGE
========================================================= */

function loadAlerts() {

    const pageContent =
        document.getElementById("page-content");

    if (!pageContent) {
        console.error(
            "WeatherGPT: page-content not found."
        );
        return;
    }

    const pageInstance =
        ++alertsPageInstance;

    alertsRequestInstance++;

    pageContent.innerHTML = `

        <main class="alerts-page">

            <!-- =========================================
                 HERO
            ========================================== -->

            <section class="alerts-hero">

                <div class="container">

                    <div class="alerts-hero-content">

                        <span class="alerts-label">
                            WEATHER ALERT CENTER
                        </span>

                        <h1>
                            Stay ahead of severe weather.
                        </h1>

                        <p>
                            Monitor upcoming weather conditions,
                            understand potential risks and prepare
                            before changing conditions affect your plans.
                        </p>

                    </div>


                    <!-- SEARCH -->

                    <div class="alerts-search-section">

                        <div class="alerts-search-box">

                            <span class="alerts-search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                id="alertsLocationInput"
                                value="Solapur"
                                placeholder="Search city or location..."
                                autocomplete="off"
                            >

                            <button
                                type="button"
                                id="alertsSearchButton"
                            >
                                Check Weather Risk
                            </button>

                        </div>


                        <button
                            type="button"
                            id="alertsCurrentLocationButton"
                            class="alerts-location-button"
                        >
                            Use current location
                        </button>


                        <p class="alerts-search-help">
                            Enter any city worldwide to analyze upcoming
                            weather conditions.
                        </p>

                    </div>


                    <!-- STATUS -->

                    <div
                        id="alertsStatus"
                        class="alerts-status"
                    ></div>

                </div>

            </section>


            <!-- =========================================
                 MAIN CONTENT
            ========================================== -->

            <section class="alerts-content">

                <div class="container">

                    <div
                        id="alertsDashboard"
                        class="alerts-dashboard"
                    >

                        <div class="alerts-loading">

                            <div class="alerts-spinner"></div>

                            <p>
                                Analyzing upcoming weather conditions...
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =========================================
                 INFORMATION
            ========================================== -->

            <section class="alerts-information">

                <div class="container">

                    <div class="alerts-info-card">

                        <div class="alerts-info-icon">
                            i
                        </div>

                        <div>

                            <h3>
                                About WeatherGPT risk analysis
                            </h3>

                            <p>
                                These risk indicators are generated
                                from forecast data. They help you
                                understand potentially important
                                weather conditions but are not official
                                government warnings.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    `;


    initializeAlerts();

    fetchAlerts(
        "Solapur",
        pageInstance
    );
}


/* =========================================================
   INITIALIZE ALERT CONTROLS
========================================================= */

function initializeAlerts() {

    const searchButton =
        document.getElementById(
            "alertsSearchButton"
        );

    const locationInput =
        document.getElementById(
            "alertsLocationInput"
        );

    const currentLocationButton =
        document.getElementById(
            "alertsCurrentLocationButton"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                searchAlerts();

            }
        );

    }


    if (locationInput) {

        locationInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchAlerts();

                }

            }
        );

    }


    if (currentLocationButton) {

        currentLocationButton.addEventListener(
            "click",
            function () {

                getAlertsCurrentLocation();

            }
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function searchAlerts() {

    const input =
        document.getElementById(
            "alertsLocationInput"
        );

    if (!input) {
        return;
    }


    const city =
        input.value.trim();


    if (!city) {

        showAlertsStatus(
            "Please enter a city or location.",
            "error"
        );

        input.focus();

        return;
    }


    const pageInstance =
        alertsPageInstance;


    fetchAlerts(
        city,
        pageInstance
    );
}


/* =========================================================
   FETCH ALERTS
========================================================= */

async function fetchAlerts(
    city,
    pageInstance = alertsPageInstance
) {

    const requestInstance =
        ++alertsRequestInstance;


    showAlertsStatus(
        `Analyzing weather risks for ${city}...`,
        "loading"
    );


    showAlertsLoading();


    try {

        const response =
            await fetch(
                `${ALERTS_API_URL}?city=${encodeURIComponent(city)}`,
                {
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (
            requestInstance !==
            alertsRequestInstance
        ) {
            return;
        }


        if (
            pageInstance !==
            alertsPageInstance
        ) {
            return;
        }


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to fetch weather alert data."
            );

        }


        if (
            result.status === "error"
        ) {

            throw new Error(
                result.detail ||
                "Weather alert information is unavailable."
            );

        }


        const data =
            result.data || result;


        renderAlertsDashboard(
            data
        );


        showAlertsStatus(
            `Weather risk analysis updated for ${city}.`,
            "success"
        );


        console.log(
            "WeatherGPT: Alert analysis updated successfully."
        );

    }

    catch (error) {

        console.error(
            "WeatherGPT alerts error:",
            error
        );


        if (
            requestInstance !==
            alertsRequestInstance
        ) {
            return;
        }


        showAlertsError(
            error.message
        );


        showAlertsStatus(
            "Unable to load weather risk information.",
            "error"
        );

    }

}


/* =========================================================
   RENDER DASHBOARD
========================================================= */

function renderAlertsDashboard(
    data
) {

    const container =
        document.getElementById(
            "alertsDashboard"
        );


    if (!container) {
        return;
    }


    const alerts =
        getAlertsArray(data);


    const city =
        data.city ||
        data.location ||
        "Selected location";


    const country =
        data.country ||
        "";


    const severeCount =
        alerts.filter(
            alert =>
                normalizeSeverity(
                    alert.severity
                ) === "severe"
        ).length;


    const warningCount =
        alerts.filter(
            alert =>
                normalizeSeverity(
                    alert.severity
                ) === "warning"
        ).length;


    const watchCount =
        alerts.filter(
            alert =>
                normalizeSeverity(
                    alert.severity
                ) === "watch"
        ).length;


    const highestSeverity =
        getHighestSeverity(
            alerts
        );


    container.innerHTML = `

        <!-- =========================================
             LOCATION SUMMARY
        ========================================== -->

        <section class="alerts-location-card">

            <div>

                <span class="alerts-section-label">
                    WEATHER OUTLOOK
                </span>

                <h2>
                    ${escapeHtml(city)}
                    ${country
                        ? `, ${escapeHtml(country)}`
                        : ""
                    }
                </h2>

                <p>
                    Upcoming weather conditions and
                    potential risk indicators.
                </p>

            </div>


            <div class="alerts-risk-status ${getSeverityClass(highestSeverity)}">

                <span class="risk-status-dot"></span>

                <span>
                    ${getSeverityLabel(highestSeverity)}
                </span>

            </div>

        </section>


        <!-- =========================================
             SUMMARY CARDS
        ========================================== -->

        <section class="alerts-summary-grid">

            <div class="alerts-summary-card">

                <span>
                    Active risks
                </span>

                <strong>
                    ${alerts.length}
                </strong>

                <small>
                    Conditions detected
                </small>

            </div>


            <div class="alerts-summary-card">

                <span>
                    Severe
                </span>

                <strong>
                    ${severeCount}
                </strong>

                <small>
                    Higher-priority risks
                </small>

            </div>


            <div class="alerts-summary-card">

                <span>
                    Warning
                </span>

                <strong>
                    ${warningCount}
                </strong>

                <small>
                    Conditions to monitor
                </small>

            </div>


            <div class="alerts-summary-card">

                <span>
                    Watch
                </span>

                <strong>
                    ${watchCount}
                </strong>

                <small>
                    Conditions to observe
                </small>

            </div>

        </section>


        <!-- =========================================
             ALERTS
        ========================================== -->

        <section class="alerts-list-section">

            <div class="alerts-section-heading">

                <div>

                    <span class="alerts-section-label">
                        WEATHER RISKS
                    </span>

                    <h2>
                        Conditions to watch
                    </h2>

                </div>

                <span class="alerts-count">
                    ${alerts.length}
                    ${alerts.length === 1
                        ? "condition"
                        : "conditions"
                    }
                </span>

            </div>


            ${
                alerts.length
                    ? alerts
                        .map(
                            alert =>
                                createAlertCard(
                                    alert
                                )
                        )
                        .join("")
                    : createNoAlertsState()
            }

        </section>


        <!-- =========================================
             PLANNING GUIDANCE
        ========================================== -->

        <section class="alerts-guidance-card">

            <div class="guidance-heading">

                <span class="alerts-section-label">
                    PREPARE AHEAD
                </span>

                <h2>
                    What this means for your plans
                </h2>

                <p>
                    Use the forecast-based indicators below
                    to make practical decisions about travel,
                    outdoor activities and daily plans.
                </p>

            </div>


            <div class="guidance-grid">

                <div class="guidance-item">

                    <span class="guidance-number">
                        01
                    </span>

                    <div>

                        <h3>
                            Check timing
                        </h3>

                        <p>
                            Pay attention to when the
                            highlighted condition is expected.
                        </p>

                    </div>

                </div>


                <div class="guidance-item">

                    <span class="guidance-number">
                        02
                    </span>

                    <div>

                        <h3>
                            Review intensity
                        </h3>

                        <p>
                            Higher-severity conditions
                            deserve additional preparation.
                        </p>

                    </div>

                </div>


                <div class="guidance-item">

                    <span class="guidance-number">
                        03
                    </span>

                    <div>

                        <h3>
                            Plan accordingly
                        </h3>

                        <p>
                            Adjust outdoor, travel or
                            agricultural activities when needed.
                        </p>

                    </div>

                </div>

            </div>

        </section>

    `;
}


/* =========================================================
   ALERT CARD
========================================================= */

function createAlertCard(
    alert
) {

    const severity =
        normalizeSeverity(
            alert.severity
        );


    const title =
        alert.title ||
        alert.short_title ||
        alert.type ||
        "Weather condition";


    const message =
        alert.message ||
        "A potentially important weather condition has been detected.";


    const meaning =
        alert.what_it_means ||
        "";


    const recommendation =
        alert.recommendation ||
        "";


    const time =
        alert.time ||
        alert.time_short ||
        "";


    const temperature =
        alert.temperature;


    const rain =
        alert.rain_probability;


    const wind =
        alert.wind_speed;


    return `

        <article
            class="weather-alert-card ${getSeverityClass(severity)}"
        >

            <div class="alert-card-top">

                <div class="alert-type">

                    <span class="alert-severity-dot"></span>

                    <span class="alert-severity">
                        ${getSeverityLabel(severity)}
                    </span>

                </div>

                ${
                    time
                        ? `
                            <span class="alert-time">
                                ${escapeHtml(time)}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="alert-card-content">

                <h3>
                    ${escapeHtml(title)}
                </h3>

                <p class="alert-message">
                    ${escapeHtml(message)}
                </p>


                ${
                    meaning
                        ? `
                            <div class="alert-detail">

                                <span>
                                    What it means
                                </span>

                                <p>
                                    ${escapeHtml(meaning)}
                                </p>

                            </div>
                          `
                        : ""
                }


                ${
                    recommendation
                        ? `
                            <div class="alert-detail recommendation">

                                <span>
                                    Recommended action
                                </span>

                                <p>
                                    ${escapeHtml(
                                        recommendation
                                    )}
                                </p>

                            </div>
                          `
                        : ""
                }

            </div>


            ${
                temperature !== undefined ||
                rain !== undefined ||
                wind !== undefined
                    ? `
                        <div class="alert-metrics">

                            ${
                                temperature !== undefined
                                    ? `
                                        <div>
                                            <span>
                                                Temperature
                                            </span>

                                            <strong>
                                                ${Math.round(
                                                    Number(
                                                        temperature
                                                    )
                                                )}°
                                            </strong>
                                        </div>
                                      `
                                    : ""
                            }


                            ${
                                rain !== undefined
                                    ? `
                                        <div>
                                            <span>
                                                Rain chance
                                            </span>

                                            <strong>
                                                ${Math.round(
                                                    Number(
                                                        rain
                                                    )
                                                )}%
                                            </strong>
                                        </div>
                                      `
                                    : ""
                            }


                            ${
                                wind !== undefined
                                    ? `
                                        <div>
                                            <span>
                                                Wind
                                            </span>

                                            <strong>
                                                ${formatWind(
                                                    wind
                                                )}
                                            </strong>
                                        </div>
                                      `
                                    : ""
                            }

                        </div>
                      `
                    : ""
            }

        </article>

    `;
}


/* =========================================================
   NO ALERTS
========================================================= */

function createNoAlertsState() {

    return `

        <div class="alerts-empty-state">

            <div class="empty-icon">
                ✓
            </div>

            <div>

                <h3>
                    No significant weather risks detected
                </h3>

                <p>
                    No major forecast-based risk indicators
                    were identified in the available forecast.
                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   LOADING
========================================================= */

function showAlertsLoading() {

    const container =
        document.getElementById(
            "alertsDashboard"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="alerts-loading">

            <div class="alerts-spinner"></div>

            <p>
                Analyzing upcoming weather conditions...
            </p>

        </div>

    `;
}


/* =========================================================
   ERROR
========================================================= */

function showAlertsError(
    message
) {

    const container =
        document.getElementById(
            "alertsDashboard"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="alerts-error-card">

            <div class="alerts-error-icon">
                !
            </div>

            <div>

                <h3>
                    Weather analysis unavailable
                </h3>

                <p>
                    We couldn't retrieve the latest weather
                    risk information right now.
                </p>

                <button
                    type="button"
                    class="alerts-retry-button"
                    onclick="retryAlerts()"
                >
                    Try again
                </button>

            </div>

        </div>

    `;
}


/* =========================================================
   RETRY
========================================================= */

function retryAlerts() {

    const input =
        document.getElementById(
            "alertsLocationInput"
        );


    const city =
        input && input.value.trim()
            ? input.value.trim()
            : "Solapur";


    fetchAlerts(
        city,
        alertsPageInstance
    );
}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function getAlertsCurrentLocation() {

    if (!navigator.geolocation) {

        showAlertsStatus(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;
    }


    showAlertsStatus(
        "Detecting your current location...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            fetchAlertsByCoordinates(
                latitude,
                longitude
            );

        },

        function () {

            showAlertsStatus(
                "Unable to access your location. Please search for a city.",
                "error"
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }

    );

}


/* =========================================================
   COORDINATE ALERTS
========================================================= */

async function fetchAlertsByCoordinates(
    latitude,
    longitude
) {

    showAlertsStatus(
        "Analyzing weather near your location...",
        "loading"
    );


    showAlertsLoading();


    try {

        /*
           The current alert endpoint works by city.
           First obtain current weather from coordinates,
           then use the returned city for alert analysis.
        */

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/weather/coordinates?lat=${latitude}&lon=${longitude}`,
                {
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to determine your location weather."
            );

        }


        const weather =
            result.data;


        if (!weather || !weather.city) {

            throw new Error(
                "Unable to determine the weather location."
            );

        }


        const input =
            document.getElementById(
                "alertsLocationInput"
            );


        if (input) {

            input.value =
                weather.city;

        }


        await fetchAlerts(
            weather.city,
            alertsPageInstance
        );

    }

    catch (error) {

        console.error(
            "WeatherGPT alert location error:",
            error
        );


        showAlertsError(
            error.message
        );


        showAlertsStatus(
            "Unable to load weather risk information.",
            "error"
        );

    }

}


/* =========================================================
   STATUS
========================================================= */

function showAlertsStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "alertsStatus"
        );


    if (!status) {
        return;
    }


    status.textContent =
        message;


    status.className =
        `alerts-status ${type}`;

}


/* =========================================================
   ALERT ARRAY NORMALIZATION
========================================================= */

function getAlertsArray(
    data
) {

    if (!data) {
        return [];
    }


    if (Array.isArray(data)) {
        return data;
    }


    if (Array.isArray(data.alerts)) {
        return data.alerts;
    }


    if (
        data.data &&
        Array.isArray(data.data.alerts)
    ) {
        return data.data.alerts;
    }


    return [];

}


/* =========================================================
   SEVERITY
========================================================= */

function normalizeSeverity(
    severity
) {

    const value =
        String(
            severity || ""
        ).toLowerCase();


    if (
        value.includes("severe") ||
        value.includes("high") ||
        value.includes("danger")
    ) {
        return "severe";
    }


    if (
        value.includes("warning") ||
        value.includes("moderate")
    ) {
        return "warning";
    }


    return "watch";
}


function getHighestSeverity(
    alerts
) {

    if (!alerts.length) {
        return "normal";
    }


    if (
        alerts.some(
            alert =>
                normalizeSeverity(
                    alert.severity
                ) === "severe"
        )
    ) {
        return "severe";
    }


    if (
        alerts.some(
            alert =>
                normalizeSeverity(
                    alert.severity
                ) === "warning"
        )
    ) {
        return "warning";
    }


    return "watch";
}


function getSeverityClass(
    severity
) {

    if (severity === "severe") {
        return "severity-severe";
    }


    if (severity === "warning") {
        return "severity-warning";
    }


    if (severity === "watch") {
        return "severity-watch";
    }


    return "severity-normal";
}


function getSeverityLabel(
    severity
) {

    if (severity === "severe") {
        return "Severe risk";
    }


    if (severity === "warning") {
        return "Warning";
    }


    if (severity === "watch") {
        return "Watch";
    }


    return "No significant risk";
}


/* =========================================================
   WIND FORMAT
========================================================= */

function formatWind(
    value
) {

    const wind =
        Number(value);


    if (Number.isNaN(wind)) {
        return "—";
    }


    return `${wind.toFixed(1)} m/s`;
}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(
    value
) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.loadAlerts =
    loadAlerts;

window.fetchAlerts =
    fetchAlerts;

window.retryAlerts =
    retryAlerts;

window.getAlertsCurrentLocation =
    getAlertsCurrentLocation;