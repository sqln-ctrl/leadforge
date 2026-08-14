import json

from google import genai
from google.genai import types

from app.core.config import settings


MODEL_NAME = "gemini-3.5-flash"


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


def generate_proposal(
    lead_data: dict,
    services: list[str],
) -> dict:

    services_text = "\n".join(
        f"- {service}"
        for service in services
    )

    prompt = f"""
You are an expert B2B sales copywriter.

Create a personalized sales proposal for the following qualified business.

IMPORTANT RULES:

1. The proposal must be professional and natural.
2. Do not make unsupported claims about the business.
3. Do not pretend that you visited or audited their website unless website information was explicitly provided.
4. Do not invent business problems.
5. Use the available business information to make reasonable observations.
6. Recommend only services that are relevant to this business.
7. Do not recommend every service just because it is available.
8. The proposal should sound human, not like generic AI marketing.
9. Keep it concise enough to be sent as an outreach email.
10. Do not include fake statistics, fake clients, fake results, or fake guarantees.
11. Do not include pricing unless pricing is explicitly provided.
12. Address the business by its name.
13. Focus on the value the recommended services can provide.
14. The call to action should invite a conversation or quick discussion.
15. Return ONLY valid JSON matching the requested structure.
16. It should be in email outreach format, with a subject line.
QUALIFIED LEAD:

Business name:
{lead_data.get("name")}

Website:
{lead_data.get("website")}

Industry:
{lead_data.get("industry")}

Location:
{lead_data.get("location")}

Phone:
{lead_data.get("phone")}

Email:
{lead_data.get("email")}

Lead score:
{lead_data.get("lead_score")}

Available services:

{services_text}

Generate a personalized proposal.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "subject": {
                        "type": "string",
                    },
                    "greeting": {
                        "type": "string",
                    },
                    "introduction": {
                        "type": "string",
                    },
                    "identified_problem": {
                        "type": "string",
                    },
                    "proposed_solution": {
                        "type": "string",
                    },
                    "services": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                    "benefits": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                    "call_to_action": {
                        "type": "string",
                    },
                    "closing": {
                        "type": "string",
                    },
                    "full_proposal": {
                        "type": "string",
                    },
                },
                "required": [
                    "subject",
                    "greeting",
                    "introduction",
                    "identified_problem",
                    "proposed_solution",
                    "services",
                    "benefits",
                    "call_to_action",
                    "closing",
                    "full_proposal",
                ],
            },
        ),
    )

    if not response.text:
        raise ValueError(
            "Gemini returned an empty proposal."
        )

    try:
        result = json.loads(response.text)

    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Gemini returned invalid JSON: {exc}"
        )

    return result