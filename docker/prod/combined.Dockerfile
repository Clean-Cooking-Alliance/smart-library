# Start with Node.js for building the frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Use Python image for the final container
FROM python:3.11-slim

WORKDIR /app

# Install Node.js and npm for serving frontend
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install serve for frontend
RUN npm install -g serve

# Copy backend code
COPY backend/ .

# Copy built frontend files
COPY --from=frontend-builder /frontend/dist /app/static

# Add startup script
COPY docker/prod/start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV PYTHONPATH=/app

EXPOSE 8000 3000

CMD ["/app/start.sh"]