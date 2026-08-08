"""
OpenStreetMap-based business discovery -- replaces Google Places.

No API key, no billing account, no card, ever. Two free, community-run
services chained together:
1. Nominatim -- turns "Lahore, Pakistan" into a bounding box
2. Overpass  -- queries OSM's raw map data for matching businesses within
   that box

Trade-off vs Google Places: data coverage/completeness varies by region
(well-mapped cities are great, some areas are thin), and category
matching is looser since OSM's tagging system doesn't map 1:1 onto
Google's category list. Both services ask for a descriptive User-Agent
and a max of ~1 request/second -- this is a courtesy/fair-use policy,
not a billing mechanism, so there's no card involved at any usage level.
"""

import httpx

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Required by Nominatim's usage policy -- requests without a descriptive
# User-Agent get blocked. Update the contact info if this becomes a real
# deployment, not just local dev.
USER_AGENT = "LeadForge/1.0 (dev; contact: codewithsqln@gmail.com)"

# Common categories mapped to their OSM tag. Add more here as you need
# them -- this is the main thing that grows over time with this approach.
CATEGORY_TAG_MAP = {
    "restaurant": ("amenity", "restaurant"),
    "cafe": ("amenity", "cafe"),
    "coffee shop": ("amenity", "cafe"),
    "bakery": ("shop", "bakery"),
    "bar": ("amenity", "bar"),
    "gym": ("leisure", "fitness_centre"),
    "salon": ("shop", "hairdresser"),
    "spa": ("shop", "beauty"),
    "dentist": ("amenity", "dentist"),
    "doctor": ("amenity", "doctors"),
    "clinic": ("amenity", "clinic"),
    "lawyer": ("office", "lawyer"),
    "accountant": ("office", "accountant"),
    "hotel": ("tourism", "hotel"),
    "pharmacy": ("amenity", "pharmacy"),
    "supermarket": ("shop", "supermarket"),
    "gas station": ("amenity", "fuel"),
    "car repair": ("shop", "car_repair"),
    "real estate": ("office", "estate_agent"),
}


class OverpassError(Exception):
    """Raised when geocoding or the Overpass query fails."""


def _singular(category: str) -> str:
    lowered = category.strip().lower()
    return lowered[:-1] if lowered.endswith("s") and lowered not in CATEGORY_TAG_MAP else lowered


def geocode_city(city: str, country: str | None = None) -> tuple[float, float, float, float]:
    """Returns (south, north, west, east) bounding box for a city name."""
    query = f"{city}, {country}" if country else city
    try:
        response = httpx.get(
            NOMINATIM_URL,
            params={"city": city, "country": country, "format": "json", "limit": 1},
            headers={"User-Agent": USER_AGENT},
            timeout=10.0,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise OverpassError(f"Nominatim returned {exc.response.status_code}") from exc
    except httpx.RequestError as exc:
        raise OverpassError(f"Could not reach Nominatim: {exc}") from exc

    results = response.json()
    if not results:
        raise OverpassError(f"Could not geocode '{query}' -- check the city/country spelling")

    bbox = results[0]["boundingbox"]  # [south, north, west, east] as strings
    return tuple(float(v) for v in bbox)  # type: ignore[return-value]


def search_places(city: str, category: str, country: str | None = None) -> list[dict]:
    """
    Search OpenStreetMap for businesses matching `category` in `city`.
    Returns the same normalized shape as the old Google Places service:
    {name, website, phone, location, industry, source, external_id}
    """
    south, north, west, east = geocode_city(city, country)
    bbox = f"{south},{west},{north},{east}"

    tag = CATEGORY_TAG_MAP.get(_singular(category))
    if tag:
        key, value = tag
        selector = f'["{key}"="{value}"]'
    else:
        # No mapped tag -- fall back to a loose name match. Noisier, but
        # better than returning nothing for an unmapped category.
        selector = f'["name"~"{category}",i]'

    overpass_query = f"""
    [out:json][timeout:25];
    (
      node{selector}({bbox});
      way{selector}({bbox});
    );
    out center 50;
    """

    try:
        response = httpx.post(
            OVERPASS_URL,
            data={"data": overpass_query},
            headers={"User-Agent": USER_AGENT},
            timeout=30.0,
        )
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise OverpassError(f"Overpass API returned {exc.response.status_code}") from exc
    except httpx.RequestError as exc:
        raise OverpassError(f"Could not reach Overpass API: {exc}") from exc

    elements = response.json().get("elements", [])

    results = []
    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name:
            continue  # skip unnamed map features -- not usable as a lead

        address_parts = [
            tags.get("addr:housenumber"),
            tags.get("addr:street"),
            tags.get("addr:city") or city,
        ]
        location = ", ".join(p for p in address_parts if p) or city

        results.append(
            {
                "name": name,
                "website": tags.get("website") or tags.get("contact:website"),
                "phone": tags.get("phone") or tags.get("contact:phone"),
                "location": location,
                "industry": category,
                "source": "openstreetmap",
                "external_id": f"{el.get('type')}/{el.get('id')}",
            }
        )
    return results