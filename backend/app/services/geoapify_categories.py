GEOAPIFY_CATEGORY_MAP = {
    # =========================================================
    # HEALTHCARE
    # =========================================================

    "healthcare": "healthcare",
    "clinic": "healthcare.clinic_or_praxis",
    "clinics": "healthcare.clinic_or_praxis",
    "doctor": "healthcare.clinic_or_praxis",
    "doctors": "healthcare.clinic_or_praxis",
    "medical clinic": "healthcare.clinic_or_praxis",
    "medical center": "healthcare.clinic_or_praxis",

    "hospital": "healthcare.hospital",
    "hospitals": "healthcare.hospital",

    "dentist": "healthcare.dentist",
    "dentists": "healthcare.dentist",
    "dental clinic": "healthcare.dentist",

    "pharmacy": "healthcare.pharmacy",
    "pharmacies": "healthcare.pharmacy",

    "veterinary": "healthcare.veterinary",
    "vet": "healthcare.veterinary",
    "veterinarian": "healthcare.veterinary",

    "optician": "healthcare.optician",
    "eye doctor": "healthcare.optician",

    "dermatologist": "healthcare.clinic_or_praxis.dermatology",
    "cardiologist": "healthcare.clinic_or_praxis.cardiology",
    "psychiatrist": "healthcare.clinic_or_praxis.psychiatry",
    "orthopedic": "healthcare.clinic_or_praxis.orthopaedics",
    "gynaecologist": "healthcare.clinic_or_praxis.gynaecology",
    "urologist": "healthcare.clinic_or_praxis.urology",
    "radiology": "healthcare.clinic_or_praxis.radiology",
    "paediatrician": "healthcare.clinic_or_praxis.paediatrics",

    # =========================================================
    # RESTAURANTS / FOOD
    # =========================================================

    "restaurant": "catering.restaurant",
    "restaurants": "catering.restaurant",

    "cafe": "catering.cafe",
    "cafes": "catering.cafe",
    "coffee shop": "catering.cafe",

    "fast food": "catering.fast_food",
    "fast food restaurant": "catering.fast_food",

    "bar": "catering.bar",
    "bars": "catering.bar",

    "pub": "catering.pub",

    "food court": "catering.food_court",

    "bakery": "catering.bakery",
    "bakeries": "catering.bakery",

    "ice cream": "catering.ice_cream",

    "pizza": "catering.restaurant.pizza",

    "burger": "catering.fast_food.burger",

    "kebab": "catering.fast_food.kebab",

    "sushi": "catering.restaurant.sushi",

    "italian restaurant": "catering.restaurant.italian",
    "chinese restaurant": "catering.restaurant.chinese",
    "indian restaurant": "catering.restaurant.indian",
    "japanese restaurant": "catering.restaurant.japanese",
    "mexican restaurant": "catering.restaurant.mexican",

    # =========================================================
    # COMMERCIAL / RETAIL
    # =========================================================

    "commercial": "commercial",
    "shop": "commercial",
    "shops": "commercial",
    "retail": "commercial",

    "supermarket": "commercial.supermarket",
    "supermarkets": "commercial.supermarket",

    "convenience store": "commercial.convenience",

    "shopping mall": "commercial.shopping_mall",
    "shopping center": "commercial.shopping_mall",

    "clothing store": "commercial.clothing",
    "clothing": "commercial.clothing",

    "shoe store": "commercial.clothing.shoes",

    "fashion store": "commercial.clothing",

    "jewelry store": "commercial.jewelry",
    "jewellery store": "commercial.jewelry",

    "watch store": "commercial.watches",

    "electronics store": "commercial.electronics",

    "computer store": "commercial.electronics.computer",

    "mobile phone store": "commercial.electronics.mobile_phone",

    "furniture store": "commercial.furniture",

    "hardware store": "commercial.hardware",

    "bookstore": "commercial.books",

    "gift shop": "commercial.gift",

    "florist": "commercial.florist",
    "flower shop": "commercial.florist",

    "cosmetics store": "commercial.health_beauty.cosmetics",

    "beauty supply": "commercial.health_beauty",

    "sports store": "commercial.outdoor_and_sport",

    "bicycle shop": "commercial.outdoor_and_sport.bicycle",

    "pet shop": "commercial.pet",

    "toy store": "commercial.toys",

    "car parts": "commercial.vehicle_parts",

    "car dealer": "commercial.vehicle_dealer",

    # =========================================================
    # BEAUTY / PERSONAL SERVICES
    # =========================================================

    "beauty salon": "service.beauty",
    "beauty": "service.beauty",

    "hair salon": "service.beauty.hairdresser",
    "hairdresser": "service.beauty.hairdresser",
    "barber": "service.beauty.hairdresser",

    "nail salon": "service.beauty.nail",

    "spa": "leisure.spa",

    "sauna": "leisure.spa.sauna",

    "massage": "service.beauty.massage",

    # =========================================================
    # FITNESS / SPORTS
    # =========================================================

    "gym": "sport.fitness",
    "fitness center": "sport.fitness",
    "fitness": "sport.fitness",

    "sports center": "sport",
    "sports club": "activity.sport_club",

    "stadium": "sport.stadium",

    "swimming pool": "sport.swimming",

    "tennis": "sport.tennis",

    "football": "sport.soccer",

    "golf": "sport.golf",

    "yoga": "sport",

    # =========================================================
    # HOTELS / ACCOMMODATION
    # =========================================================

    "hotel": "accommodation.hotel",
    "hotels": "accommodation.hotel",

    "hostel": "accommodation.hostel",
    "hostels": "accommodation.hostel",

    "motel": "accommodation.motel",

    "guest house": "accommodation.guest_house",
    "guesthouse": "accommodation.guest_house",

    "apartment": "accommodation.apartment",

    "chalet": "accommodation.chalet",

    "camping": "accommodation",

    # =========================================================
    # EDUCATION
    # =========================================================

    "education": "education",
    "school": "education.school",
    "schools": "education.school",

    "college": "education.college",
    "colleges": "education.college",

    "university": "education.university",
    "universities": "education.university",

    "kindergarten": "education.kindergarten",

    "preschool": "education.kindergarten",

    "driving school": "education.driving_school",

    "language school": "education.language_school",

    # =========================================================
    # FINANCE
    # =========================================================

    "bank": "service.financial.bank",
    "banks": "service.financial.bank",

    "atm": "service.financial.atm",

    "insurance": "service.financial.insurance",

    "accountant": "service.financial.accountant",
    "accounting": "service.financial.accountant",

    "tax advisor": "service.financial.tax_advisor",

    # =========================================================
    # LEGAL / PROFESSIONAL SERVICES
    # =========================================================

    "lawyer": "service",
    "lawyers": "service",

    "law firm": "service",

    "notary": "service",

    "consultant": "service",

    "real estate": "office.real_estate",
    "real estate agency": "office.real_estate",

    "estate agent": "office.real_estate",

    # =========================================================
    # AUTOMOTIVE
    # =========================================================

    "car repair": "service.vehicle.repair",
    "auto repair": "service.vehicle.repair",
    "car mechanic": "service.vehicle.repair",
    "mechanic": "service.vehicle.repair",

    "car wash": "service.vehicle.car_wash",

    "car rental": "rental.car",

    "gas station": "service.vehicle.fuel",
    "petrol station": "service.vehicle.fuel",

    "fuel station": "service.vehicle.fuel",

    "ev charging": "service.vehicle.charging_station",
    "charging station": "service.vehicle.charging_station",

    "parking": "parking",

    # =========================================================
    # TRAVEL / TOURISM
    # =========================================================

    "tourism": "tourism",
    "tourist attraction": "tourism",

    "museum": "entertainment.museum",

    "theatre": "entertainment.culture.theatre",
    "theater": "entertainment.culture.theatre",

    "cinema": "entertainment.cinema",

    "theme park": "entertainment.theme_park",

    "zoo": "entertainment.zoo",

    "aquarium": "entertainment.aquarium",

    "tour operator": "service",
    "travel agency": "service",

    # =========================================================
    # ENTERTAINMENT
    # =========================================================

    "entertainment": "entertainment",

    "nightclub": "adult.nightclub",

    "casino": "adult.casino",

    # =========================================================
    # GOVERNMENT / PUBLIC
    # =========================================================

    "government office": "service",
    "post office": "service.post",
    "police": "service",
    "fire station": "service",

    # =========================================================
    # RELIGIOUS
    # =========================================================

    "place of worship": "place_of_worship",
    "mosque": "place_of_worship",
    "church": "place_of_worship",
    "temple": "place_of_worship",
    "synagogue": "place_of_worship",

    # =========================================================
    # PET / ANIMAL
    # =========================================================

    "pet store": "commercial.pet",
    "pet shop": "commercial.pet",

    "veterinary clinic": "healthcare.veterinary",

    # =========================================================
    # OFFICE / BUSINESS
    # =========================================================

    "office": "office",
    "business": "office",
    "company": "office",
    "corporate office": "office",

    # =========================================================
    # PARKS / LEISURE
    # =========================================================

    "park": "leisure.park",
    "parks": "leisure.park",

    "playground": "leisure.playground",

    "picnic": "leisure.picnic",

    "garden": "leisure.park.garden",

    # =========================================================
    # TRANSPORT
    # =========================================================

    "transport": "public_transport",
    "bus station": "public_transport.bus",
    "train station": "public_transport.train",
    "subway": "public_transport.subway",
    "tram": "public_transport.tram",

    # =========================================================
    # AIRPORT
    # =========================================================

    "airport": "airport",
    "international airport": "airport.international",
    "private airport": "airport.private",

    # =========================================================
    # MARITIME
    # =========================================================

    "marina": "maritime.marina",

    # =========================================================
    # BEACH / NATURE
    # =========================================================

    "beach": "beach",
    "beaches": "beach",

    "nature": "natural",

    "national park": "natural",

    # =========================================================
    # LEISURE
    # =========================================================

    "leisure": "leisure",
    "spa": "leisure.spa",
    "sauna": "leisure.spa.sauna",
}