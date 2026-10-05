/* =========================================================
   WEATHERGPT
   PROFESSIONAL WEATHER INSIGHTS
========================================================= */

const INSIGHTS_API_URL =
    "http://127.0.0.1:8000/api/insights";

const INSIGHTS_COORDINATE_URL =
    "http://127.0.0.1:8000/api/insights/coordinates";

const INSIGHTS_WEATHER_URL =
    "http://127.0.0.1:8000/api/weather";

let currentInsightsYears = 5;


/* =========================================================
   LOAD PAGE
========================================================= */

function loadInsights() {

    const pageContent =
        document.getElementById("page-content");

    if (!pageContent) {
        console.error(
            "WeatherGPT: page-content not found."
        );
        return;
    }

    pageContent.innerHTML = `

        <main class="insights-page">

            <div class="insights-container">

                <!-- HERO -->

                <section class="insights-hero">

                    <div class="insights-hero-main">

                        <div class="insights-eyebrow">
                            WEATHER INTELLIGENCE
                        </div>

                        <h1>
                            Understand weather
                            <span>over time.</span>
                        </h1>

                        <p>
                            Explore historical temperature,
                            rainfall and seasonal patterns
                            for any location.
                        </p>

                    </div>

                    <div class="insights-hero-meta">

                        <div class="insights-meta-dot"></div>

                        <div>
                            <strong>
                                Historical Analysis
                            </strong>

                            <small>
                                Real weather data
                            </small>
                        </div>

                    </div>

                </section>


                <!-- SEARCH / CONTROLS -->

                <section class="insights-control-card">

                    <div class="insights-search-block">

                        <label>
                            ANALYZE LOCATION
                        </label>

                        <div class="insights-search-row">

                            <div class="insights-input-wrap">

                                <span>⌕</span>

                                <input
                                    id="insightsLocation"
                                    type="text"
                                    value="Solapur"
                                    placeholder="Search city..."
                                >

                            </div>

                            <button
                                id="insightsSearchButton"
                                class="insights-primary-button"
                                type="button"
                            >
                                Analyze
                            </button>

                            <button
                                id="insightsCurrentLocation"
                                class="insights-location-button"
                                type="button"
                            >
                                ◎ Current location
                            </button>

                        </div>

                    </div>


                    <div class="insights-period-block">

                        <label>
                            TIME RANGE
                        </label>

                        <div class="insights-period-selector">

                            <button
                                class="insights-period-button"
                                data-years="1"
                            >
                                1Y
                            </button>

                            <button
                                class="insights-period-button"
                                data-years="3"
                            >
                                3Y
                            </button>

                            <button
                                class="insights-period-button active"
                                data-years="5"
                            >
                                5Y
                            </button>

                        </div>

                    </div>

                </section>


                <!-- STATUS -->

                <div
                    id="insightsStatus"
                    class="insights-status"
                >
                    Ready to analyze.
                </div>


                <!-- LOCATION -->

                <section class="insights-location-bar">

                    <div class="insights-location-primary">

                        <div class="location-pin">
                            ◉
                        </div>

                        <div>

                            <span>
                                ANALYZING
                            </span>

                            <h2 id="insightsCity">
                                Solapur
                            </h2>

                        </div>

                    </div>


                    <div class="insights-location-details">

                        <div>

                            <span>
                                PERIOD
                            </span>

                            <strong id="insightsDateRange">
                                —
                            </strong>

                        </div>

                        <div>

                            <span>
                                SOURCE
                            </span>

                            <strong>
                                Open-Meteo
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- KPI CARDS -->

                <section class="insights-kpi-grid">

                    <article class="insights-kpi-card">

                        <div class="kpi-top">

                            <span>
                                AVERAGE TEMPERATURE
                            </span>

                            <div class="kpi-symbol temperature">
                                °
                            </div>

                        </div>

                        <strong id="kpiTemperature">
                            —
                        </strong>

                        <small>
                            Across selected period
                        </small>

                    </article>


                    <article class="insights-kpi-card">

                        <div class="kpi-top">

                            <span>
                                TOTAL RAINFALL
                            </span>

                            <div class="kpi-symbol rainfall">
                                ≋
                            </div>

                        </div>

                        <strong id="kpiRainfall">
                            —
                        </strong>

                        <small>
                            Historical precipitation
                        </small>

                    </article>


                    <article class="insights-kpi-card">

                        <div class="kpi-top">

                            <span>
                                RAINY DAYS
                            </span>

                            <div class="kpi-symbol rain-days">
                                •
                            </div>

                        </div>

                        <strong id="kpiRainyDays">
                            —
                        </strong>

                        <small>
                            Days with ≥ 1 mm rain
                        </small>

                    </article>

                </section>


                <!-- TEMPERATURE -->

                <section class="insights-chart-card large">

                    <div class="chart-header">

                        <div>

                            <span>
                                TEMPERATURE TREND
                            </span>

                            <h2>
                                Average temperature by year
                            </h2>

                            <p>
                                See how average temperatures
                                have changed across the selected period.
                            </p>

                        </div>

                        <div class="chart-unit">
                            °C
                        </div>

                    </div>

                    <div
                        id="temperatureChart"
                        class="insights-chart"
                    >
                        <div class="chart-loading">
                            Loading chart...
                        </div>
                    </div>

                </section>


                <!-- RAINFALL -->

                <section class="insights-chart-card">

                    <div class="chart-header">

                        <div>

                            <span>
                                RAINFALL PATTERN
                            </span>

                            <h2>
                                Annual precipitation
                            </h2>

                            <p>
                                Compare total rainfall recorded
                                during each year.
                            </p>

                        </div>

                        <div class="chart-unit">
                            mm
                        </div>

                    </div>

                    <div
                        id="rainfallChart"
                        class="insights-chart rainfall-chart"
                    >
                        <div class="chart-loading">
                            Loading chart...
                        </div>
                    </div>

                </section>


                <!-- SEASONAL -->

                <section class="season-section">

                    <div class="section-heading">

                        <span>
                            SEASONAL PATTERN
                        </span>

                        <h2>
                            When does weather change most?
                        </h2>

                        <p>
                            Monthly historical patterns
                            reveal the strongest temperature
                            and rainfall periods.
                        </p>

                    </div>


                    <div
                        id="seasonalGrid"
                        class="seasonal-grid"
                    >
                        <div class="chart-loading">
                            Loading seasonal analysis...
                        </div>
                    </div>

                </section>


                <!-- INSIGHT -->

                <section class="insights-highlight">

                    <div class="highlight-icon">
                        ✦
                    </div>

                    <div class="highlight-content">

                        <span>
                            WEATHER INSIGHT
                        </span>

                        <h2>
                            What the historical data tells you
                        </h2>

                        <p id="insightSummaryText">
                            Analyzing historical patterns...
                        </p>

                    </div>

                </section>


                <!-- FOOTNOTE -->

                <section class="insights-data-note">

                    <div class="data-note-icon">
                        i
                    </div>

                    <div>

                        <strong>
                            About this data
                        </strong>

                        <p>
                            Historical weather values are retrieved
                            from Open-Meteo reanalysis data. They
                            represent modeled historical conditions
                            for the selected coordinates and are not
                            a direct reading from one local weather station.
                        </p>

                    </div>

                </section>

            </div>

        </main>
    `;

    initializeInsights();
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeInsights() {

    const input =
        document.getElementById(
            "insightsLocation"
        );

    const searchButton =
        document.getElementById(
            "insightsSearchButton"
        );

    const currentButton =
        document.getElementById(
            "insightsCurrentLocation"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                const city =
                    input.value.trim();

                if (!city) {

                    setInsightsStatus(
                        "Please enter a location.",
                        "error"
                    );

                    return;
                }

                fetchInsights(
                    city,
                    currentInsightsYears
                );
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

                        fetchInsights(
                            city,
                            currentInsightsYears
                        );
                    }
                }
            }
        );
    }


    document
        .querySelectorAll(
            ".insights-period-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".insights-period-button"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add(
                        "active"
                    );


                    currentInsightsYears =
                        Number(
                            this.dataset.years
                        );


                    const city =
                        input.value.trim();

                    if (city) {

                        fetchInsights(
                            city,
                            currentInsightsYears
                        );
                    }
                }
            );

        });


    if (currentButton) {

        currentButton.addEventListener(
            "click",
            detectInsightsLocation
        );

    }


    fetchInsights(
        "Solapur",
        currentInsightsYears
    );
}


/* =========================================================
   CITY INSIGHTS
========================================================= */

async function fetchInsights(
    city,
    years
) {

    setInsightsStatus(
        `Analyzing ${city} historical weather...`,
        "loading"
    );


    try {

        const response =
            await fetch(
                `${INSIGHTS_API_URL}?city=${encodeURIComponent(
                    city
                )}&years=${years}`,
                {
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to load historical data."
            );
        }


        if (
            result.status !== "success" ||
            !result.data
        ) {

            throw new Error(
                "Historical analysis is unavailable."
            );
        }


        renderInsights(
            result.data
        );


        setInsightsStatus(
            `Analysis updated for ${result.data.location.name}.`,
            "success"
        );

    }

    catch (error) {

        console.error(
            "Insights error:",
            error
        );

        setInsightsStatus(
            error.message ||
            "Unable to load insights.",
            "error"
        );
    }
}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function detectInsightsLocation() {

    if (!navigator.geolocation) {

        setInsightsStatus(
            "Geolocation is not supported by your browser.",
            "error"
        );

        return;
    }


    setInsightsStatus(
        "Detecting your current location...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                /*
                    First get the actual city name
                    using the existing weather
                    coordinate endpoint.
                */

                const weatherResponse =
                    await fetch(
                        `${INSIGHTS_WEATHER_URL}/coordinates?lat=${latitude}&lon=${longitude}`,
                        {
                            cache: "no-store"
                        }
                    );


                const weatherResult =
                    await weatherResponse.json();


                if (!weatherResponse.ok) {

                    throw new Error(
                        weatherResult.detail ||
                        "Unable to determine current location."
                    );
                }


                const weather =
                    weatherResult.data;


                if (!weather) {

                    throw new Error(
                        "Current location data is unavailable."
                    );
                }


                const input =
                    document.getElementById(
                        "insightsLocation"
                    );


                if (input) {

                    input.value =
                        weather.city;
                }


                /*
                    IMPORTANT:
                    Use coordinates directly for
                    historical analysis.

                    This avoids searching the city
                    again and gives more accurate
                    location-specific historical data.
                */

                fetchCoordinateInsights(
                    latitude,
                    longitude,
                    currentInsightsYears,
                    weather.city
                );

            }

            catch (error) {

                console.error(
                    "Current location error:",
                    error
                );

                setInsightsStatus(
                    error.message ||
                    "Unable to load current location.",
                    "error"
                );
            }

        },

        function (error) {

            let message =
                "Unable to access your location.";

            if (error.code === 1) {

                message =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                message =
                    "Your location could not be determined.";

            } else if (error.code === 3) {

                message =
                    "Location request timed out.";
            }


            setInsightsStatus(
                message,
                "error"
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}


/* =========================================================
   COORDINATE INSIGHTS
========================================================= */

async function fetchCoordinateInsights(
    latitude,
    longitude,
    years,
    cityName
) {

    setInsightsStatus(
        `Analyzing historical weather for ${cityName}...`,
        "loading"
    );


    try {

        const response =
            await fetch(
                `${INSIGHTS_COORDINATE_URL}?lat=${latitude}&lon=${longitude}&years=${years}`,
                {
                    cache: "no-store"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to load location insights."
            );
        }


        if (
            result.status !== "success" ||
            !result.data
        ) {

            throw new Error(
                "Historical location data is unavailable."
            );
        }


        /*
            Replace generic Current Location
            with the actual resolved city.
        */

        result.data.location.name =
            cityName;


        renderInsights(
            result.data
        );


        setInsightsStatus(
            `Analysis updated for ${cityName}.`,
            "success"
        );

    }

    catch (error) {

        console.error(
            "Coordinate insights error:",
            error
        );

        setInsightsStatus(
            error.message ||
            "Unable to load historical insights.",
            "error"
        );
    }
}


/* =========================================================
   RENDER INSIGHTS
========================================================= */

function renderInsights(data) {

    const location =
        data.location || {};

    const summary =
        data.summary || {};

    const yearly =
        data.yearly || [];

    const monthly =
        data.monthly || [];


    const city =
        location.name ||
        "Current Location";


    const cityElement =
        document.getElementById(
            "insightsCity"
        );


    if (cityElement) {

        cityElement.textContent =
            city;
    }


    const dateRange =
        document.getElementById(
            "insightsDateRange"
        );


    if (dateRange && data.period) {

        dateRange.textContent =
            `${formatDate(data.period.start_date)} – ${formatDate(data.period.end_date)}`;
    }


    /* KPI */

    const temperature =
        document.getElementById(
            "kpiTemperature"
        );


    if (temperature) {

        temperature.textContent =
            formatNumber(
                summary.average_temperature,
                1
            ) + "°C";
    }


    const rainfall =
        document.getElementById(
            "kpiRainfall"
        );


    if (rainfall) {

        rainfall.textContent =
            formatNumber(
                summary.total_rainfall,
                1
            ) + " mm";
    }


    const rainyDays =
        document.getElementById(
            "kpiRainyDays"
        );


    if (rainyDays) {

        rainyDays.textContent =
            formatNumber(
                summary.rainy_days,
                0
            );
    }


    renderTemperatureChart(
        yearly
    );


    renderRainfallChart(
        yearly
    );


    renderSeasonalPattern(
        monthly
    );


    renderInsightSummary(
        yearly,
        monthly,
        summary
    );
}


/* =========================================================
   TEMPERATURE CHART
========================================================= */

function renderTemperatureChart(
    yearly
) {

    const container =
        document.getElementById(
            "temperatureChart"
        );


    if (!container) return;


    if (!yearly.length) {

        container.innerHTML =
            emptyChartMessage(
                "No yearly temperature data available."
            );

        return;
    }


    const values =
        yearly.map(
            item =>
                Number(
                    item.average_temperature
                )
        );


    const labels =
        yearly.map(
            item =>
                item.year
            );


    const min =
        Math.min(...values);

    const max =
        Math.max(...values);


    const range =
        max - min || 1;


    const width = 900;
    const height = 320;

    const left = 55;
    const right = 25;
    const top = 25;
    const bottom = 45;


    const chartWidth =
        width - left - right;

    const chartHeight =
        height - top - bottom;


    const points =
        values.map(
            function (value, index) {

                const x =
                    left +
                    (
                        index /
                        Math.max(
                            values.length - 1,
                            1
                        )
                    ) *
                    chartWidth;


                const y =
                    top +
                    (
                        1 -
                        (
                            (value - min) /
                            range
                        )
                    ) *
                    chartHeight;


                return {
                    x,
                    y,
                    value
                };
            }
        );


    const polyline =
        points
            .map(
                point =>
                    `${point.x},${point.y}`
            )
            .join(" ");


    const circles =
        points
            .map(
                point => `
                    <circle
                        cx="${point.x}"
                        cy="${point.y}"
                        r="5"
                        class="chart-point"
                    ></circle>
                `
            )
            .join("");


    const labelsSvg =
        points
            .map(
                (point, index) => `
                    <text
                        x="${point.x}"
                        y="${height - 15}"
                        text-anchor="middle"
                        class="chart-label"
                    >
                        ${labels[index]}
                    </text>
                `
            )
            .join("");


    const valueLabels =
        points
            .map(
                point => `
                    <text
                        x="${point.x}"
                        y="${point.y - 13}"
                        text-anchor="middle"
                        class="chart-value"
                    >
                        ${point.value.toFixed(1)}°
                    </text>
                `
            )
            .join("");


    container.innerHTML = `

        <svg
            viewBox="0 0 ${width} ${height}"
            preserveAspectRatio="none"
            class="insights-svg-chart"
        >

            <line
                x1="${left}"
                y1="${top}"
                x2="${width - right}"
                y2="${top}"
                class="chart-grid-line"
            />

            <line
                x1="${left}"
                y1="${height / 2}"
                x2="${width - right}"
                y2="${height / 2}"
                class="chart-grid-line"
            />

            <line
                x1="${left}"
                y1="${height - bottom}"
                x2="${width - right}"
                y2="${height - bottom}"
                class="chart-grid-line"
            />

            <polyline
                points="${polyline}"
                fill="none"
                class="temperature-line"
            />

            ${circles}

            ${valueLabels}

            ${labelsSvg}

        </svg>
    `;
}


/* =========================================================
   RAINFALL CHART
========================================================= */

function renderRainfallChart(
    yearly
) {

    const container =
        document.getElementById(
            "rainfallChart"
        );


    if (!container) return;


    if (!yearly.length) {

        container.innerHTML =
            emptyChartMessage(
                "No yearly rainfall data available."
            );

        return;
    }


    const values =
        yearly.map(
            item =>
                Number(
                    item.rainfall || 0
                )
        );


    const max =
        Math.max(
            ...values,
            1
        );


    container.innerHTML = `

        <div class="rainfall-bars">

            ${yearly.map(
                function (item) {

                    const value =
                        Number(
                            item.rainfall || 0
                        );

                    const height =
                        Math.max(
                            (value / max) * 100,
                            3
                        );

                    return `

                        <div class="rainfall-column">

                            <div class="rainfall-value">
                                ${value.toFixed(0)}
                            </div>

                            <div
                                class="rainfall-bar-track"
                            >

                                <div
                                    class="rainfall-bar-fill"
                                    style="height:${height}%"
                                ></div>

                            </div>

                            <div class="rainfall-year">
                                ${item.year}
                            </div>

                        </div>
                    `;
                }
            ).join("")}

        </div>
    `;
}


/* =========================================================
   SEASONAL PATTERN
========================================================= */

function renderSeasonalPattern(
    monthly
) {

    const container =
        document.getElementById(
            "seasonalGrid"
        );


    if (!container) return;


    if (!monthly.length) {

        container.innerHTML =
            emptyChartMessage(
                "No monthly climate data available."
            );

        return;
    }


    const seasons = {

        "Winter": [12, 1, 2],

        "Summer": [3, 4, 5],

        "Monsoon": [6, 7, 8, 9],

        "Autumn": [10, 11]
    };


    const monthMap = {};


    monthly.forEach(
        function (item) {

            monthMap[
                Number(item.month)
            ] = item;

        }
    );


    container.innerHTML =
        Object.entries(
            seasons
        )
        .map(
            function ([season, months]) {

                const items =
                    months
                        .map(
                            month =>
                                monthMap[month]
                        )
                        .filter(Boolean);


                if (!items.length) {

                    return `
                        <article class="season-card">

                            <span>
                                ${season}
                            </span>

                            <strong>
                                —
                            </strong>

                            <small>
                                No data
                            </small>

                        </article>
                    `;
                }


                const temps =
                    items
                        .map(
                            item =>
                                Number(
                                    item.average_temperature
                                )
                        );


                const rainfall =
                    items
                        .map(
                            item =>
                                Number(
                                    item.rainfall || 0
                                )
                        );


                const avgTemp =
                    temps.reduce(
                        (a, b) =>
                            a + b,
                        0
                    ) /
                    temps.length;


                const totalRain =
                    rainfall.reduce(
                        (a, b) =>
                            a + b,
                        0
                    );


                return `

                    <article class="season-card">

                        <div class="season-card-top">

                            <span>
                                ${season}
                            </span>

                            <div class="season-dot"></div>

                        </div>

                        <strong>
                            ${avgTemp.toFixed(1)}°C
                        </strong>

                        <small>
                            Avg temperature
                        </small>

                        <div class="season-rain">

                            <span>
                                Rainfall
                            </span>

                            <strong>
                                ${totalRain.toFixed(0)} mm
                            </strong>

                        </div>

                    </article>
                `;
            }
        )
        .join("");
}


/* =========================================================
   DATA-DRIVEN SUMMARY
========================================================= */

function renderInsightSummary(
    yearly,
    monthly,
    summary
) {

    const element =
        document.getElementById(
            "insightSummaryText"
        );


    if (!element) return;


    if (!yearly.length) {

        element.textContent =
            "There is not enough historical data to generate a summary.";

        return;
    }


    let text =
        `Across the selected period, ${summary.rainy_days} days recorded at least 1 mm of precipitation, with total rainfall of ${Number(summary.total_rainfall).toFixed(1)} mm. `;


    if (yearly.length >= 2) {

        const first =
            yearly[0];

        const last =
            yearly[yearly.length - 1];


        const difference =
            Number(
                last.average_temperature
            ) -
            Number(
                first.average_temperature
            );


        if (Math.abs(difference) >= 0.5) {

            if (difference > 0) {

                text +=
                    `The average temperature in ${last.year} was ${Math.abs(difference).toFixed(1)}°C higher than in ${first.year}.`;

            } else {

                text +=
                    `The average temperature in ${last.year} was ${Math.abs(difference).toFixed(1)}°C lower than in ${first.year}.`;
            }

        } else {

            text +=
                `Average temperature remained relatively close between ${first.year} and ${last.year}.`;
        }

    } else {

        text +=
            "The selected period provides one year of historical weather data for comparison.";
    }


    element.textContent =
        text;
}


/* =========================================================
   STATUS
========================================================= */

function setInsightsStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "insightsStatus"
        );


    if (!status) return;


    status.textContent =
        message;


    status.className =
        "insights-status";


    if (type) {

        status.classList.add(
            `status-${type}`
        );
    }
}


/* =========================================================
   HELPERS
========================================================= */

function formatNumber(
    value,
    decimals
) {

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        return "—";
    }


    return Number(value).toFixed(
        decimals
    );
}


function formatDate(
    value
) {

    if (!value) return "—";


    const date =
        new Date(
            `${value}T00:00:00`
        );


    if (Number.isNaN(date.getTime())) {

        return value;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function emptyChartMessage(
    message
) {

    return `
        <div class="chart-empty">
            ${message}
        </div>
    `;
}


/* =========================================================
   GLOBAL FUNCTION
========================================================= */

window.loadInsights =
    loadInsights;