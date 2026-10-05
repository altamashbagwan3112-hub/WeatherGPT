function loadHome() {

    const pageContent =
        document.getElementById("page-content");

    if (!pageContent) {
        return;
    }

    pageContent.innerHTML = `

        <section class="hero-section">

            <div class="container">

                <div class="row align-items-center g-5">

                    <!-- LEFT CONTENT -->

                    <div class="col-lg-7">

                        <div class="hero-content fade-in">

                            <span class="hero-label">
                                AI-POWERED WEATHER
                                INTELLIGENCE
                            </span>


                            <h1 class="hero-title">

                                Understand the weather.

                                <span class="text-gradient">
                                    Naturally.
                                </span>

                            </h1>


                            <p class="hero-description">

                                Ask questions about weather,
                                forecasts, alerts and historical
                                conditions in a simple
                                conversational way.

                            </p>


                            <!-- SEARCH -->

                            <div class="hero-search">

                                <input
                                    type="text"
                                    id="weatherQuery"
                                    placeholder="Ask about the weather..."
                                    autocomplete="off"
                                >

                                <button
                                    type="button"
                                    id="askWeatherBtn"
                                >
                                    Ask WeatherGPT
                                </button>

                            </div>


                            <!-- QUICK QUESTIONS -->

                            <div class="quick-questions">

                                <span>
                                    Try asking:
                                </span>


                                <button
                                    type="button"
                                    class="quick-question"
                                    data-query="What is the weather in Hyderabad today?"
                                >
                                    Weather today
                                </button>


                                <button
                                    type="button"
                                    class="quick-question"
                                    data-query="What is tomorrow's forecast in Hyderabad?"
                                >
                                    Tomorrow's forecast
                                </button>


                                <button
                                    type="button"
                                    class="quick-question"
                                    data-query="Are there any rain alerts in Hyderabad?"
                                >
                                    Rain alerts
                                </button>

                            </div>


                            <!-- STATUS -->

                            <div
                                id="queryStatus"
                                class="query-status"
                            ></div>


                            <!-- CHAT RESPONSE -->

                            <div
                                id="chatResponse"
                                class="chat-response"
                                style="display:none;"
                            >

                                <div class="chat-response-header">
                                    WeatherGPT
                                </div>

                                <div
                                    id="chatAnswer"
                                    class="chat-answer"
                                ></div>

                            </div>

                        </div>

                    </div>


                    <!-- RIGHT WEATHER -->

                    <div class="col-lg-5">

                        <div
                            class="weather-preview fade-in"
                        >

                            <div class="preview-glow"></div>

                            <div class="preview-glow-secondary"></div>


                            <div class="preview-content">


                                <div class="preview-top">

                                    <span class="preview-label">
                                        CURRENT WEATHER
                                    </span>


                                    <span class="live-indicator">

                                        <span></span>

                                        Live

                                    </span>

                                </div>


                                <!-- LOCATION -->

                                <p
                                    id="previewLocation"
                                    class="preview-location"
                                >
                                    Detecting location...
                                </p>


                                <!-- TEMPERATURE -->

                                <div class="temperature-row">

                                    <h2 id="previewTemperature">
                                        --°
                                    </h2>


                                    <div
                                        id="previewWeatherSymbol"
                                        class="weather-symbol"
                                    >
                                        ☁
                                    </div>

                                </div>


                                <!-- CONDITION -->

                                <p
                                    id="previewCondition"
                                    class="preview-condition"
                                >
                                    Loading weather...
                                </p>


                                <!-- DETAILS -->

                                <div class="preview-details">


                                    <div>

                                        <span>
                                            Humidity
                                        </span>

                                        <strong
                                            id="previewHumidity"
                                        >
                                            --
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Wind
                                        </span>

                                        <strong
                                            id="previewWind"
                                        >
                                            --
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Feels Like
                                        </span>

                                        <strong
                                            id="previewFeelsLike"
                                        >
                                            --
                                        </strong>

                                    </div>


                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    `;


    initializeHomeInteractions();

    loadRuntimeWeather();

}


/* ==================================================
   HOME INTERACTIONS
================================================== */

function initializeHomeInteractions() {

    const queryInput =
        document.getElementById("weatherQuery");


    const askButton =
        document.getElementById("askWeatherBtn");


    const status =
        document.getElementById("queryStatus");


    const chatResponse =
        document.getElementById("chatResponse");


    const chatAnswer =
        document.getElementById("chatAnswer");


    const quickQuestions =
        document.querySelectorAll(
            ".quick-question"
        );


    if (!queryInput || !askButton) {
        return;
    }


    /* ==================================================
       ASK WEATHERGPT
    ================================================== */

    async function askWeatherGPT() {

        const question =
            queryInput.value.trim();


        if (!question) {

            status.textContent =
                "Please enter a weather question.";

            status.classList.add(
                "show",
                "error"
            );

            chatResponse.style.display =
                "none";

            return;
        }


        status.textContent =
            "WeatherGPT is checking the weather...";

        status.classList.add("show");

        status.classList.remove("error");


        chatResponse.style.display =
            "none";


        askButton.disabled =
            true;

        askButton.textContent =
            "Checking...";


        try {

            const response =
                await fetch(
                    "http://127.0.0.1:8000/api/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            question: question
                        })
                    }
                );


            const result =
                await response.json();


            console.log(
                "WeatherGPT:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    `Backend error: ${response.status}`
                );

            }


            if (
                result.status === "success" &&
                result.answer
            ) {

                chatAnswer.textContent =
                    result.answer;


                chatResponse.style.display =
                    "block";


                status.textContent =
                    `WeatherGPT • ${result.city || "Response ready"}`;

            } else {

                throw new Error(
                    "WeatherGPT did not return an answer."
                );

            }


        } catch (error) {

            console.error(
                "Chat error:",
                error
            );


            status.textContent =
                error.message ||
                "Unable to connect to WeatherGPT.";

            status.classList.add(
                "show",
                "error"
            );


            chatResponse.style.display =
                "none";

        }


        finally {

            askButton.disabled =
                false;

            askButton.textContent =
                "Ask WeatherGPT";

        }

    }


    /* ==================================================
       ASK BUTTON
    ================================================== */

    askButton.addEventListener(
        "click",
        askWeatherGPT
    );


    /* ==================================================
       ENTER KEY
    ================================================== */

    queryInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                askWeatherGPT();

            }

        }
    );


    /* ==================================================
       QUICK QUESTIONS
    ================================================== */

    quickQuestions.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    queryInput.value =
                        button.dataset.query;

                    queryInput.focus();

                    askWeatherGPT();

                }
            );

        }
    );

}


/* ==================================================
   RUNTIME WEATHER
================================================== */

async function loadRuntimeWeather() {

    const locationElement =
        document.getElementById(
            "previewLocation"
        );

    const temperatureElement =
        document.getElementById(
            "previewTemperature"
        );

    const conditionElement =
        document.getElementById(
            "previewCondition"
        );

    const humidityElement =
        document.getElementById(
            "previewHumidity"
        );

    const windElement =
        document.getElementById(
            "previewWind"
        );

    const feelsLikeElement =
        document.getElementById(
            "previewFeelsLike"
        );

    const symbolElement =
        document.getElementById(
            "previewWeatherSymbol"
        );


    if (!locationElement) {
        return;
    }


    /* --------------------------------------------------
       Check browser location support
    -------------------------------------------------- */

    if (!navigator.geolocation) {

        locationElement.textContent =
            "Location unavailable";

        conditionElement.textContent =
            "Geolocation is not supported.";

        return;

    }


    locationElement.textContent =
        "Detecting your location...";


    try {

        const position =
            await getUserLocation();


        const latitude =
            position.coords.latitude;


        const longitude =
            position.coords.longitude;


        console.log(
            "User coordinates:",
            latitude,
            longitude
        );


        /* ------------------------------------------------
           Ask backend for weather
        ------------------------------------------------ */

        const response =
            await fetch(
                `http://127.0.0.1:8000/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Unable to fetch location weather."
            );

        }


        const data =
            result.data;


        console.log(
            "Runtime weather:",
            data
        );


        /* ------------------------------------------------
           Location
        ------------------------------------------------ */

        const city =
            data.city || "Current Location";


        const country =
            data.country || "";


        locationElement.textContent =
            country
                ? `${city}, ${country}`
                : city;


        /* ------------------------------------------------
           Temperature
        ------------------------------------------------ */

        temperatureElement.textContent =
            `${Math.round(data.temperature)}°`;


        /* ------------------------------------------------
           Condition
        ------------------------------------------------ */

        conditionElement.textContent =
            capitalizeCondition(
                data.condition
            );


        /* ------------------------------------------------
           Humidity
        ------------------------------------------------ */

        humidityElement.textContent =
            `${data.humidity}%`;


        /* ------------------------------------------------
           Wind
        ------------------------------------------------
           Backend returns m/s.
           Convert to km/h.
        */

        const windKmh =
            Number(data.wind_speed) * 3.6;


        windElement.textContent =
            `${windKmh.toFixed(1)} km/h`;


        /* ------------------------------------------------
           Feels Like
        ------------------------------------------------ */

        feelsLikeElement.textContent =
            `${Math.round(data.feels_like)}°`;


        /* ------------------------------------------------
           Weather icon
        ------------------------------------------------ */

        symbolElement.textContent =
            getWeatherEmoji(
                data.weather_main,
                data.condition
            );


    } catch (error) {

        console.error(
            "Runtime weather error:",
            error
        );


        locationElement.textContent =
            "Location unavailable";


        conditionElement.textContent =
            "Unable to load live weather";


        temperatureElement.textContent =
            "--°";


        humidityElement.textContent =
            "--";


        windElement.textContent =
            "--";


        feelsLikeElement.textContent =
            "--";

    }

}


/* ==================================================
   BROWSER GEOLOCATION
================================================== */

function getUserLocation() {

    return new Promise(
        function(resolve, reject) {

            navigator.geolocation.getCurrentPosition(

                function(position) {

                    resolve(position);

                },

                function(error) {

                    reject(error);

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }

            );

        }
    );

}


/* ==================================================
   CONDITION TEXT
================================================== */

function capitalizeCondition(
    condition
) {

    if (!condition) {
        return "Weather unavailable";
    }


    return condition
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

}


/* ==================================================
   WEATHER EMOJI
================================================== */

function getWeatherEmoji(
    weatherMain,
    condition
) {

    const main =
        String(
            weatherMain || ""
        ).toLowerCase();


    const text =
        String(
            condition || ""
        ).toLowerCase();


    if (main.includes("thunderstorm")) {
        return "⛈️";
    }


    if (main.includes("rain")) {
        return "🌧️";
    }


    if (main.includes("drizzle")) {
        return "🌦️";
    }


    if (main.includes("snow")) {
        return "❄️";
    }


    if (main.includes("mist") ||
        main.includes("fog") ||
        main.includes("haze")) {

        return "🌫️";

    }


    if (main.includes("clear")) {
        return "☀️";
    }


    if (main.includes("cloud")) {

        if (text.includes("overcast")) {
            return "☁️";
        }

        return "🌤️";

    }


    return "🌤️";

}