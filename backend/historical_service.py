import json
import urllib.parse
import urllib.request
from datetime import date, timedelta


# ============================================================
# API URLs
# ============================================================

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

HISTORICAL_URL = "https://archive-api.open-meteo.com/v1/archive"


# ============================================================
# Common API Request
# ============================================================

def make_request(url, params):
    query_string = urllib.parse.urlencode(params)
    full_url = f"{url}?{query_string}"

    try:
        with urllib.request.urlopen(
            full_url,
            timeout=20
        ) as response:

            return json.loads(
                response.read().decode("utf-8")
            )

    except Exception as error:
        raise Exception(
            f"Unable to fetch historical weather data: {error}"
        )


# ============================================================
# City Geocoding
# ============================================================

def get_location(city: str):

    city = city.strip()

    if not city:
        raise ValueError(
            "Please enter a city name."
        )

    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    data = make_request(
        GEOCODING_URL,
        params
    )

    results = data.get(
        "results",
        []
    )

    if not results:
        raise ValueError(
            f"Location '{city}' was not found. "
            "Please try another city."
        )

    location = results[0]

    return {
        "name": location.get("name"),
        "country": location.get("country"),
        "country_code": location.get("country_code"),
        "admin1": location.get("admin1"),
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "timezone": location.get("timezone")
    }


# ============================================================
# Historical Date Range
# ============================================================

def get_date_range(years: int):

    if years not in [1, 3, 5]:
        raise ValueError(
            "Years must be 1, 3, or 5."
        )

    # Open-Meteo historical archive can have a short
    # availability delay, so use data up to 2 days ago.
    end_date = date.today() - timedelta(days=2)

    try:

        start_date = end_date.replace(
            year=end_date.year - years
        )

    except ValueError:

        # Handles leap-year edge cases.
        start_date = end_date.replace(
            month=2,
            day=28,
            year=end_date.year - years
        )

    return start_date, end_date


# ============================================================
# Fetch Historical Weather
# ============================================================

def get_historical_weather(
    latitude: float,
    longitude: float,
    years: int
):

    start_date, end_date = get_date_range(years)

    params = {
        "latitude": latitude,
        "longitude": longitude,

        "start_date": start_date.isoformat(),

        "end_date": end_date.isoformat(),

        "daily": (
            "temperature_2m_mean,"
            "temperature_2m_max,"
            "temperature_2m_min,"
            "precipitation_sum,"
            "rain_sum,"
            "precipitation_hours"
        ),

        "timezone": "auto"
    }

    data = make_request(
        HISTORICAL_URL,
        params
    )

    if "daily" not in data:
        raise Exception(
            "Historical weather data is unavailable."
        )

    if "time" not in data["daily"]:
        raise Exception(
            "Historical weather dates are unavailable."
        )

    return data


# ============================================================
# Calculate Average
# ============================================================

def calculate_average(values):

    valid_values = [
        value
        for value in values
        if value is not None
    ]

    if not valid_values:
        return None

    return (
        sum(valid_values)
        / len(valid_values)
    )


# ============================================================
# Calculate Sum
# ============================================================

def calculate_sum(values):

    valid_values = [
        value
        for value in values
        if value is not None
    ]

    if not valid_values:
        return 0

    return sum(valid_values)


# ============================================================
# Build Yearly Historical Data
# ============================================================

def build_yearly_data(daily):

    dates = daily.get(
        "time",
        []
    )

    temperatures = daily.get(
        "temperature_2m_mean",
        []
    )

    rainfall = daily.get(
        "precipitation_sum",
        []
    )

    yearly = {}

    for index, current_date in enumerate(dates):

        year = current_date[:4]

        if year not in yearly:

            yearly[year] = {
                "temperatures": [],
                "rainfall": [],
                "rainy_days": 0
            }

        # Temperature
        if index < len(temperatures):

            temperature = temperatures[index]

            if temperature is not None:

                yearly[year]["temperatures"].append(
                    temperature
                )

        # Rainfall
        if index < len(rainfall):

            rain = rainfall[index]

            if rain is not None:

                yearly[year]["rainfall"].append(
                    rain
                )

                # A rainy day = precipitation >= 1 mm
                if rain >= 1:

                    yearly[year]["rainy_days"] += 1

    result = []

    for year in sorted(yearly.keys()):

        item = yearly[year]

        average_temperature = calculate_average(
            item["temperatures"]
        )

        total_rainfall = calculate_sum(
            item["rainfall"]
        )

        result.append({

            "year": int(year),

            "average_temperature": (
                round(
                    average_temperature,
                    1
                )
                if average_temperature is not None
                else None
            ),

            "rainfall": round(
                total_rainfall,
                1
            ),

            "rainy_days": item[
                "rainy_days"
            ]
        })

    return result


# ============================================================
# Build Monthly / Seasonal Data
# ============================================================

def build_monthly_data(daily):

    dates = daily.get(
        "time",
        []
    )

    temperatures = daily.get(
        "temperature_2m_mean",
        []
    )

    rainfall = daily.get(
        "precipitation_sum",
        []
    )

    monthly = {}

    for index, current_date in enumerate(dates):

        # Extract month number
        month = current_date[5:7]

        if month not in monthly:

            monthly[month] = {
                "temperatures": [],
                "rainfall": []
            }

        # Temperature
        if index < len(temperatures):

            temperature = temperatures[index]

            if temperature is not None:

                monthly[month][
                    "temperatures"
                ].append(
                    temperature
                )

        # Rainfall
        if index < len(rainfall):

            rain = rainfall[index]

            if rain is not None:

                monthly[month][
                    "rainfall"
                ].append(
                    rain
                )

    result = []

    for month in sorted(monthly.keys()):

        item = monthly[month]

        average_temperature = calculate_average(
            item["temperatures"]
        )

        total_rainfall = calculate_sum(
            item["rainfall"]
        )

        result.append({

            "month": int(month),

            "average_temperature": (
                round(
                    average_temperature,
                    1
                )
                if average_temperature is not None
                else None
            ),

            "rainfall": round(
                total_rainfall,
                1
            )
        })

    return result


# ============================================================
# Build Insights For City Search
# ============================================================

def build_insights(
    city: str,
    years: int
):

    if years not in [1, 3, 5]:

        raise ValueError(
            "Years must be 1, 3, or 5."
        )

    # 1. Convert city name → coordinates
    location = get_location(city)

    # 2. Fetch historical weather
    historical = get_historical_weather(
        location["latitude"],
        location["longitude"],
        years
    )

    # 3. Get daily data
    daily = historical["daily"]

    temperatures = daily.get(
        "temperature_2m_mean",
        []
    )

    rainfall = daily.get(
        "precipitation_sum",
        []
    )

    # 4. Valid temperature values
    valid_temperatures = [
        value
        for value in temperatures
        if value is not None
    ]

    # 5. Valid rainfall values
    valid_rainfall = [
        value
        for value in rainfall
        if value is not None
    ]

    # 6. Rainy days
    rainy_days = sum(
        1
        for value in valid_rainfall
        if value >= 1
    )

    # 7. Yearly analysis
    yearly = build_yearly_data(
        daily
    )

    # 8. Monthly / seasonal analysis
    monthly = build_monthly_data(
        daily
    )

    # 9. Overall average temperature
    average_temperature = calculate_average(
        valid_temperatures
    )

    # 10. Overall rainfall
    total_rainfall = calculate_sum(
        valid_rainfall
    )

    return {

        "location": location,

        "period": {

            "years": years,

            "start_date": daily[
                "time"
            ][0],

            "end_date": daily[
                "time"
            ][-1]
        },

        "summary": {

            "average_temperature": (
                round(
                    average_temperature,
                    1
                )
                if average_temperature is not None
                else None
            ),

            "total_rainfall": round(
                total_rainfall,
                1
            ),

            "rainy_days": rainy_days
        },

        "yearly": yearly,

        "monthly": monthly,

        "data_source":
            "Open-Meteo Historical Weather API"
    }


# ============================================================
# Build Insights For Current Location
# ============================================================

def build_coordinate_insights(
    latitude: float,
    longitude: float,
    years: int
):

    if years not in [1, 3, 5]:

        years = 1

    # 1. Fetch historical data using
    #    latitude and longitude directly.
    historical = get_historical_weather(
        latitude,
        longitude,
        years
    )

    # IMPORTANT:
    # get_historical_weather() returns:
    #
    # {
    #     "daily": {...}
    # }
    #
    # Therefore the analysis functions must
    # receive historical["daily"].
    daily = historical["daily"]

    # 2. Yearly analysis
    yearly = build_yearly_data(
        daily
    )

    # 3. Monthly analysis
    monthly = build_monthly_data(
        daily
    )

    # 4. Temperature values
    temperatures = daily.get(
        "temperature_2m_mean",
        []
    )

    valid_temperatures = [
        value
        for value in temperatures
        if value is not None
    ]

    # 5. Rainfall values
    rainfall = daily.get(
        "precipitation_sum",
        []
    )

    valid_rainfall = [
        value
        for value in rainfall
        if value is not None
    ]

    # 6. Average temperature
    average_temperature = calculate_average(
        valid_temperatures
    )

    # 7. Total rainfall
    total_rainfall = calculate_sum(
        valid_rainfall
    )

    # 8. Rainy days
    rainy_days = sum(
        1
        for value in valid_rainfall
        if value >= 1
    )

    # 9. Historical dates
    dates = daily.get(
        "time",
        []
    )

    if not dates:

        raise Exception(
            "Historical weather dates are unavailable."
        )

    return {

        "location": {

            "latitude": latitude,

            "longitude": longitude,

            "name": "Current Location"
        },

        "period": {

            "years": years,

            "start_date": dates[0],

            "end_date": dates[-1]
        },

        "summary": {

            "average_temperature": (
                round(
                    average_temperature,
                    1
                )
                if average_temperature is not None
                else None
            ),

            "total_rainfall": round(
                total_rainfall,
                1
            ),

            "rainy_days": rainy_days
        },

        "yearly": yearly,

        "monthly": monthly,

        "data_source":
            "Open-Meteo Historical Weather API"
    }