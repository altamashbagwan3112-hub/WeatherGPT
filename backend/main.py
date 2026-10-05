import re

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from weather_service import (
    get_current_weather,
    get_weather_by_coordinates,
    get_forecast,
    get_forecast_by_coordinates
)

from alert_service import generate_weather_alerts

from historical_service import (
    build_insights,
    build_coordinate_insights
)


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="WeatherGPT API",
    description="AI-powered conversational weather intelligence backend",
    version="1.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==================================================
# CHAT REQUEST MODEL
# ==================================================

class ChatRequest(BaseModel):
    question: str


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "status": "success",
        "message": "WeatherGPT Backend is running!"
    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/api/health")
def health_check():

    return {
        "status": "success",
        "message": "WeatherGPT API is healthy"
    }


# ==================================================
# CURRENT WEATHER BY CITY
# ==================================================

@app.get("/api/weather")
def weather(city: str):

    try:

        weather_data = get_current_weather(city)

        return {
            "status": "success",
            "data": weather_data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# CURRENT WEATHER BY COORDINATES
# ==================================================

@app.get("/api/weather/coordinates")
def weather_coordinates(
    lat: float,
    lon: float
):

    try:

        weather_data = get_weather_by_coordinates(
            lat,
            lon
        )

        return {
            "status": "success",
            "data": weather_data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# FORECAST BY CITY
# ==================================================

@app.get("/api/forecast")
def forecast(city: str):

    try:

        forecast_data = get_forecast(city)

        return {
            "status": "success",
            "data": forecast_data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# FORECAST BY COORDINATES
# ==================================================

@app.get("/api/forecast/coordinates")
def forecast_coordinates(
    lat: float,
    lon: float
):

    try:

        forecast_data = get_forecast_by_coordinates(
            lat,
            lon
        )

        return {
            "status": "success",
            "data": forecast_data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# WEATHER ALERTS
# ==================================================

@app.get("/api/alerts")
def weather_alerts(city: str):

    try:

        forecast_data = get_forecast(city)

        alerts = generate_weather_alerts(
            forecast_data
        )

        return {
            "status": "success",
            "city": forecast_data.get(
                "city",
                city
            ),
            "country": forecast_data.get(
                "country",
                ""
            ),
            "alerts": alerts
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# HISTORICAL WEATHER
# ==================================================

@app.get("/api/insights")
def weather_insights(
    city: str,
    years: int = 1
):

    try:

        insights_data = build_insights(
            city,
            years
        )

        return {
            "status": "success",
            "data": insights_data
        }

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# HISTORICAL WEATHER BY COORDINATES
# ==================================================

@app.get("/api/insights/coordinates")
def coordinate_insights(
    lat: float,
    lon: float,
    years: int = 1
):

    try:

        insights_data = build_coordinate_insights(
            lat,
            lon,
            years
        )

        return {
            "status": "success",
            "data": insights_data
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==================================================
# WEATHERGPT CHAT
# ==================================================


# --------------------------------------------------
# CLEAN QUESTION
# --------------------------------------------------

def clean_question(question: str):

    question = question.strip()

    question = re.sub(
        r"\s+",
        " ",
        question
    )

    return question


# --------------------------------------------------
# EXTRACT CITY
# --------------------------------------------------

def extract_city(question: str):

    question = clean_question(question)

    cleaned = re.sub(
        r"[?!.,]+$",
        "",
        question
    ).strip()

    patterns = [

        # Example:
        # What is the weather in Hyderabad today?
        r"\bin\s+(.+?)(?:\s+today|\s+tomorrow|\s+tonight|\s+now)?$",

        # Example:
        # What is the forecast for Mumbai?
        r"\bfor\s+(.+?)(?:\s+today|\s+tomorrow|\s+tonight|\s+now)?$",

        # Example:
        # Weather at Delhi
        r"\bat\s+(.+?)(?:\s+today|\s+tomorrow|\s+tonight|\s+now)?$",

        # Example:
        # Temperature of Pune
        r"\bof\s+(.+?)(?:\s+today|\s+tomorrow|\s+tonight|\s+now)?$"

    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            cleaned,
            re.IGNORECASE
        )

        if match:

            city = match.group(1).strip()

            # Remove "the" from beginning
            city = re.sub(
                r"^(the\s+)",
                "",
                city,
                flags=re.IGNORECASE
            )

            # Remove unnecessary words at the end
            city = re.sub(
                r"\s+(weather|forecast|temperature|conditions)$",
                "",
                city,
                flags=re.IGNORECASE
            )

            city = city.strip()

            if city:

                return city

    return None


# --------------------------------------------------
# DETECT INTENT
# --------------------------------------------------

def detect_intent(question: str):

    question_lower = question.lower()


    # ----------------------------------------------
    # HISTORICAL
    # ----------------------------------------------

    historical_words = [

        "historical",
        "history",
        "past weather",
        "previous weather",
        "weather history",
        "historical weather",
        "last year",
        "past year",
        "climate trend",
        "climate history",
        "trend"

    ]

    for word in historical_words:

        if word in question_lower:

            return "historical"


    # ----------------------------------------------
    # ALERTS
    # ----------------------------------------------

    alert_words = [

        "alert",
        "alerts",
        "warning",
        "warnings",
        "danger",
        "severe weather",
        "storm warning",
        "rain alert"

    ]

    for word in alert_words:

        if word in question_lower:

            return "alerts"


    # ----------------------------------------------
    # FORECAST
    # ----------------------------------------------

    forecast_words = [

        "forecast",
        "tomorrow",
        "day after tomorrow",
        "next day",
        "next 5 days",
        "next few days",
        "next week",
        "coming days",
        "will it rain",
        "will it be raining",
        "expected weather",
        "weather later"

    ]

    for word in forecast_words:

        if word in question_lower:

            return "forecast"


    # ----------------------------------------------
    # CURRENT WEATHER
    # ----------------------------------------------

    current_words = [

        "weather",
        "temperature",
        "temp",
        "hot",
        "cold",
        "rain",
        "raining",
        "wind",
        "humidity",
        "cloud",
        "cloudy",
        "sunny",
        "condition",
        "feels like",
        "currently",
        "right now",
        "today"

    ]

    for word in current_words:

        if word in question_lower:

            return "current"


    # Default
    return "current"


# ==================================================
# FORMAT CURRENT WEATHER ANSWER
# ==================================================

def format_current_answer(data):

    city = data.get(
        "city",
        "the selected location"
    )

    country = data.get(
        "country",
        ""
    )

    temperature = data.get(
        "temperature"
    )

    feels_like = data.get(
        "feels_like"
    )

    condition = data.get(
        "condition",
        ""
    )

    humidity = data.get(
        "humidity"
    )

    wind_speed = data.get(
        "wind_speed"
    )


    location = city

    if country:

        location = f"{city}, {country}"


    # Convert m/s to km/h
    wind_kmh = None

    if wind_speed is not None:

        wind_kmh = round(
            float(wind_speed) * 3.6,
            1
        )


    return (
        f"Current weather in {location}: "
        f"{round(temperature)}°C, "
        f"{condition}. "
        f"Feels like {round(feels_like)}°C. "
        f"Humidity is {humidity}%. "
        f"Wind speed is {wind_kmh} km/h."
    )


# ==================================================
# FORMAT FORECAST ANSWER
# ==================================================

def format_forecast_answer(data):

    city = data.get(
        "city",
        "the selected location"
    )

    country = data.get(
        "country",
        ""
    )

    forecast = data.get(
        "forecast",
        []
    )


    if not forecast:

        return (
            f"Forecast data is currently "
            f"unavailable for {city}."
        )


    location = city

    if country:

        location = f"{city}, {country}"


    forecast_text = []


    # Show first 8 forecast periods
    for item in forecast[:8]:

        date = item.get(
            "date",
            ""
        )

        temperature = item.get(
            "temperature"
        )

        condition = item.get(
            "condition",
            ""
        )

        rain_probability = item.get(
            "rain_probability",
            0
        )


        forecast_text.append(

            f"{date}: "
            f"{round(temperature)}°C, "
            f"{condition}, "
            f"rain probability "
            f"{rain_probability}%."

        )


    return (
        f"Forecast for {location}:\n"
        + "\n".join(forecast_text)
    )


# ==================================================
# FORMAT ALERT ANSWER
# ==================================================

def format_alert_answer(
    city,
    country,
    alerts
):

    location = city

    if country:

        location = f"{city}, {country}"


    if not alerts:

        return (
            f"No significant weather alerts "
            f"were detected by WeatherGPT "
            f"for {location}."
        )


    alert_text = []


    for alert in alerts[:5]:

        severity = alert.get(
            "severity",
            "Alert"
        )

        # Your alert service may use either
        # message or description
        message = alert.get(
            "message"
        )

        if not message:

            message = alert.get(
                "description",
                "Weather alert detected."
            )


        title = alert.get(
            "title"
        )

        if title:

            message = f"{title}: {message}"


        alert_text.append(
            f"{severity}: {message}"
        )


    return (
        f"Weather alerts for {location}:\n"
        + "\n".join(alert_text)
    )


# ==================================================
# FORMAT HISTORICAL ANSWER
# ==================================================

def format_historical_answer(data):

    location_data = data.get(
        "location",
        {}
    )

    location = location_data.get(
        "name",
        "the selected location"
    )


    summary = data.get(
        "summary",
        {}
    )


    years = data.get(
        "period",
        {}
    ).get(
        "years",
        1
    )


    average_temperature = summary.get(
        "average_temperature"
    )

    total_rainfall = summary.get(
        "total_rainfall"
    )

    rainy_days = summary.get(
        "rainy_days"
    )


    return (
        f"Historical weather summary for "
        f"{location} over the last "
        f"{years} year(s): "
        f"average temperature was "
        f"{average_temperature}°C, "
        f"total rainfall was "
        f"{total_rainfall} mm, "
        f"with {rainy_days} rainy days."
    )


# ==================================================
# WEATHERGPT CHAT API
# ==================================================

@app.post("/api/chat")
def weather_chat(
    request: ChatRequest
):

    # ----------------------------------------------
    # CLEAN QUESTION
    # ----------------------------------------------

    question = clean_question(
        request.question
    )


    # ----------------------------------------------
    # VALIDATE QUESTION
    # ----------------------------------------------

    if not question:

        raise HTTPException(
            status_code=400,
            detail="Please enter a weather question."
        )


    # ----------------------------------------------
    # DETECT INTENT
    # ----------------------------------------------

    intent = detect_intent(
        question
    )


    # ----------------------------------------------
    # EXTRACT CITY
    # ----------------------------------------------

    city = extract_city(
        question
    )


    # If city is not mentioned,
    # use Solapur as default.

    if not city:

        city = "Solapur"


    # ----------------------------------------------
    # DEBUG LOG
    # ----------------------------------------------

    print(
        f"[WeatherGPT] Question: {question}"
    )

    print(
        f"[WeatherGPT] Intent: {intent}"
    )

    print(
        f"[WeatherGPT] City: {city}"
    )


    try:

        # ==========================================
        # CURRENT WEATHER
        # ==========================================

        if intent == "current":

            weather_data = get_current_weather(
                city
            )


            answer = format_current_answer(
                weather_data
            )


            return {

                "status": "success",

                "intent": "current",

                "city": weather_data.get(
                    "city",
                    city
                ),

                "answer": answer,

                "data": weather_data

            }


        # ==========================================
        # FORECAST
        # ==========================================

        elif intent == "forecast":

            forecast_data = get_forecast(
                city
            )


            answer = format_forecast_answer(
                forecast_data
            )


            return {

                "status": "success",

                "intent": "forecast",

                "city": forecast_data.get(
                    "city",
                    city
                ),

                "answer": answer,

                "data": forecast_data

            }


        # ==========================================
        # WEATHER ALERTS
        # ==========================================

        elif intent == "alerts":

            forecast_data = get_forecast(
                city
            )


            alerts = generate_weather_alerts(
                forecast_data
            )


            answer = format_alert_answer(

                forecast_data.get(
                    "city",
                    city
                ),

                forecast_data.get(
                    "country",
                    ""
                ),

                alerts

            )


            return {

                "status": "success",

                "intent": "alerts",

                "city": forecast_data.get(
                    "city",
                    city
                ),

                "answer": answer,

                "alerts": alerts

            }


        # ==========================================
        # HISTORICAL WEATHER
        # ==========================================

        elif intent == "historical":

            insights_data = build_insights(
                city,
                1
            )


            answer = format_historical_answer(
                insights_data
            )


            return {

                "status": "success",

                "intent": "historical",

                "city": insights_data.get(
                    "location",
                    {}
                ).get(
                    "name",
                    city
                ),

                "answer": answer,

                "data": insights_data

            }


    # ==============================================
    # VALUE ERROR
    # ==============================================

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


    # ==============================================
    # OTHER ERROR
    # ==============================================

    except Exception as error:

        print(
            f"[WeatherGPT ERROR] {error}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )