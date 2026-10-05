from datetime import datetime, timezone


def format_forecast_time(value):
    """
    Convert Unix timestamp / ISO timestamp into
    a human-readable date and time.
    """

    if value is None:
        return "Time not available"

    try:
        # OpenWeather forecast normally gives Unix timestamp
        if isinstance(value, (int, float)):
            dt = datetime.fromtimestamp(value, tz=timezone.utc)

        else:
            value = str(value)

            # Numeric timestamp stored as string
            if value.isdigit():
                dt = datetime.fromtimestamp(
                    int(value),
                    tz=timezone.utc
                )
            else:
                dt = datetime.fromisoformat(
                    value.replace("Z", "+00:00")
                )

        return dt.strftime("%a, %d %b • %I:%M %p")

    except Exception:
        return "Time not available"


def get_time_only(value):
    """
    Returns only the time.
    Example: 06:00 AM
    """

    if value is None:
        return "Time unavailable"

    try:
        if isinstance(value, (int, float)):
            dt = datetime.fromtimestamp(value, tz=timezone.utc)
        else:
            value = str(value)

            if value.isdigit():
                dt = datetime.fromtimestamp(
                    int(value),
                    tz=timezone.utc
                )
            else:
                dt = datetime.fromisoformat(
                    value.replace("Z", "+00:00")
                )

        return dt.strftime("%I:%M %p")

    except Exception:
        return "Time unavailable"


def get_severity(score):
    if score >= 3:
        return "severe"

    if score >= 2:
        return "warning"

    return "watch"


def generate_weather_alerts(forecast_data):

    alerts = []

    forecast = forecast_data.get("forecast", [])

    if not forecast:
        return alerts

    rain_events = []
    thunderstorm_events = []
    heat_events = []
    cold_events = []
    wind_events = []

    for item in forecast:

        temperature = float(
            item.get("temperature", 0) or 0
        )

        wind_speed = float(
            item.get("wind_speed", 0) or 0
        )

        rain_probability = float(
            item.get("rain_probability", 0) or 0
        )

        condition = str(
            item.get("condition", "")
        ).lower()

        weather_main = str(
            item.get("weather_main", "")
        ).lower()

        forecast_time = item.get("time")

        # -----------------------------
        # THUNDERSTORM
        # -----------------------------

        if (
            "thunderstorm" in condition
            or weather_main == "thunderstorm"
        ):
            thunderstorm_events.append({
                "time": forecast_time,
                "rain_probability": rain_probability
            })

        # -----------------------------
        # RAIN
        # -----------------------------

        if rain_probability >= 60:

            rain_events.append({
                "time": forecast_time,
                "rain_probability": rain_probability
            })

        # -----------------------------
        # EXTREME HEAT
        # -----------------------------

        if temperature >= 40:

            heat_events.append({
                "time": forecast_time,
                "temperature": temperature
            })

        # -----------------------------
        # COLD
        # -----------------------------

        if temperature <= 5:

            cold_events.append({
                "time": forecast_time,
                "temperature": temperature
            })

        # -----------------------------
        # STRONG WIND
        # -----------------------------

        if wind_speed >= 10:

            wind_events.append({
                "time": forecast_time,
                "wind_speed": wind_speed
            })

    # ==================================================
    # THUNDERSTORM ALERT
    # ==================================================

    if thunderstorm_events:

        first_event = thunderstorm_events[0]

        peak_probability = max(
            event["rain_probability"]
            for event in thunderstorm_events
        )

        severity = (
            "severe"
            if peak_probability >= 70
            else "warning"
        )

        alerts.append({

            "type": "thunderstorm",

            "severity": severity,

            "title": "Thunderstorm Risk",

            "short_title": "Thunderstorm",

            "message":
                "Thunderstorm activity is possible during "
                "the upcoming forecast period.",

            "what_it_means":
                "Thunderstorms can bring sudden heavy rain, "
                "lightning, gusty winds and reduced visibility.",

            "recommendation":
                "Avoid unnecessary outdoor activity during "
                "the storm. Stay indoors when lightning is present.",

            "time":
                format_forecast_time(first_event["time"]),

            "time_short":
                get_time_only(first_event["time"]),

            "rain_probability":
                peak_probability
        })

    # ==================================================
    # RAIN ALERT
    # ==================================================

    if rain_events:

        first_event = rain_events[0]

        peak_probability = max(
            event["rain_probability"]
            for event in rain_events
        )

        if peak_probability >= 80:

            severity = "warning"

            title = "Heavy Rain Risk"

            message = (
                "There is a high chance of heavy rainfall "
                "during the upcoming forecast period."
            )

            what_it_means = (
                "Heavy rain can make roads slippery, reduce "
                "visibility and cause temporary waterlogging "
                "in low-lying areas."
            )

            recommendation = (
                "Carry rain protection, allow extra travel time "
                "and avoid waterlogged roads where possible."
            )

        else:

            severity = "watch"

            title = "Rain Possible"

            message = (
                "Rain is likely during part of the upcoming "
                "forecast period."
            )

            what_it_means = (
                "Outdoor conditions may become wet and travel "
                "conditions could change during rainfall."
            )

            recommendation = (
                "Carry an umbrella or rain protection if you "
                "plan to be outdoors."
            )

        alerts.append({

            "type": "rain",

            "severity": severity,

            "title": title,

            "short_title": "Rain",

            "message": message,

            "what_it_means": what_it_means,

            "recommendation": recommendation,

            "time":
                format_forecast_time(first_event["time"]),

            "time_short":
                get_time_only(first_event["time"]),

            "rain_probability":
                peak_probability
        })

    # ==================================================
    # HEAT ALERT
    # ==================================================

    if heat_events:

        hottest = max(
            heat_events,
            key=lambda x: x["temperature"]
        )

        temperature = hottest["temperature"]

        severity = (
            "severe"
            if temperature >= 43
            else "warning"
        )

        alerts.append({

            "type": "heat",

            "severity": severity,

            "title": "Extreme Heat Risk",

            "short_title": "Extreme Heat",

            "message":
                f"Temperature may reach approximately "
                f"{temperature:.0f}°C.",

            "what_it_means":
                "High temperatures can increase the risk "
                "of dehydration, heat exhaustion and discomfort.",

            "recommendation":
                "Stay hydrated, avoid prolonged direct sunlight "
                "and take breaks in cool or shaded areas.",

            "time":
                format_forecast_time(hottest["time"]),

            "time_short":
                get_time_only(hottest["time"]),

            "temperature":
                temperature
        })

    # ==================================================
    # COLD ALERT
    # ==================================================

    if cold_events:

        coldest = min(
            cold_events,
            key=lambda x: x["temperature"]
        )

        temperature = coldest["temperature"]

        severity = (
            "warning"
            if temperature <= 3
            else "watch"
        )

        alerts.append({

            "type": "cold",

            "severity": severity,

            "title": "Cold Weather Risk",

            "short_title": "Cold Weather",

            "message":
                f"Temperature may fall to approximately "
                f"{temperature:.0f}°C.",

            "what_it_means":
                "Lower temperatures may cause discomfort "
                "and colder conditions during the affected period.",

            "recommendation":
                "Dress appropriately and take extra care "
                "during colder periods, especially overnight.",

            "time":
                format_forecast_time(coldest["time"]),

            "time_short":
                get_time_only(coldest["time"]),

            "temperature":
                temperature
        })

    # ==================================================
    # WIND ALERT
    # ==================================================

    if wind_events:

        strongest = max(
            wind_events,
            key=lambda x: x["wind_speed"]
        )

        wind_speed = strongest["wind_speed"]

        severity = (
            "warning"
            if wind_speed >= 15
            else "watch"
        )

        alerts.append({

            "type": "wind",

            "severity": severity,

            "title": "Strong Wind Risk",

            "short_title": "Strong Winds",

            "message":
                f"Wind speeds may reach approximately "
                f"{wind_speed:.1f} m/s.",

            "what_it_means":
                "Strong winds can affect outdoor activities, "
                "travel and exposed structures.",

            "recommendation":
                "Use caution in exposed areas and secure "
                "light outdoor objects when necessary.",

            "time":
                format_forecast_time(strongest["time"]),

            "time_short":
                get_time_only(strongest["time"]),

            "wind_speed":
                wind_speed
        })

    # ==================================================
    # SORT ALERTS
    # ==================================================

    severity_order = {
        "severe": 1,
        "warning": 2,
        "watch": 3
    }

    alerts.sort(
        key=lambda alert:
        severity_order.get(
            alert["severity"],
            99
        )
    )

    return alerts