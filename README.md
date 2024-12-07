# Clean Cooking Smart Library

A smart search and exploration platform for clean cooking research papers and documents. This application provides natural language search capabilities and framework-based exploration of clean cooking research.

## Features

- 🔍 Natural Language Search using OpenAI
- 📚 Framework-based Research Exploration
- 🏷️ Smart Tagging and Categorization
- 📊 Research Context and Summaries
- 🌐 Hybrid Search (Internal Database + Whitelisted Sources)

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- OpenAI API
- Alembic for database migrations

### Frontend
- React with TypeScript
- Tailwind CSS
- React Query
- Shadcn UI Components
- Axios for API calls

## Prerequisites

- Docker and Docker Compose
- OpenAI API Key
- Git

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
cd clean-cooking-library
```

2. Create environment files

Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@db:5432/cleandb
OPENAI_API_KEY=your_openai_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key
```

3. Build and start the application
```bash
# Build and start all services
docker-compose up --build

# To run in detached mode
docker-compose up -d --build
```

4. Initialize the database
```bash
# Run database migrations
docker-compose exec backend alembic upgrade head

# Optional: Create a test document
curl -X 'POST' \
  'http://localhost:8000/api/v1/documents/' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Clean Cooking Adoption in Urban Areas",
    "summary": "A study of adoption challenges in urban areas shows that cost and availability are major barriers.",
    "source_url": "https://example.com/paper1",
    "year_published": 2023,
    "tags": [
      {"name": "Urban", "category": "region"},
      {"name": "Adoption", "category": "topic"},
      {"name": "Barriers", "category": "topic"}
    ]
  }'
```

## Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Database: localhost:5432 (PostgreSQL)

## Development

### Project Structure
```
clean-cooking-library/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configurations
│   │   ├── crud/         # Database operations
│   │   ├── db/           # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   └── alembic/          # Database migrations
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── public/
└── docker/               # Docker configurations
```

### Working with the Database

Connect to the database:
```bash
# Using psql inside the container
docker-compose exec db psql -U user -d cleandb

# Common psql commands
\dt         # List tables
\d tablename # Describe table
\q          # Quit psql
```

### Running Tests (TODO)
```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
docker-compose exec frontend npm test
```

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Remove all containers and volumes (clean start)
docker-compose down -v

# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh
```

### Database clean up
For any changes made to the initial migration scripts, the database should be recreated, dropping the DB volume 

```
docker volume rm clean-cooking-library_postgres_data
```

## API Endpoints

### Documents
- `POST /api/v1/documents/` - Create new document
- `GET /api/v1/documents/` - List documents
- `GET /api/v1/documents/{id}` - Get specific document

### Search
- `POST /api/v1/search/` - Search documents
  - Supports natural language queries
  - Optional filters for region and topic

### Framework Exploration
- `GET /api/v1/documents/framework/{framework}` - Get documents by framework

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license here]

## Contact

[Add your contact information]
