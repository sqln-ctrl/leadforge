# Lead Forge AI-Powered Lead Generation 

A SaaS platform that discovers businesses, enriches their profiles, audits their online presence, scores lead quality, and helps agencies acquire clients for ai automation, web/app dev, and digital marketing.

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [System Flow](#system-flow)
- [User Roles](#user-roles)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [External APIs](#external-apis)
- [Database Entities](#database-entities)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Roadmap](#development-roadmap)
- [Future Roadmap](#future-roadmap)

## Overview

This platform automates the top of the client-acquisition funnel for agencies: find businesses in a target city/category, pull together their contact and web-presence data, score how strong a lead they are, and hand agencies a ranked, exportable list with AI-generated outreach angles.

## Objectives

- Discover businesses by city, country, and category
- Aggregate data from multiple external APIs
- Analyze websites and social presence
- Generate qualified leads with scores
- Export leads and manage outreach

## System Flow

```
Search -> Discover Businesses -> Enrich Data -> Audit Website -> Score Lead -> Export / Outreach
```

## User Roles

| Role | Description |
|---|---|
| Administrator | Full system access, API management, user management |
| Agency Owner | Manages the agency's lead pipeline and team |
| Sales Team | Works leads, updates CRM notes and outreach status |
| Viewer | Read-only access to leads and analytics |

## Features

**Functional**
- Authentication and role-based access control (RBAC)
- Business search and discovery
- Lead enrichment (emails, phones, domains)
- Website audit (speed, SSL, mobile-friendliness)
- Technology detection
- Social profile discovery
- AI-driven lead scoring
- Search, filter, and tagging
- CSV/Excel export
- CRM notes and outreach status tracking
- Analytics dashboard
- API management

**AI Features**
- Lead scoring
- Website quality summaries
- Personalized outreach suggestions
- Duplicate detection

**Non-Functional**
- Responsive UI
- Scalable architecture
- Secure authentication
- API rate limiting
- Caching
- Logging
- 99.9% availability target

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | FastAPI |
| Database | PostgreSQL |
| Cache | Redis |
| Task Queue | Celery |
| Search (optional) | Elasticsearch / OpenSearch |
| Storage | S3-compatible |
| Deployment | Docker + Nginx |

## External APIs

- Google Places
- OpenStreetMap Overpass
- Hunter.io
- PageSpeed Insights
- Wappalyzer / BuiltWith
- RDAP / WHOIS
- Yelp / Foursquare (optional)

## Database Entities

`Users` · `Businesses` · `Contacts` · `Websites` · `Audits` · `Lead Scores` · `API Logs` · `Outreach History`

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── models/        # SQLAlchemy models
│   │   ├── services/      # Business logic, external API integrations
│   │   ├── workers/       # Celery tasks
│   │   └── core/          # Config, security, DB session
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (frontend)
- Python 3.11+ (backend)

### Local Setup

```bash
# clone the repo
git clone <repo-url>
cd <repo-name>

# copy environment variables
cp .env.example .env

# start backend, database, redis, and celery
docker compose up --build

# in a separate terminal, start the frontend
cd frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for the full list. Key variables include:

```
DATABASE_URL=
REDIS_URL=
SECRET_KEY=
GOOGLE_PLACES_API_KEY=
HUNTER_IO_API_KEY=
PAGESPEED_API_KEY=
```

## Development Roadmap

The build is organized into 9 phases — see `Lead_Generation_Platform_Development_Plan.docx` for full details:

| Phase | Focus |
|---|---|
| 0 | Project setup & architecture |
| 1 | Authentication & core infrastructure |
| 2 | Business discovery & search |
| 3 | Lead enrichment |
| 4 | Website audit engine |
| 5 | Lead scoring & AI features |
| 6 | CRM, export & analytics dashboard |
| 7 | Testing, security & deployment |
| 8 | Launch & post-launch roadmap |

## Future Roadmap

- Chrome extension
- Email sequencing
- AI chatbot
- Team workspaces
- Marketplace integrations

## License

Private Project
