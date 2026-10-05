import os
import json
import urllib.parse
import urllib.request
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")

CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


def make_request(url, params):
    if not API_KEY:
        raise Exception("WEATHER_API_KEY is not configured.")

    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"

    try:
        with urllib.request.urlopen(full_url, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))

    except Exception as error:
        raise Exception(f"Unable to fetch weather data: {error}")


def get_current_weather(city: str):

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    data = make_request(CURRENT_URL, params)

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "condition": data["weather"][0]["description"],
        "weather_main": data["weather"][0]["main"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "pressure": data["main"]["pressure"],
        "visibility": data.get("visibility", 0) / 1000,
        "sunrise": data["sys"]["sunrise"],
        "sunset": data["sys"]["sunset"],
        "timezone": data.get("timezone", 0)
    }


def get_weather_by_coordinates(lat: float, lon: float):

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "metric"
    }

    data = make_request(CURRENT_URL, params)

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "condition": data["weather"][0]["description"],
        "weather_main": data["weather"][0]["main"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "pressure": data["main"]["pressure"],
        "visibility": data.get("visibility", 0) / 1000,
        "sunrise": data["sys"]["sunrise"],
        "sunset": data["sys"]["sunset"],
        "timezone": data.get("timezone", 0)
    }


def get_forecast(city: str):

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    data = make_request(FORECAST_URL, params)

    return format_forecast(data)


def get_forecast_by_coordinates(lat: float, lon: float):

    params = {
        "lat": lat,
        "lon": lon,
        "appid": API_KEY,
        "units": "metric"
    }

    data = make_request(FORECAST_URL, params)

    return format_forecast(data)


def format_forecast(data):

    forecast_items = []

    for item in data["list"]:

        forecast_items.append({
            "time": item["dt"],
            "date": item["dt_txt"],
            "temperature": item["main"]["temp"],
            "feels_like": item["main"]["feels_like"],
            "condition": item["weather"][0]["description"],
            "weather_main": item["weather"][0]["main"],
            "humidity": item["main"]["humidity"],
            "wind_speed": item["wind"]["speed"],
            "rain_probability": round(
                item.get("pop", 0) * 100
            )
        })

    return {
        "city": data["city"]["name"],
        "country": data["city"]["country"],
        "timezone": data["city"]["timezone"],
        "forecast": forecast_items
    }