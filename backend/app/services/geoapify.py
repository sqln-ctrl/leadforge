import requests
from app.services.geoapify_categories import GEOAPIFY_CATEGORY_MAP
from app.core.config import settings


class GeoapifyError(Exception):
    pass


def search_places(
    city: str,
    category: str,
    country: str | None = None,
    limit: int = 20,
):
    # -------------------------
    # 1. Geocode the city
    # -------------------------
    geocode_url = "https://api.geoapify.com/v1/geocode/search"

    geocode_params = {
        "text": f"{city}, {country}" if country else city,
        "apiKey": settings.GEOAPIFY_API_KEY,
        "limit": 1,
    }

    try:
        geocode_response = requests.get(
            geocode_url,
            params=geocode_params,
            timeout=10,
        )

       

        geocode_response.raise_for_status()

        geocode_data = geocode_response.json()

    except requests.RequestException as exc:
        raise GeoapifyError(
            f"Geoapify geocoding failed: {exc}"
        ) from exc

    features = geocode_data.get("features", [])

    if not features:
        return []

    try:
        coordinates = features[0]["geometry"]["coordinates"]

        longitude = coordinates[0]
        latitude = coordinates[1]

    except (KeyError, IndexError, TypeError) as exc:
        raise GeoapifyError(
            f"Invalid geocoding response from Geoapify: {exc}"
        ) from exc

    # -------------------------
    # 2. Search businesses
    # -------------------------
    places_url = "https://api.geoapify.com/v2/places"

    category_key = category.lower().strip()

    geoapify_category = GEOAPIFY_CATEGORY_MAP.get(
            category_key,
            category_key,
    )

    params = {
        "categories": geoapify_category,
        "filter": f"circle:{longitude},{latitude},5000",
        "limit": limit,
        "apiKey": settings.GEOAPIFY_API_KEY,
    }

    try:
        response = requests.get(
            places_url,
            params=params,
            timeout=10,
        )

      

        response.raise_for_status()

        data = response.json()

    except requests.RequestException as exc:
        raise GeoapifyError(
            f"Geoapify places search failed: {exc}"
        ) from exc

    results = []

    for feature in data.get("features", []):
        properties = feature.get("properties", {})

        results.append(
            {
                "name": properties.get("name"),
                "website": properties.get("website"),
                "industry": category,
                "location": properties.get("formatted"),
                "phone": properties.get("contact", {}).get("phone")
                or properties.get("phone"),
                "source": "geoapify",
            }
        )

    return results