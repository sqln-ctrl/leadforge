import requests

from app.core.config import settings


class GooglePlacesError(Exception):
    """Raised when a Google Places API request cannot be completed."""


SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PAGE_SIZE = 20
MAX_PROVIDER_RESULTS = 60
FIELD_MASK = ",".join(
    [
        "places.displayName",
        "places.formattedAddress",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.primaryType",
    ]
)


def search_places(
    city: str,
    category: str,
    country: str | None = None,
    limit: int = 20,
) -> list[dict]:
    """Search businesses with Places API (New) Text Search.

    Google returns at most 20 results per page and 60 results across a Text
    Search. Requesting more than that is handled by the API endpoint, which
    reports the provider cap to the client.
    """
    location = ", ".join(part for part in (city, country) if part)
    target_count = min(limit, MAX_PROVIDER_RESULTS)
    base_payload = {
        "textQuery": f"{category} in {location}",
        "languageCode": "en",
    }
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": FIELD_MASK,
    }

    results = []
    page_token = None

    while len(results) < target_count:
        payload = {
            **base_payload,
            "pageSize": min(PAGE_SIZE, target_count - len(results)),
        }

        if page_token:
            payload["pageToken"] = page_token

        try:
            response = requests.post(
                SEARCH_URL,
                json=payload,
                headers=headers,
                timeout=15,
            )
            response.raise_for_status()
            data = response.json()
        except (requests.RequestException, ValueError) as exc:
            raise GooglePlacesError(
                f"Google Places Text Search failed: {exc}"
            ) from exc

        for place in data.get("places", []):
            display_name = place.get("displayName", {})
            name = (
                display_name.get("text")
                if isinstance(display_name, dict)
                else display_name
            )

            results.append(
                {
                    "name": name,
                    "website": place.get("websiteUri"),
                    "industry": category,
                    "location": place.get("formattedAddress"),
                    "phone": place.get("nationalPhoneNumber"),
                    "source": "google_maps",
                }
            )

        page_token = data.get("nextPageToken")
        if not page_token or not data.get("places"):
            break

    return results
