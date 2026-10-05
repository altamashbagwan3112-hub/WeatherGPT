/* =========================================================
   WEATHERGPT
   PROFESSIONAL WEATHER ADVISORY DASHBOARD
========================================================= */

const ADVISORY_WEATHER_URL =
    "http://127.0.0.1:8000/api/weather";

const ADVISORY_FORECAST_URL =
    "http://127.0.0.1:8000/api/forecast";

const ADVISORY_WEATHER_COORDINATE_URL =
    "http://127.0.0.1:8000/api/weather/coordinates";

const ADVISORY_FORECAST_COORDINATE_URL =
    "http://127.0.0.1:8000/api/forecast/coordinates";


/* =========================================================
   LOAD PAGE
========================================================= */

function loadAdvisory() {

    const pageContent =
        document.getElementById("page-content");

    if (!pageContent) return;

    pageContent.innerHTML = `

        <main class="advisory-page">

            <!-- HERO -->
            <section class="advisory-hero">

                <div class="container">

                    <div class="advisory-hero-top">

                        <div>

                            <div class="advisory-eyebrow">
                                WEATHERGPT
                                <span></span>
                                SMART WEATHER ADVISORY
                            </div>

                            <h1>
                                Weather intelligence
                                <strong>for your next decision.</strong>
                            </h1>

                            <p>
                                Understand what matters now,
                                what may change next and how
                                the weather could affect your plans.
                            </p>

                        </div>

                        <div class="advisory-live-badge">
                            <span></span>
                            LIVE WEATHER DATA
                        </div>

                    </div>


                    <!-- SEARCH -->

                    <div class="advisory-search">

                        <div class="search-location-icon">
                            ⌖
                        </div>

                        <div class="search-field">

                            <label>
                                LOCATION
                            </label>

                            <input
                                id="advisoryLocationInput"
                                type="text"
                                placeholder="Enter city or location"
                                autocomplete="off"
                            >

                        </div>

                        <button
                            id="advisorySearchButton"
                            class="search-action"
                        >
                            Get Advisory
                        </button>

                        <button
                            id="advisoryLocationButton"
                            class="location-action"
                        >
                            ◎
                            Current location
                        </button>

                    </div>

                    <div
                        id="advisoryStatus"
                        class="advisory-status"
                    ></div>

                </div>

            </section>


            <!-- MAIN -->

            <section class="advisory-main">

                <div class="container">


                    <!-- LOCATION -->

                    <div
                        id="advisoryLocationSummary"
                        class="location-overview"
                    >

                        <div>

                            <div class="live-location">
                                <span></span>
                                LIVE ADVISORY
                            </div>

                            <h2>
                                Loading location...
                            </h2>

                            <p>
                                Analyzing current and upcoming weather.
                            </p>

                        </div>


                        <div
                            id="advisoryOverallStatus"
                            class="overall-status"
                        >
                            ANALYZING
                        </div>

                    </div>


                    <!-- IMPORTANT NOW -->

                    <section class="advisory-section">

                        <div class="section-heading">

                            <div>

                                <span>
                                    AT A GLANCE
                                </span>

                                <h2>
                                    What matters right now
                                </h2>

                            </div>

                        </div>


                        <div
                            id="advisoryCurrentConditions"
                            class="weather-overview-grid"
                        ></div>

                    </section>


                    <!-- SMART GUIDANCE -->

                    <section class="advisory-section">

                        <div class="section-heading">

                            <div>

                                <span>
                                    ACTION CENTER
                                </span>

                                <h2>
                                    What should you do?
                                </h2>

                                <p>
                                    Practical guidance based on
                                    current and upcoming conditions.
                                </p>

                            </div>

                        </div>


                        <div
                            id="advisoryCards"
                            class="guidance-grid"
                        ></div>

                    </section>


                    <!-- PLANNING -->

                    <section class="advisory-section">

                        <div class="section-heading">

                            <div>

                                <span>
                                    LOOKING AHEAD
                                </span>

                                <h2>
                                    Plan around the weather
                                </h2>

                            </div>

                        </div>


                        <div
                            id="advisoryPlanning"
                            class="planning-dashboard"
                        ></div>

                    </section>


                    <!-- SAFETY -->

                    <section class="advisory-section safety-section">

                        <div
                            id="advisorySafety"
                        ></div>

                    </section>


                </div>

            </section>

        </main>

    `;

    initializeAdvisory();

    fetchAdvisory("Solapur");
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeAdvisory() {

    const searchButton =
        document.getElementById("advisorySearchButton");

    const input =
        document.getElementById("advisoryLocationInput");

    const locationButton =
        document.getElementById("advisoryLocationButton");


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchAdvisory
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    searchAdvisory();

                }

            }
        );

    }


    if (locationButton) {

        locationButton.addEventListener(
            "click",
            getAdvisoryCurrentLocation
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function searchAdvisory() {

    const input =
        document.getElementById("advisoryLocationInput");

    if (!input) return;


    const city =
        input.value.trim();


    if (!city) {

        showAdvisoryStatus(
            "Enter a city or location first.",
            "error"
        );

        return;

    }


    fetchAdvisory(city);
}


/* =========================================================
   FETCH
========================================================= */

async function fetchAdvisory(city) {

    showAdvisoryStatus(
        `Updating weather intelligence for ${city}...`,
        "loading"
    );


    try {

        const weatherResponse =
            await fetch(
                `${ADVISORY_WEATHER_URL}?city=${encodeURIComponent(city)}`
            );


        const weatherResult =
            await weatherResponse.json();


        if (!weatherResponse.ok) {

            throw new Error(
                weatherResult.detail ||
                "Weather data unavailable."
            );

        }


        const forecastResponse =
            await fetch(
                `${ADVISORY_FORECAST_URL}?city=${encodeURIComponent(city)}`
            );


        const forecastResult =
            await forecastResponse.json();


        if (!forecastResponse.ok) {

            throw new Error(
                forecastResult.detail ||
                "Forecast data unavailable."
            );

        }


        renderAdvisory(
            weatherResult.data,
            forecastResult.data
        );


        showAdvisoryStatus(
            `Live advisory updated for ${weatherResult.data.city}.`,
            "success"
        );


    } catch (error) {

        console.error(error);

        showAdvisoryStatus(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function getAdvisoryCurrentLocation() {

    if (!navigator.geolocation) {

        showAdvisoryStatus(
            "Location services are not supported.",
            "error"
        );

        return;

    }


    showAdvisoryStatus(
        "Detecting your current location...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            fetchAdvisoryByCoordinates(
                position.coords.latitude,
                position.coords.longitude
            );

        },

        () => {

            showAdvisoryStatus(
                "Unable to access your location.",
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
   COORDINATES
========================================================= */

async function fetchAdvisoryByCoordinates(
    lat,
    lon
) {

    try {

        const weatherResponse =
            await fetch(
                `${ADVISORY_WEATHER_COORDINATE_URL}?lat=${lat}&lon=${lon}`
            );


        const weatherResult =
            await weatherResponse.json();


        const forecastResponse =
            await fetch(
                `${ADVISORY_FORECAST_COORDINATE_URL}?lat=${lat}&lon=${lon}`
            );


        const forecastResult =
            await forecastResponse.json();


        if (!weatherResponse.ok) {

            throw new Error(
                weatherResult.detail ||
                "Unable to fetch weather."
            );

        }


        if (!forecastResponse.ok) {

            throw new Error(
                forecastResult.detail ||
                "Unable to fetch forecast."
            );

        }


        renderAdvisory(
            weatherResult.data,
            forecastResult.data
        );


        showAdvisoryStatus(
            `Live advisory updated for ${weatherResult.data.city}.`,
            "success"
        );


    } catch (error) {

        console.error(error);

        showAdvisoryStatus(
            error.message,
            "error"
        );

    }

}


/* =========================================================
   ANALYSIS
========================================================= */

function analyzeWeather(
    weather,
    forecast
) {

    const temperature =
        Number(weather.temperature) || 0;

    const humidity =
        Number(weather.humidity) || 0;

    const wind =
        Number(weather.wind_speed) || 0;


    const rainProbability =
        forecast.length
            ? Math.max(
                ...forecast.map(
                    item =>
                        Number(item.rain_probability) || 0
                )
            )
            : 0;


    const condition =
        String(weather.condition || "")
            .toLowerCase();


    const storm =
        condition.includes("thunderstorm") ||
        condition.includes("storm");


    const heavyRain =
        rainProbability >= 80;

    const rain =
        rainProbability >= 60;

    const strongWind =
        wind >= 10;

    const hot =
        temperature >= 35;

    const extremeHeat =
        temperature >= 40;

    const cold =
        temperature <= 10;


    let status = "GOOD";


    if (
        storm ||
        heavyRain ||
        strongWind ||
        extremeHeat
    ) {

        status = "CAUTION";

    } else if (
        rain ||
        hot ||
        cold
    ) {

        status = "MODERATE";

    }


    return {

        temperature,
        humidity,
        wind,
        rainProbability,

        storm,
        heavyRain,
        rain,
        strongWind,
        hot,
        extremeHeat,
        cold,

        status

    };

}


/* =========================================================
   RENDER
========================================================= */

function renderAdvisory(
    weather,
    forecastData
) {

    const analysis =
        analyzeWeather(
            weather,
            forecastData.forecast
        );


    renderLocation(
        weather,
        analysis
    );


    renderCurrentWeather(
        weather,
        analysis
    );


    renderGuidance(
        analysis
    );


    renderPlanning(
        analysis
    );


    renderSafety(
        analysis
    );

}


/* =========================================================
   LOCATION
========================================================= */

function renderLocation(
    weather,
    analysis
) {

    const panel =
        document.getElementById(
            "advisoryLocationSummary"
        );


    const status =
        document.getElementById(
            "advisoryOverallStatus"
        );


    if (!panel) return;


    const title =
        panel.querySelector("h2");

    const description =
        panel.querySelector("p");


    if (title) {

        title.textContent =
            `${weather.city}, ${weather.country}`;

    }


    if (description) {

        description.textContent =
            "Recommendations generated from live weather and forecast conditions.";

    }


    if (status) {

        status.className =
            `overall-status ${analysis.status.toLowerCase()}`;


        status.innerHTML = `

            <span class="status-dot"></span>

            ${analysis.status === "GOOD"
                ? "CONDITIONS LOOK GOOD"
                : analysis.status === "MODERATE"
                    ? "USE EXTRA AWARENESS"
                    : "CAUTION ADVISED"}

        `;

    }

}


/* =========================================================
   CURRENT WEATHER
========================================================= */

function renderCurrentWeather(
    weather,
    analysis
) {

    const container =
        document.getElementById(
            "advisoryCurrentConditions"
        );


    if (!container) return;


    let riskMessage =
        "No major weather concern detected.";

    let riskClass =
        "safe";


    if (
        analysis.storm ||
        analysis.heavyRain ||
        analysis.extremeHeat ||
        analysis.strongWind
    ) {

        riskMessage =
            "Weather conditions require additional attention.";

        riskClass =
            "risk";

    } else if (
        analysis.rain ||
        analysis.hot ||
        analysis.cold
    ) {

        riskMessage =
            "Some weather factors may affect your plans.";

        riskClass =
            "watch";

    }


    container.innerHTML = `

        <!-- TEMPERATURE -->

        <article class="temperature-card">

            <div class="card-label">
                CURRENT TEMPERATURE
            </div>

            <div class="temperature-value">
                ${Math.round(weather.temperature)}°
                <span>C</span>
            </div>

            <div class="feels-value">
                Feels like ${Math.round(weather.feels_like)}°
            </div>

            <div class="weather-condition">
                ${weather.condition}
            </div>

        </article>


        <!-- HUMIDITY -->

        <article class="weather-stat">

            <div class="stat-icon humidity-icon">
                HUM
            </div>

            <div>

                <span>
                    HUMIDITY
                </span>

                <strong>
                    ${weather.humidity}%
                </strong>

                <small>
                    Current humidity
                </small>

            </div>

        </article>


        <!-- WIND -->

        <article class="weather-stat">

            <div class="stat-icon wind-icon">
                WIND
            </div>

            <div>

                <span>
                    WIND SPEED
                </span>

                <strong>
                    ${Number(weather.wind_speed).toFixed(1)}
                    <small>m/s</small>
                </strong>

                <small>
                    Current wind
                </small>

            </div>

        </article>


        <!-- RAIN -->

        <article class="weather-stat important-stat">

            <div class="stat-icon rain-icon">
                RAIN
            </div>

            <div>

                <span>
                    RAIN CHANCE
                </span>

                <strong>
                    ${analysis.rainProbability}%
                </strong>

                <small>
                    Highest forecast probability
                </small>

            </div>

        </article>


        <!-- RISK -->

        <article class="weather-risk ${riskClass}">

            <div class="risk-heading">

                <span class="risk-indicator"></span>

                WEATHER STATUS

            </div>

            <strong>
                ${riskMessage}
            </strong>

            <small>
                Based on current conditions and available forecast data.
            </small>

        </article>

    `;

}


/* =========================================================
   GUIDANCE
========================================================= */

function renderGuidance(
    analysis
) {

    const container =
        document.getElementById(
            "advisoryCards"
        );


    if (!container) return;


    const cards = [];


    /* Agriculture */

    cards.push({

        type:
            analysis.heavyRain || analysis.storm
                ? "warning"
                : analysis.hot
                    ? "watch"
                    : "good",

        icon: "AG",

        category: "AGRICULTURE",

        title:
            analysis.heavyRain || analysis.storm
                ? "Protect weather-sensitive farm work"
                : analysis.hot
                    ? "Plan around warmer hours"
                    : "Suitable for routine farm activities",

        text:
            analysis.heavyRain || analysis.storm
                ? "Rain or storm conditions may affect field operations."
                : analysis.hot
                    ? "Higher temperatures may increase heat exposure during outdoor work."
                    : "Current conditions do not indicate a major restriction for general farm activities.",

        action:
            analysis.heavyRain || analysis.storm
                ? "Review field plans and monitor conditions before starting outdoor work."
                : analysis.hot
                    ? "Prefer cooler hours and maintain adequate hydration."
                    : "Normal field planning can continue."

    });


    /* Travel */

    cards.push({

        type:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "warning"
                : "good",

        icon: "TR",

        category: "TRAVEL",

        title:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "Travel with additional caution"
                : "Normal travel conditions",

        text:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "Weather conditions may affect road comfort, visibility or travel time."
                : "No major weather-related travel concern is detected.",

        action:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "Check conditions before departure and allow extra travel time."
                : "Normal travel planning can continue."

    });


    /* Outdoor */

    cards.push({

        type:
            analysis.extremeHeat ||
            analysis.heavyRain ||
            analysis.storm
                ? "warning"
                : analysis.hot
                    ? "watch"
                    : "good",

        icon: "OUT",

        category: "OUTDOOR",

        title:
            analysis.extremeHeat
                ? "Limit prolonged heat exposure"
                : analysis.hot
                    ? "Manage heat exposure"
                    : analysis.heavyRain || analysis.storm
                        ? "Consider postponing outdoor activities"
                        : "Outdoor conditions are manageable",

        text:
            analysis.extremeHeat
                ? "Very high temperatures can increase heat exposure."
                : analysis.hot
                    ? "Warm conditions may become uncomfortable during prolonged activity."
                    : analysis.heavyRain || analysis.storm
                        ? "Rain or storms may make outdoor activities less suitable."
                        : "No significant outdoor weather concern is currently detected.",

        action:
            analysis.extremeHeat
                ? "Avoid prolonged exposure and take frequent cooling breaks."
                : analysis.hot
                    ? "Stay hydrated and prefer cooler periods."
                    : analysis.heavyRain || analysis.storm
                        ? "Check the forecast before committing to outdoor plans."
                        : "Normal outdoor activities can be planned."

    });


    /* Safety */

    cards.push({

        type:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "warning"
                : "good",

        icon: "SAFE",

        category: "SAFETY",

        title:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "Stay alert to changing conditions"
                : "No major immediate risk detected",

        text:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "The forecast contains conditions that may require additional awareness."
                : "Available weather information does not indicate a major immediate risk.",

        action:
            analysis.storm ||
            analysis.heavyRain ||
            analysis.strongWind
                ? "Monitor official weather information and adjust plans if conditions worsen."
                : "Continue monitoring the forecast."

    });


    container.innerHTML =
        cards.map(
            card => `

                <article class="
                    guidance-card
                    ${card.type}
                ">

                    <div class="guidance-top">

                        <div class="guidance-icon">
                            ${card.icon}
                        </div>

                        <span>
                            ${card.category}
                        </span>

                    </div>


                    <h3>
                        ${card.title}
                    </h3>


                    <p>
                        ${card.text}
                    </p>


                    <div class="guidance-action">

                        <span>
                            RECOMMENDED ACTION
                        </span>

                        <strong>
                            ${card.action}
                        </strong>

                    </div>

                </article>

            `
        ).join("");

}


/* =========================================================
   PLANNING
========================================================= */

function renderPlanning(
    analysis
) {

    const container =
        document.getElementById(
            "advisoryPlanning"
        );


    if (!container) return;


    const changes = [];


    if (analysis.storm) {

        changes.push(
            "Thunderstorm conditions are present in the available weather information."
        );

    }


    if (analysis.heavyRain) {

        changes.push(
            "High rain probability may affect outdoor plans and travel."
        );

    } else if (analysis.rain) {

        changes.push(
            "Rain is possible during the upcoming forecast period."
        );

    }


    if (analysis.strongWind) {

        changes.push(
            "Stronger winds may require additional outdoor caution."
        );

    }


    if (analysis.extremeHeat) {

        changes.push(
            "Very warm conditions may increase heat exposure."
        );

    } else if (analysis.hot) {

        changes.push(
            "Warmer conditions may affect prolonged outdoor activity."
        );

    }


    if (analysis.cold) {

        changes.push(
            "Cool conditions may require additional protection outdoors."
        );

    }


    if (!changes.length) {

        changes.push(
            "No major weather change requiring special planning was detected."
        );

    }


    container.innerHTML = `

        <div class="planning-main">

            <div class="planning-icon">
                ${changes.length > 1 ? "!" : "✓"}
            </div>

            <div>

                <span>
                    FORECAST OUTLOOK
                </span>

                <h3>
                    ${
                        changes.length > 1
                            ? "Conditions to keep in mind"
                            : "Stable planning conditions"
                    }
                </h3>

                <p>
                    ${
                        changes.length > 1
                            ? "These weather factors may influence activities over the upcoming forecast period."
                            : "No significant weather change requiring special preparation is currently detected."
                    }
                </p>

            </div>

        </div>


        <div class="planning-list">

            ${changes.map(
                item => `

                    <div class="planning-item">

                        <span>✓</span>

                        <p>
                            ${item}
                        </p>

                    </div>

                `
            ).join("")}

        </div>

    `;

}


/* =========================================================
   SAFETY
========================================================= */

function renderSafety(
    analysis
) {

    const container =
        document.getElementById(
            "advisorySafety"
        );


    if (!container) return;


    let level = "safe";

    let title =
        "Conditions are currently manageable.";

    let message =
        "Continue normal planning while monitoring the forecast.";


    if (
        analysis.storm ||
        analysis.heavyRain ||
        analysis.strongWind
    ) {

        level = "danger";

        title =
            "Additional weather caution is recommended.";

        message =
            "Monitor changing conditions and official weather information before making outdoor or travel decisions.";

    } else if (
        analysis.rain ||
        analysis.hot ||
        analysis.cold
    ) {

        level = "watch";

        title =
            "Some weather factors may affect your plans.";

        message =
            "Take reasonable precautions and continue monitoring the forecast.";

    }


    container.innerHTML = `

        <div class="final-safety ${level}">

            <div class="final-safety-icon">
                ${
                    level === "safe"
                        ? "✓"
                        : "!"
                }
            </div>


            <div>

                <span>
                    WEATHER SAFETY
                </span>

                <h2>
                    ${title}
                </h2>

                <p>
                    ${message}
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   STATUS
========================================================= */

function showAdvisoryStatus(
    message,
    type
) {

    const element =
        document.getElementById(
            "advisoryStatus"
        );


    if (!element) return;


    element.className =
        `advisory-status ${type}`;


    element.textContent =
        message;

}


/* =========================================================
   GLOBAL
========================================================= */

window.loadAdvisory =
    loadAdvisory;

window.fetchAdvisory =
    fetchAdvisory;

window.getAdvisoryCurrentLocation =
    getAdvisoryCurrentLocation;