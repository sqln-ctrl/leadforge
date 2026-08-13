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
            "description": "Lead quality score from 0 to 100."
        },
        "priority": {
            "type": "string",
            "enum": ["low", "medium", "high"]
        },
        "summary": {
            "type": "string"
        },
        "strengths": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "weaknesses": {
            "type": "array",
            "items": {
                "type": "string"
            }
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
        "strengths",
        "weaknesses",
        "opportunities",
        "recommended_services",
        "outreach_angle"
    ]
}


def analyze_lead(business: dict) -> dict:

    prompt = f"""
You are an expert B2B sales intelligence assistant for LeadForge.

LeadForge helps web developers, software agencies, and AI automation
agencies identify businesses that may need their services.

Analyze the following business lead.

BUSINESS DATA:

{json.dumps(business, indent=2, default=str)}

Your job is to determine how valuable this business is as a potential
sales prospect.

Evaluate:

1. Lead quality from 0 to 100.
2. Priority: low, medium, or high.
3. Short summary.
4. Business strengths.
5. Potential weaknesses.
6. Possible website, software, or AI automation opportunities.
7. Services that could realistically be offered to this business.
8. A personalized outreach angle.

IMPORTANT RULES:

- Do not invent facts.
- Only use information provided in the business data.
- If important information is missing, acknowledge that.
- Do not claim that a business has a bad website unless there is
  evidence for it.
- Focus on realistic opportunities for web development,
  software development, and AI automation.
- A business having a website does NOT automatically mean the
  website is bad.
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

    return json.loads(response.text)