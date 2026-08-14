import json

from google import genai
from google.genai import types

from app.core.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


MODEL_NAME = "gemini-3.1-flash-lite"


LEAD_ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "score": {
            "type": "integer",
            "description": "AI opportunity score from 0 to 100."
        },
        "priority": {
            "type": "string",
            "enum": ["low", "medium", "high"]
        },
        "summary": {
            "type": "string"
        },
        "opportunities": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "recommended_services": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "outreach_angle": {
            "type": "string"
        }
    },
    "required": [
        "score",
        "priority",
        "summary",
        "opportunities",
        "recommended_services",
        "outreach_angle"
    ]
}


def analyze_lead(qualified_lead: dict) -> dict:

    prompt = f"""
You are the AI sales intelligence engine inside LeadForge.

The following business has ALREADY passed LeadForge's
qualification system.

You must NOT determine whether the lead is qualified.

Your job is to deeply analyze this qualified lead and
identify realistic commercial opportunities for a:

- Web development agency
- Software development agency
- AI automation agency

QUALIFIED LEAD DATA:

{json.dumps(qualified_lead, indent=2, default=str)}

Analyze:

1. AI opportunity score from 0 to 100.
2. Priority: low, medium, or high.
3. Concise business summary.
4. Potential business opportunities.
5. Recommended services.
6. Personalized outreach angle.

IMPORTANT:

- Do not invent facts.
- Only use information provided.
- Do not claim a website is poor without evidence.
- Do not assume a business needs a service without evidence.
- Focus on realistic commercial opportunities.
- This lead has already been qualified by LeadForge.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_json_schema=LEAD_ANALYSIS_SCHEMA,
            temperature=0.2,
        ),
    )

    if not response.text:
        raise RuntimeError(
            "Gemini returned an empty response"
        )

    try:
        return json.loads(response.text)

    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Gemini returned invalid JSON"
        ) from exc