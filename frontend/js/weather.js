/* =========================================================
   WEATHERGPT - ADVANCED LIVE WEATHER DASHBOARD
   ========================================================= */

const WEATHER_API =
    "http://127.0.0.1:8000/api/weather";

const FORECAST_API =
    "http://127.0.0.1:8000/api/forecast";

const WEATHER_COORDINATE_API =
    "http://127.0.0.1:8000/api/weather/coordinates";

const FORECAST_COORDINATE_API =
    "http://127.0.0.1:8000/api/forecast/coordinates";


/* =========================================================
   PAGE STATE
   ========================================================= */

let weatherPageToken = 0;
let weatherRequestToken = 0;


/* =========================================================
   LOAD WEATHER PAGE
   ========================================================= */

function loadWeather() {

    const page = document.getElementById("page-content");

    if (!page) {
        console.error("WeatherGPT: page-content not found.");
        return;
    }

    const token = ++weatherPageToken;

    page.innerHTML = `

        <section id="wg-weather-page">

            <div class="wg-container">

                <!-- HEADER -->

                <div class="wg-header">

                    <div>
                        <div class="wg-eyebrow">
                            WEATHERGPT
                        </div>

                        <h1>
                            Live Weather Dashboard
                        </h1>

                        <p>
                            Real-time weather conditions and forecast
                            for any location.
                        </p>
                    </div>

                </div>


                <!-- SEARCH -->

                <div class="wg-search-section">

                    <div class="wg-search-box">

                        <span class="wg-search-icon">
                            🔍
                        </span>

                        <input
                            id="wg-city-input"
                            type="text"
                            placeholder="Search city..."
                            value="Solapur"
                            autocomplete="off"
                        >

                        <button
                            id="wg-search-btn"
                            type="button"
                        >
                            Search
                        </button>

                    </div>

                    <button
                        id="wg-location-btn"
                        class="wg-location-btn"
                        type="button"
                    >
                        📍 Use Current Location
                    </button>

                </div>


                <!-- STATUS -->

                <div
                    id="wg-status"
                    class="wg-status"
                >
                    Fetching live weather...
                </div>


                <!-- CURRENT WEATHER -->

                <div
                    id="wg-current"
                    class="wg-current-card"
                >

                    <div class="wg-loading">

                        <div class="wg-loader"></div>

                        <span>
                            Fetching live weather...
                        </span>

                    </div>

                </div>


                <!-- HOURLY -->

                <div class="wg-section">

                    <div class="wg-section-heading">

                        <div>
                            <span>
                                HOURLY FORECAST
                            </span>

                            <h2>
                                Next hours
                            </h2>
                        </div>

                    </div>

                    <div
                        id="wg-hourly"
                        class="wg-hourly"
                    >

                        <div class="wg-loading-small">
                            Loading forecast...
                        </div>

                    </div>

                </div>


                <!-- DAILY -->

                <div class="wg-section">

                    <div class="wg-section-heading">

                        <div>
                            <span>
                                5-DAY FORECAST
                            </span>

                            <h2>
                                Coming days
                            </h2>
                        </div>

                    </div>

                    <div
                        id="wg-daily"
                        class="wg-daily"
                    >

                        <div class="wg-loading-small">
                            Loading forecast...
                        </div>

                    </div>

                </div>


                <!-- SUN -->

                <div
                    id="wg-sun"
                    class="wg-sun"
                ></div>

            </div>

        </section>

    `;


    injectWeatherStyles();

    initializeWeatherControls();

    fetchWeatherCity(
        "Solapur",
        token
    );
}


/* =========================================================
   INITIALIZE CONTROLS
   ========================================================= */

function initializeWeatherControls() {

    const searchButton =
        document.getElementById("wg-search-btn");

    const input =
        document.getElementById("wg-city-input");

    const locationButton =
        document.getElementById("wg-location-btn");


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                const city =
                    input.value.trim();

                if (!city) {

                    setStatus(
                        "Please enter a city.",
                        "error"
                    );

                    return;
                }

                fetchWeatherCity(city);

            }
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    const city =
                        input.value.trim();

                    if (city) {

                        fetchWeatherCity(city);

                    }

                }

            }
        );

    }


    if (locationButton) {

        locationButton.addEventListener(
            "click",
            getWeatherFromCurrentLocation
        );

    }

}


/* =========================================================
   CITY WEATHER
   ========================================================= */

async function fetchWeatherCity(
    city,
    pageToken = weatherPageToken
) {

    const requestToken =
        ++weatherRequestToken;

    city =
        String(city || "").trim();


    if (!city) {
        return;
    }


    if (pageToken !== weatherPageToken) {
        return;
    }


    setStatus(
        `Fetching live weather for ${city}...`,
        "loading"
    );


    showCurrentLoading();

    showForecastLoading();


    try {

        /*
         * ==========================================
         * CURRENT WEATHER
         * ==========================================
         */

        const currentResponse =
            await fetch(
                `${WEATHER_API}?city=${encodeURIComponent(city)}`,
                {
                    cache: "no-store"
                }
            );


        const currentJson =
            await currentResponse.json();


        console.log(
            "WeatherGPT current weather:",
            currentJson
        );


        if (
            requestToken !== weatherRequestToken ||
            pageToken !== weatherPageToken
        ) {

            return;

        }


        if (!currentResponse.ok) {

            throw new Error(
                currentJson.detail ||
                "Unable to load current weather."
            );

        }


        const current =
            currentJson.data ||
            currentJson;


        if (!current.city) {

            throw new Error(
                "Invalid current weather response."
            );

        }


        /*
         * IMPORTANT:
         * Render CURRENT WEATHER immediately.
         */

        renderCurrentWeatherCard(current);

        renderSunCard(current);


        setStatus(
            `Live weather loaded for ${current.city}.`,
            "success"
        );


        /*
         * ==========================================
         * FORECAST
         * ==========================================
         */

        try {

            const forecastResponse =
                await fetch(
                    `${FORECAST_API}?city=${encodeURIComponent(city)}`,
                    {
                        cache: "no-store"
                    }
                );


            const forecastJson =
                await forecastResponse.json();


            console.log(
                "WeatherGPT forecast:",
                forecastJson
            );


            if (
                requestToken !== weatherRequestToken ||
                pageToken !== weatherPageToken
            ) {

                return;

            }


            if (!forecastResponse.ok) {

                throw new Error(
                    forecastJson.detail ||
                    "Forecast unavailable."
                );

            }


            const forecast =
                forecastJson.data ||
                forecastJson;


            if (
                !forecast ||
                !Array.isArray(
                    forecast.forecast
                )
            ) {

                throw new Error(
                    "Invalid forecast response."
                );

            }


            renderHourly(
                forecast.forecast,
                current.timezone
            );


            renderDaily(
                forecast.forecast,
                current.timezone
            );


            setStatus(
                `Live weather and forecast updated for ${current.city}.`,
                "success"
            );


        } catch (forecastError) {

            console.error(
                "Forecast error:",
                forecastError
            );


            document.getElementById(
                "wg-hourly"
            ).innerHTML = `

                <div class="wg-forecast-error">
                    Hourly forecast temporarily unavailable.
                </div>

            `;


            document.getElementById(
                "wg-daily"
            ).innerHTML = `

                <div class="wg-forecast-error">
                    Multi-day forecast temporarily unavailable.
                </div>

            `;


            /*
             * IMPORTANT:
             * Current weather remains visible.
             */

            setStatus(
                `Current weather loaded for ${current.city}. Forecast temporarily unavailable.`,
                "success"
            );

        }


    } catch (error) {

        console.error(
            "WeatherGPT weather error:",
            error
        );


        showMainError(
            error.message
        );


        setStatus(
            "Unable to load weather data.",
            "error"
        );

    }

}


/* =========================================================
   CURRENT LOCATION
   ========================================================= */

function getWeatherFromCurrentLocation() {

    if (!navigator.geolocation) {

        setStatus(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;

    }


    setStatus(
        "Detecting your current location...",
        "loading"
    );


    showCurrentLoading();

    showForecastLoading();


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;


            console.log(
                "WeatherGPT coordinates:",
                lat,
                lon
            );


            await fetchWeatherCoordinates(
                lat,
                lon
            );

        },

        function (error) {

            console.error(
                "Geolocation error:",
                error
            );


            setStatus(
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
   COORDINATE WEATHER
   ========================================================= */

async function fetchWeatherCoordinates(
    lat,
    lon
) {

    const requestToken =
        ++weatherRequestToken;


    try {

        const currentResponse =
            await fetch(
                `${WEATHER_COORDINATE_API}?lat=${lat}&lon=${lon}`,
                {
                    cache: "no-store"
                }
            );


        const currentJson =
            await currentResponse.json();


        if (
            requestToken !== weatherRequestToken
        ) {
            return;
        }


        if (!currentResponse.ok) {

            throw new Error(
                currentJson.detail ||
                "Unable to load location weather."
            );

        }


        const current =
            currentJson.data ||
            currentJson;


        renderCurrentWeatherCard(
            current
        );


        renderSunCard(
            current
        );


        setStatus(
            `Live weather loaded for ${current.city}.`,
            "success"
        );


        /*
         * FORECAST BY COORDINATES
         */

        try {

            const forecastResponse =
                await fetch(
                    `${FORECAST_COORDINATE_API}?lat=${lat}&lon=${lon}`,
                    {
                        cache: "no-store"
                    }
                );


            const forecastJson =
                await forecastResponse.json();


            if (
                !forecastResponse.ok
            ) {

                throw new Error(
                    forecastJson.detail ||
                    "Forecast unavailable."
                );

            }


            const forecast =
                forecastJson.data ||
                forecastJson;


            renderHourly(
                forecast.forecast,
                current.timezone
            );


            renderDaily(
                forecast.forecast,
                current.timezone
            );


            setStatus(
                `Live weather and forecast updated for ${current.city}.`,
                "success"
            );


        } catch (error) {

            console.error(
                "Coordinate forecast error:",
                error
            );


            document.getElementById(
                "wg-hourly"
            ).innerHTML = `

                <div class="wg-forecast-error">
                    Hourly forecast temporarily unavailable.
                </div>

            `;


            document.getElementById(
                "wg-daily"
            ).innerHTML = `

                <div class="wg-forecast-error">
                    Multi-day forecast temporarily unavailable.
                </div>

            `;

        }


    } catch (error) {

        console.error(
            "Coordinate weather error:",
            error
        );


        showMainError(
            error.message
        );


        setStatus(
            "Unable to load weather for your location.",
            "error"
        );

    }

}


/* =========================================================
   CURRENT WEATHER CARD
   ========================================================= */

function renderCurrentWeatherCard(
    weather
) {

    const container =
        document.getElementById(
            "wg-current"
        );


    if (!container) {

        console.error(
            "wg-current not found."
        );

        return;

    }


    const temp =
        safeNumber(
            weather.temperature
        );


    const feels =
        safeNumber(
            weather.feels_like
        );


    const humidity =
        safeNumber(
            weather.humidity
        );


    const pressure =
        safeNumber(
            weather.pressure
        );


    const wind =
        safeNumber(
            weather.wind_speed
        );


    const visibility =
        safeNumber(
            weather.visibility
        );


    const condition =
        titleCase(
            weather.condition
        );


    const icon =
        weatherIcon(
            weather.weather_main,
            weather.condition
        );


    const windKmh =
        Number.isFinite(wind)
            ? (wind * 3.6).toFixed(1)
            : "--";


    const temperatureText =
        Number.isFinite(temp)
            ? Math.round(temp)
            : "--";


    const feelsText =
        Number.isFinite(feels)
            ? Math.round(feels)
            : "--";


    container.innerHTML = `

        <div class="wg-current-top">

            <div class="wg-current-location">

                <div class="wg-location-name">

                    ${escapeHTML(
                        weather.city || "Unknown"
                    )}

                    <span>
                        ${escapeHTML(
                            weather.country || ""
                        )}
                    </span>

                </div>

                <div class="wg-live-badge">
                    ● LIVE
                </div>

                <div class="wg-updated">
                    Real-time weather conditions
                </div>

            </div>


            <div class="wg-weather-icon">

                ${icon}

            </div>

        </div>


        <div class="wg-main-temperature">

            <div class="wg-temperature">

                ${temperatureText}°

            </div>

            <div class="wg-condition">

                ${escapeHTML(condition)}

            </div>

            <div class="wg-feels">

                Feels like ${feelsText}°

            </div>

        </div>


        <div class="wg-details">

            <div class="wg-detail">

                <div class="wg-detail-icon">
                    💧
                </div>

                <div>
                    <small>Humidity</small>
                    <strong>
                        ${Number.isFinite(humidity)
                            ? humidity
                            : "--"}%
                    </strong>
                </div>

            </div>


            <div class="wg-detail">

                <div class="wg-detail-icon">
                    💨
                </div>

                <div>
                    <small>Wind</small>
                    <strong>
                        ${windKmh} km/h
                    </strong>
                </div>

            </div>


            <div class="wg-detail">

                <div class="wg-detail-icon">
                    ⏱️
                </div>

                <div>
                    <small>Pressure</small>
                    <strong>
                        ${Number.isFinite(pressure)
                            ? pressure
                            : "--"} hPa
                    </strong>
                </div>

            </div>


            <div class="wg-detail">

                <div class="wg-detail-icon">
                    👁️
                </div>

                <div>
                    <small>Visibility</small>
                    <strong>
                        ${Number.isFinite(visibility)
                            ? visibility.toFixed(1)
                            : "--"} km
                    </strong>
                </div>

            </div>

        </div>

    `;


    container.classList.add(
        "wg-visible"
    );


    console.log(
        "WeatherGPT: LIVE WEATHER CARD RENDERED"
    );

}


/* =========================================================
   HOURLY FORECAST
   ========================================================= */

function renderHourly(
    forecast,
    timezone
) {

    const container =
        document.getElementById(
            "wg-hourly"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(forecast) ||
        forecast.length === 0
    ) {

        container.innerHTML = `

            <div class="wg-forecast-error">
                No hourly forecast available.
            </div>

        `;

        return;

    }


    /*
     * First 8 records = approximately next 24 hours
     */

    const items =
        forecast.slice(0, 8);


    container.innerHTML =
        items.map(
            function (item) {

                const temp =
                    safeNumber(
                        item.temperature
                    );


                const rain =
                    safeNumber(
                        item.rain_probability
                    );


                const time =
                    forecastTime(
                        item.time,
                        timezone
                    );


                const icon =
                    weatherIcon(
                        item.weather_main,
                        item.condition
                    );


                return `

                    <div class="wg-hour-card">

                        <div class="wg-hour-time">
                            ${time}
                        </div>

                        <div class="wg-hour-icon">
                            ${icon}
                        </div>

                        <div class="wg-hour-temp">
                            ${
                                Number.isFinite(temp)
                                    ? Math.round(temp)
                                    : "--"
                            }°
                        </div>

                        <div class="wg-hour-condition">

                            ${escapeHTML(
                                titleCase(
                                    item.condition
                                )
                            )}

                        </div>

                        <div class="wg-hour-rain">

                            💧 ${Number.isFinite(rain)
                                ? rain
                                : 0}%

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   DAILY FORECAST
   ========================================================= */

function renderDaily(
    forecast,
    timezone
) {

    const container =
        document.getElementById(
            "wg-daily"
        );


    if (!container) {
        return;
    }


    if (
        !Array.isArray(forecast) ||
        forecast.length === 0
    ) {

        container.innerHTML = `

            <div class="wg-forecast-error">
                No daily forecast available.
            </div>

        `;

        return;

    }


    const days = {};


    forecast.forEach(
        function (item) {

            const date =
                forecastDate(
                    item.time,
                    timezone
                );


            if (!days[date]) {
                days[date] = [];
            }


            days[date].push(item);

        }
    );


    const dates =
        Object.keys(days)
            .slice(0, 5);


    container.innerHTML =
        dates.map(
            function (date, index) {

                const items =
                    days[date];


                const temperatures =
                    items
                        .map(
                            item =>
                                Number(
                                    item.temperature
                                )
                        )
                        .filter(
                            Number.isFinite
                        );


                const min =
                    temperatures.length
                        ? Math.round(
                            Math.min(
                                ...temperatures
                            )
                        )
                        : "--";


                const max =
                    temperatures.length
                        ? Math.round(
                            Math.max(
                                ...temperatures
                            )
                        )
                        : "--";


                const representative =
                    items[
                        Math.floor(
                            items.length / 2
                        )
                    ] || items[0];


                const rainValues =
                    items
                        .map(
                            item =>
                                Number(
                                    item.rain_probability || 0
                                )
                        );


                const rain =
                    rainValues.length
                        ? Math.max(
                            ...rainValues
                        )
                        : 0;


                const icon =
                    weatherIcon(
                        representative.weather_main,
                        representative.condition
                    );


                const day =
                    index === 0
                        ? "Today"
                        : dayName(date);


                return `

                    <div class="wg-day-card">

                        <div class="wg-day-name">
                            ${day}
                        </div>

                        <div class="wg-day-date">
                            ${formatDate(date)}
                        </div>

                        <div class="wg-day-icon">
                            ${icon}
                        </div>

                        <div class="wg-day-condition">

                            ${escapeHTML(
                                titleCase(
                                    representative.condition
                                )
                            )}

                        </div>

                        <div class="wg-day-temp">

                            <strong>
                                ${max}°
                            </strong>

                            <span>
                                ${min}°
                            </span>

                        </div>

                        <div class="wg-day-rain">

                            💧 ${rain}%

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   SUNRISE / SUNSET
   ========================================================= */

function renderSunCard(
    weather
) {

    const container =
        document.getElementById(
            "wg-sun"
        );


    if (!container) {
        return;
    }


    const sunrise =
        unixTime(
            weather.sunrise,
            weather.timezone
        );


    const sunset =
        unixTime(
            weather.sunset,
            weather.timezone
        );


    container.innerHTML = `

        <div class="wg-sun-item">

            <div class="wg-sun-icon">
                🌅
            </div>

            <div>
                <small>
                    Sunrise
                </small>

                <strong>
                    ${sunrise}
                </strong>
            </div>

        </div>


        <div class="wg-sun-line"></div>


        <div class="wg-sun-item">

            <div class="wg-sun-icon">
                🌇
            </div>

            <div>
                <small>
                    Sunset
                </small>

                <strong>
                    ${sunset}
                </strong>
            </div>

        </div>

    `;

}


/* =========================================================
   LOADING
   ========================================================= */

function showCurrentLoading() {

    const container =
        document.getElementById(
            "wg-current"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="wg-loading">

            <div class="wg-loader"></div>

            <span>
                Fetching live weather...
            </span>

        </div>

    `;

}


function showForecastLoading() {

    const hourly =
        document.getElementById(
            "wg-hourly"
        );


    const daily =
        document.getElementById(
            "wg-daily"
        );


    if (hourly) {

        hourly.innerHTML = `

            <div class="wg-loading-small">
                Loading hourly forecast...
            </div>

        `;

    }


    if (daily) {

        daily.innerHTML = `

            <div class="wg-loading-small">
                Loading 5-day forecast...
            </div>

        `;

    }

}


/* =========================================================
   MAIN ERROR
   ========================================================= */

function showMainError(
    message
) {

    const container =
        document.getElementById(
            "wg-current"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="wg-main-error">

            <div class="wg-error-icon">
                ⚠️
            </div>

            <h3>
                Weather could not be loaded
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    "Please try again."
                )}
            </p>

            <button
                type="button"
                onclick="fetchWeatherCity('Solapur')"
            >
                Try Again
            </button>

        </div>

    `;

}


/* =========================================================
   STATUS
   ========================================================= */

function setStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "wg-status"
        );


    if (!status) {
        return;
    }


    status.textContent =
        message || "";


    status.className =
        `wg-status ${type || ""}`;

}


/* =========================================================
   WEATHER ICONS
   ========================================================= */

function weatherIcon(
    main,
    condition
) {

    const m =
        String(
            main || ""
        ).toLowerCase();


    const c =
        String(
            condition || ""
        ).toLowerCase();


    if (
        m.includes("thunder") ||
        c.includes("thunder")
    ) {

        return "⛈️";

    }


    if (
        m.includes("snow") ||
        c.includes("snow")
    ) {

        return "❄️";

    }


    if (
        m.includes("rain") ||
        c.includes("rain")
    ) {

        return "🌧️";

    }


    if (
        m.includes("drizzle") ||
        c.includes("drizzle")
    ) {

        return "🌦️";

    }


    if (
        m.includes("mist") ||
        m.includes("fog") ||
        m.includes("haze") ||
        m.includes("smoke")
    ) {

        return "🌫️";

    }


    if (
        m.includes("cloud")
    ) {

        if (
            c.includes("scattered") ||
            c.includes("few")
        ) {

            return "🌤️";

        }

        return "☁️";

    }


    if (
        m.includes("clear")
    ) {

        return "☀️";

    }


    return "🌤️";

}


/* =========================================================
   DATE / TIME
   ========================================================= */

function unixTime(
    timestamp,
    timezone
) {

    const ts =
        Number(timestamp);


    const offset =
        Number(timezone);


    if (!Number.isFinite(ts)) {
        return "--";
    }


    const date =
        new Date(
            (
                ts +
                (
                    Number.isFinite(offset)
                        ? offset
                        : 0
                )
            ) * 1000
        );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC"
        }
    );

}


function forecastTime(
    timestamp,
    timezone
) {

    return unixTime(
        timestamp,
        timezone
    );

}


function forecastDate(
    timestamp,
    timezone
) {

    const ts =
        Number(timestamp);


    const offset =
        Number(timezone);


    if (!Number.isFinite(ts)) {
        return "";
    }


    const date =
        new Date(
            (
                ts +
                (
                    Number.isFinite(offset)
                        ? offset
                        : 0
                )
            ) * 1000
        );


    return date
        .toISOString()
        .slice(0, 10);

}


function dayName(
    dateString
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short"
        }
    );

}


function formatDate(
    dateString
) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


/* =========================================================
   HELPERS
   ========================================================= */

function safeNumber(
    value
) {

    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : NaN;

}


function titleCase(
    value
) {

    if (!value) {
        return "Unknown";
    }


    return String(value)
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );

}


function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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
   SELF-CONTAINED WEATHER STYLES
   ========================================================= */

function injectWeatherStyles() {

    if (
        document.getElementById(
            "weather-gpt-advanced-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "weather-gpt-advanced-styles";


    style.textContent = `

        #wg-weather-page {
            min-height: 100vh;
            padding: 45px 20px 70px;
            background:
                linear-gradient(
                    180deg,
                    #f7faff 0%,
                    #eef4fb 100%
                );
            color: #172033;
        }


        #wg-weather-page * {
            box-sizing: border-box;
        }


        .wg-container {
            width: min(1180px, 100%);
            margin: 0 auto;
        }


        .wg-header {
            margin-bottom: 28px;
        }


        .wg-eyebrow {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #3578d4;
            margin-bottom: 8px;
        }


        .wg-header h1 {
            margin: 0;
            font-size: clamp(30px, 4vw, 48px);
            line-height: 1.1;
            font-weight: 800;
            color: #101828;
        }


        .wg-header p {
            margin: 12px 0 0;
            color: #667085;
            font-size: 16px;
        }


        .wg-search-section {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
        }


        .wg-search-box {
            flex: 1;
            display: flex;
            align-items: center;
            background: white;
            border: 1px solid #dbe3ee;
            border-radius: 14px;
            padding: 6px;
            box-shadow:
                0 8px 25px rgba(31, 55, 90, 0.07);
        }


        .wg-search-icon {
            padding-left: 14px;
            font-size: 18px;
        }


        #wg-city-input {
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            padding: 13px 12px;
            font-size: 15px;
            color: #172033;
        }


        #wg-search-btn,
        .wg-location-btn {
            border: 0;
            border-radius: 10px;
            padding: 12px 20px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s ease;
        }


        #wg-search-btn {
            background: #3578d4;
            color: white;
        }


        #wg-search-btn:hover {
            background: #2865b7;
        }


        .wg-location-btn {
            background: white;
            color: #3578d4;
            border: 1px solid #d5e0ee;
        }


        .wg-location-btn:hover {
            background: #f3f7fc;
        }


        .wg-status {
            min-height: 24px;
            margin: 8px 0 18px;
            font-size: 14px;
            color: #667085;
        }


        .wg-status.success {
            color: #17804b;
        }


        .wg-status.error {
            color: #d92d20;
        }


        .wg-current-card {
            background:
                linear-gradient(
                    135deg,
                    #031b2a 0%,
                    #184b79 100%
                );
            border: 1px solid #d9e6f4;
            border-radius: 24px;
            padding: 30px;
            min-height: 300px;
            box-shadow:
                0 18px 50px rgba(234, 240, 248, 0.1);
            margin-bottom: 42px;
        }


        .wg-current-card.wg-visible {
            animation: wgAppear 0.35s ease;
        }


        @keyframes wgAppear {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }


        .wg-current-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }


        .wg-location-name {
            font-size: 27px;
            font-weight: 800;
            color: #eceef1;
        }


        .wg-location-name span {
            font-size: 15px;
            font-weight: 600;
            color: #f0f2f7;
            margin-left: 5px;
        }


        .wg-live-badge {
            display: inline-block;
            margin-top: 9px;
            padding: 5px 10px;
            border-radius: 20px;
            background: #e7f7ef;
            color: #147d4d;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.7px;
        }


        .wg-updated {
            margin-top: 9px;
            color: #f6f7f8;
            font-size: 14px;
        }


        .wg-weather-icon {
            font-size: 82px;
            line-height: 1;
        }


        .wg-main-temperature {
            margin-top: 15px;
        }


        .wg-temperature {
            font-size: clamp(65px, 9vw, 100px);
            line-height: 0.95;
            font-weight: 800;
            letter-spacing: -5px;
            color: #dee0e5;
        }


        .wg-condition {
            margin-top: 8px;
            font-size: 21px;
            font-weight: 700;
            color: #f9fafd;
        }


        .wg-feels {
            margin-top: 5px;
            color: #f5f6fa;
            font-size: 14px;
        }


        .wg-details {
            display: grid;
            grid-template-columns:
                repeat(4, 1fr);
            gap: 12px;
            margin-top: 28px;
        }


        .wg-detail {
            display: flex;
            align-items: center;
            gap: 11px;
            background: rgba(255,255,255,0.82);
            border: 1px solid #e1e9f3;
            border-radius: 14px;
            padding: 14px;
        }


        .wg-detail-icon {
            font-size: 23px;
        }


        .wg-detail small {
            display: block;
            color: #010a16;
            font-size: 12px;
            margin-bottom: 3px;
        }


        .wg-detail strong {
            display: block;
            color: #172033;
            font-size: 15px;
        }


        .wg-section {
            margin-top: 40px;
        }


        .wg-section-heading span {
            color: #3578d4;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.7px;
        }


        .wg-section-heading h2 {
            margin: 5px 0 18px;
            font-size: 27px;
            font-weight: 800;
            color: #14213d;
        }


        .wg-hourly {
            display: grid;
            grid-template-columns:
                repeat(8, minmax(130px, 1fr));
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 6px;
        }


        .wg-hour-card {
            min-width: 130px;
            background: white;
            border: 1px solid #dfe7f0;
            border-radius: 17px;
            padding: 18px 13px;
            text-align: center;
            box-shadow:
                0 7px 22px rgba(31,55,90,0.06);
        }


        .wg-hour-time {
            color: #667085;
            font-size: 12px;
            font-weight: 700;
        }


        .wg-hour-icon {
            font-size: 37px;
            margin: 14px 0;
        }


        .wg-hour-temp {
            font-size: 22px;
            font-weight: 800;
            color: #172033;
        }


        .wg-hour-condition {
            height: 35px;
            margin-top: 5px;
            color: #667085;
            font-size: 11px;
        }


        .wg-hour-rain {
            margin-top: 10px;
            color: #3578d4;
            font-size: 12px;
            font-weight: 700;
        }


        .wg-daily {
            display: grid;
            grid-template-columns:
                repeat(5, 1fr);
            gap: 13px;
        }


        .wg-day-card {
            background: white;
            border: 1px solid #dfe7f0;
            border-radius: 18px;
            padding: 21px 15px;
            text-align: center;
            box-shadow:
                0 7px 22px rgba(31,55,90,0.06);
        }


        .wg-day-name {
            font-size: 16px;
            font-weight: 800;
            color: #172033;
        }


        .wg-day-date {
            margin-top: 3px;
            color: #98a2b3;
            font-size: 12px;
        }


        .wg-day-icon {
            font-size: 44px;
            margin: 15px 0;
        }


        .wg-day-condition {
            min-height: 34px;
            color: #667085;
            font-size: 12px;
        }


        .wg-day-temp {
            margin-top: 12px;
        }


        .wg-day-temp strong {
            color: #172033;
            font-size: 22px;
        }


        .wg-day-temp span {
            margin-left: 7px;
            color: #98a2b3;
            font-size: 16px;
        }


        .wg-day-rain {
            margin-top: 10px;
            color: #3578d4;
            font-size: 12px;
            font-weight: 700;
        }


        .wg-sun {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 60px;
            margin-top: 40px;
            padding: 22px;
            background: white;
            border: 1px solid #dfe7f0;
            border-radius: 18px;
        }


        .wg-sun-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }


        .wg-sun-icon {
            font-size: 32px;
        }


        .wg-sun-item small {
            display: block;
            color: #98a2b3;
            font-size: 12px;
        }


        .wg-sun-item strong {
            display: block;
            margin-top: 2px;
            color: #172033;
        }


        .wg-sun-line {
            width: 1px;
            height: 42px;
            background: #dfe7f0;
        }


        .wg-loading {
            min-height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 15px;
            color: #667085;
        }


        .wg-loading-small {
            padding: 30px;
            text-align: center;
            color: #667085;
            background: white;
            border: 1px solid #dfe7f0;
            border-radius: 15px;
        }


        .wg-loader {
            width: 40px;
            height: 40px;
            border: 4px solid #dce8f7;
            border-top-color: #3578d4;
            border-radius: 50%;
            animation: wgSpin 0.8s linear infinite;
        }


        @keyframes wgSpin {
            to {
                transform: rotate(360deg);
            }
        }


        .wg-forecast-error {
            padding: 25px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 15px;
            color: #667085;
            text-align: center;
        }


        .wg-main-error {
            min-height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
        }


        .wg-error-icon {
            font-size: 45px;
        }


        .wg-main-error h3 {
            margin: 12px 0 5px;
            color: #172033;
        }


        .wg-main-error p {
            color: #667085;
            max-width: 500px;
        }


        .wg-main-error button {
            margin-top: 10px;
            padding: 10px 20px;
            border: 0;
            border-radius: 9px;
            background: #3578d4;
            color: white;
            font-weight: 700;
            cursor: pointer;
        }


        @media (max-width: 900px) {

            .wg-details {
                grid-template-columns:
                    repeat(2, 1fr);
            }


            .wg-daily {
                grid-template-columns:
                    repeat(2, 1fr);
            }


            .wg-search-section {
                flex-direction: column;
            }

        }


        @media (max-width: 600px) {

            #wg-weather-page {
                padding:
                    25px 13px 50px;
            }


            .wg-current-card {
                padding: 20px;
                border-radius: 18px;
            }


            .wg-weather-icon {
                font-size: 55px;
            }


            .wg-location-name {
                font-size: 21px;
            }


            .wg-temperature {
                font-size: 68px;
            }


            .wg-details {
                grid-template-columns:
                    1fr 1fr;
            }


            .wg-daily {
                grid-template-columns:
                    1fr;
            }


            .wg-sun {
                gap: 20px;
            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   EXPORT FUNCTIONS
   ========================================================= */

window.loadWeather =
    loadWeather;

window.fetchWeatherCity =
    fetchWeatherCity;

window.getWeatherFromCurrentLocation =
    getWeatherFromCurrentLocation;

window.fetchWeatherCoordinates =
    fetchWeatherCoordinates;

window.renderCurrentWeatherCard =
    renderCurrentWeatherCard;

window.renderHourly =
    renderHourly;

window.renderDaily =
    renderDaily;